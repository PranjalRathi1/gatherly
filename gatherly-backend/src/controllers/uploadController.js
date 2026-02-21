import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// @desc    Generate pre-signed URL for image upload
// @route   POST /api/uploads/chat-image
// @access  Private
export const generateUploadUrl = async (req, res) => {
    try {
        const { filename, fileType, fileSize } = req.body;

        // 1. Validation
        if (!filename || !fileType) {
            return res.status(400).json({
                success: false,
                message: 'Filename and fileType are required'
            });
        }

        // Validate File Type (Image only)
        if (!fileType.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                message: 'Only image files are allowed'
            });
        }

        // Validate File Size (Max 5MB)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (fileSize && fileSize > MAX_SIZE) {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Max 5MB allowed.'
            });
        }

        // 2. Prepare S3 Key
        const timestamp = Date.now();
        const cleanFilename = filename.replace(/\s+/g, '-');
        const key = `events/${req.user._id}/${timestamp}-${cleanFilename}`;

        // 3. Generate Signed URL
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            ContentType: fileType
            // We can't strictly enforce ContentLength here with PutObjectCommand/getSignedUrl
            // without using a presigned POST policy, but we validated the declared size above.
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

        // 4. Construct Public URL
        // Assumes bucket is public or CloudFront is used (User requirement: "Images should be publicly readable via URL")
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        res.status(200).json({
            success: true,
            uploadUrl,
            imageUrl
        });

    } catch (error) {
        console.error('Upload URL generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error generating upload URL'
        });
    }
};
