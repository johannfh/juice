import { jungleStretchesTable, signupsTable } from '@/lib/airtable';
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
    const stretchId = uuidv4();

    // Create new record in jungleStretches with a reference to the Signups record
    jungleStretchesTable.create({
      ID: stretchId,
      Signups: [signupRecord.id], // Link to the Signups record
      startTime: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Jungle stretch started',
      stretchId,
    });
  } catch (error) {
    console.error('Error starting jungle stretch:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting jungle stretch',
    });
  }
} 