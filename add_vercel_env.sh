#!/bin/bash
# Add Cloudinary environment variables to Vercel

echo "Adding Cloudinary environment variables to Vercel..."

vercel env add CLOUDINARY_CLOUD_NAME production << ANSWER
dqkd1smon
ANSWER

vercel env add CLOUDINARY_API_KEY production << ANSWER
357944214185254
ANSWER

vercel env add CLOUDINARY_API_SECRET production << ANSWER
j03un12v9nnTiXgeLQKIFOSbG4E
ANSWER

vercel env add CLOUDINARY_URL production << ANSWER
cloudinary://357944214185254:j03un12v9nnTiXgeLQKIFOSbG4E@dqkd1smon
ANSWER

echo "✅ Cloudinary environment variables added to Vercel!"
echo "Now triggering a new deployment..."

vercel --prod

