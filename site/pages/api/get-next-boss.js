import { jungleBossesFoughtTable, jungleBossesTable, signupsTable } from "@/lib/airtable";

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { token } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await signupsTable.select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const signupRecord = signupRecords[0];

    const records = await jungleBossesTable.select().firstPage();

    // const jungleBossesFought = signupRecord.fields.jungleBossesFought || [];
    // console.log(jungleBossesFought)
    // Fetch jungle bosses fought by Airtable record ID
    const jungleBossesFoughtRecords = await jungleBossesFoughtTable.select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`,
    }).firstPage();

    const jungleBossesFoughtIds = jungleBossesFoughtRecords.map(jungleBossFought => jungleBossFought.fields.jungleBoss[0])
    console.log(jungleBossesFoughtIds)

    // Filter jungle bosses not fought and sort by hours
    const jungleBossesNotFought = records
      .filter(record => !jungleBossesFoughtIds.includes(record.id) && record.fields.hours)
      .sort((a, b) => a.fields.hours - b.fields.hours);

    // console.log(jungleBossesNotFought);
    if (!jungleBossesNotFought || jungleBossesNotFought.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No jungle bosses left to fight',
      });
    }

    // Calculate time to fight the next boss not fought
    res.status(200).json({ 
      success: true,
      timeToNextBoss: jungleBossesNotFought[0].fields.hours - signupRecord.fields.totalJungleHours,
      boss: jungleBossesNotFought[0].fields,
    });
  } catch (error) {
    console.error('Error resuming jungle stretch:', error);
    res.status(500).json({ message: 'Error resuming jungle stretch' });
  }
} 