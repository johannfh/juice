import { signupsTable, tamagotchiTable } from "@/lib/airtable";

/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
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

    // Check if user already has a Tamagotchi
    const existingTamagotchi = await tamagotchiTable.select({
      filterByFormula: `{user} = '${signupRecord.fields.email}'`,
      maxRecords: 1,
    }).firstPage();

    if (existingTamagotchi && existingTamagotchi.length > 0) {
      return res.status(200).json({
        success: false,
        message: 'Tamagotchi already exists',
      });
    }

    // Use exact UTC timestamp
    const startDate = new Date().toISOString();

    // Create new Tamagotchi record with a link to the Signups record
    const record = await tamagotchiTable.create([
      {
        fields: {
          user: [signupRecord.id],
          startDate: startDate, // Use full ISO string with time
          isAlive: true,
          streakNumber: 0.0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      record: record[0],
    });
  } catch (error) {
    console.error('Error creating Tamagotchi:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Tamagotchi',
    });
  }
} 