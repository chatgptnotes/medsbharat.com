# Cloudinary Setup Complete ✅

## Local Environment (.env)
Already configured with your credentials:

```env
CLOUDINARY_CLOUD_NAME="dqkd1smon"
CLOUDINARY_API_KEY="357944214185254"
CLOUDINARY_API_SECRET="j03un12v9nnTiXgeLQKIFOSbG4E"
CLOUDINARY_URL="cloudinary://357944214185254:j03un12v9nnTiXgeLQKIFOSbG4E@dqkd1smon"
```

## Vercel Production Setup

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/chatgptnotes/medsbharat/settings/environment-variables
2. Add each variable for **Production, Preview, Development**:

| Variable Name | Value |
|---------------|-------|
| `CLOUDINARY_CLOUD_NAME` | `dqkd1smon` |
| `CLOUDINARY_API_KEY` | `357944214185254` |
| `CLOUDINARY_API_SECRET` | `j03un12v9nnTiXgeLQKIFOSbG4E` |
| `CLOUDINARY_URL` | `cloudinary://357944214185254:j03un12v9nnTiXgeLQKIFOSbG4E@dqkd1smon` |

3. Click "Save"
4. Redeploy: https://vercel.com/chatgptnotes/medsbharat

### Option 2: Via Vercel CLI

```bash
# From project directory
cd /Users/murali/1backup/medsbharat.com

# Add environment variables
echo "dqkd1smon" | vercel env add CLOUDINARY_CLOUD_NAME production
echo "357944214185254" | vercel env add CLOUDINARY_API_KEY production
echo "j03un12v9nnTiXgeLQKIFOSbG4E" | vercel env add CLOUDINARY_API_SECRET production
echo "cloudinary://357944214185254:j03un12v9nnTiXgeLQKIFOSbG4E@dqkd1smon" | vercel env add CLOUDINARY_URL production

# Deploy
vercel --prod
```

## Testing Prescription Upload

### Local Testing (http://localhost:3000)

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Test flow:
   - Browse medicines → Add to cart
   - Go to cart → Proceed to checkout
   - Upload prescription (JPG, PNG, or PDF max 5MB)
   - Fill delivery address
   - Place order

3. Check Cloudinary dashboard:
   - Go to: https://console.cloudinary.com/pm/c-ded857d5c22f7a5cf8b72f9d3a77e5/media-explorer/medsbharat/prescriptions
   - You should see uploaded prescriptions

### Production Testing (https://medsbharat.vercel.app)

After adding env vars to Vercel:
1. Wait for automatic redeployment
2. Test same flow as above
3. Verify uploads in Cloudinary dashboard

## Cloudinary Account Details

- **Cloud Name:** dqkd1smon
- **Dashboard:** https://console.cloudinary.com
- **Free Tier Limits:**
  - 25 GB storage
  - 25 GB bandwidth/month
  - Unlimited transformations

## Prescription Storage Structure

```
cloudinary://
└── medsbharat/
    └── prescriptions/
        ├── prescription_123456789_abc.jpg
        ├── prescription_123456790_def.pdf
        └── ...
```

## Next Steps

✅ Cloudinary credentials configured
⬜ Add to Vercel environment variables (use Option 1 or 2 above)
⬜ Test prescription upload locally
⬜ Deploy to production
⬜ Test prescription upload on production

---

**Generated:** December 31, 2024
**Version:** 1.8
**Repository:** chatgptnotes/medsbharat.com
