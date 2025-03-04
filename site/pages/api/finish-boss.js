import { jungleBossesFoughtTable, jungleBossesTable, jungleStretchesTable, signupsTable } from '@/lib/airtable';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { token, githubLink, itchLink } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await signupsTable.select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1,
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const signupRecord = signupRecords[0];

    // generate uuid for the stretch
    const stretchId = uuidv4();

    const records = await jungleBossesTable.select().firstPage();
    const jungleBossesFoughtRecords = await jungleBossesFoughtTable.select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`,
    }).firstPage();

    const jungleBossesFoughtIds = jungleBossesFoughtRecords.map(jungleBossFought => jungleBossFought.fields.jungleBoss[0])

    // Filter jungle bosses not fought
    const jungleBossesNotFought = records
      .filter(record => !jungleBossesFoughtIds.includes(record.id) && record.fields.hours)
      .sort((a, b) => a.fields.hours - b.fields.hours);
    console.log(jungleBossesNotFought);

    // Create new record in jungleStretches with a reference to the Signups record
    const bossFought = await jungleBossesFoughtTable.create({
      ID: stretchId,
      githubLink,
      itchLink,
      user: [signupRecord.id], // Link to the Signups record
      timeFought: new Date().toISOString(),
      jungleBoss: [jungleBossesNotFought[0].id],
    });


    const jungleStretchesRecords = await jungleStretchesTable.select({
      filterByFormula: `
            AND(
            {email (from Signups)} = '${signupRecord.fields.email}',
            ({endtime}),
            NOT({isCanceled})
            )
        `,
    }).all();

    if (!jungleStretchesRecords || jungleStretchesRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Jungle stretch not found',
      });
    }

    let maxHours = jungleBossesNotFought[0].fields.hours

    for (let i = 0; i < jungleStretchesRecords.length; i++) {
      const jungleStretchesRecord = jungleStretchesRecords[i];
      const currentBossesFought = jungleStretchesRecord.fields.jungleBossesFought || [];

      // Await the update operation
      const jungleStretch = await jungleStretchesTable.update(
        jungleStretchesRecord.id,
        {
          jungleBossesFought: [...currentBossesFought, bossFought.id],
          jungleBossesFoughtFiltered: [...currentBossesFought, bossFought.id],
          countsForBoss: maxHours >= 0 ? true : false,
        },
      );

      maxHours -= jungleStretch.fields.timeWorkedHours;
    }
    
    res.status(200).json({
      success: true,
      message: 'Finished boss',
      stretchId: stretchId,
    });
  } catch (error) {
    console.error('Error starting jungle stretch:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting jungle stretch',
    });
  }
} 