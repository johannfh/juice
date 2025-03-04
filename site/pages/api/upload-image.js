import formidable from 'formidable';
import fs from 'fs';

/** @type {import('next').PageConfig} */
export const config = {
    api: {
        bodyParser: false,
    },
};


/** @type {import('next').NextApiHandler} */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
        });
    }

    try {
        const form = new formidable.IncomingForm();

        /**
         * Parse out the files from the form using formidable
         * @type {import('formidable').Files<string>}
         */
        const files = await new Promise((resolve, reject) => {
            // fields are not needed later, only files
            form.parse(req, (err, _fields, files) => {
                if (err) reject(err);
                resolve(files);
            });
        });

        const file = files.file;
        const fileContent = fs.readFileSync(file.filepath);

        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `card-images/${Date.now()}-${file.originalFilename}`,
            Body: fileContent,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }).promise();

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        res.status(200).json({
            success: true,
            url: uploadResult.Location,
        });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload image',
        });
    }
} 