# Cloudinary Setup Guide

This application uses Cloudinary for cloud-based image storage and management. Follow these steps to set up Cloudinary integration.

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the Dashboard tab
3. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 4. Folder Structure

The application automatically creates a folder structure in Cloudinary based on your site name:

```
your-site-name-slug/
├── logo/
├── favicon/
├── hero/
└── gallery/
```

For example, if your site name is "Tang Mow Hotel", the folder structure will be:

```
tang-mow-hotel/
├── logo/
├── favicon/
├── hero/
└── gallery/
```

## 5. Features

### Automatic Organization

- Images are automatically organized into folders by type
- Logo and favicon uploads replace existing files to maintain consistent URLs
- Gallery and hero images allow multiple uploads

### Optimized Delivery

- Images are automatically optimized for web delivery
- Multiple format support (JPEG, PNG, WebP, SVG)
- CDN delivery for fast loading worldwide

### Persistent Storage

- Images persist across server restarts
- No storage limits based on your Cloudinary plan
- Automatic backup and redundancy

## 6. Usage

Once configured, the application will automatically:

1. **Upload images to Cloudinary** when you use the admin upload features
2. **Update database records** with Cloudinary URLs
3. **Display images** from Cloudinary CDN
4. **Handle errors gracefully** if Cloudinary is unavailable

## 7. Benefits Over Local Storage

- ✅ **Persistent**: Images survive server restarts
- ✅ **Scalable**: No local disk space limitations
- ✅ **Fast**: Global CDN delivery
- ✅ **Optimized**: Automatic image optimization
- ✅ **Reliable**: Enterprise-grade infrastructure
- ✅ **Cost-effective**: Free tier includes generous limits

## 8. Troubleshooting

### Images not uploading

1. Check that all environment variables are set correctly
2. Verify your Cloudinary credentials are valid
3. Check the browser console for error messages

### Images not displaying

1. Ensure Next.js config includes Cloudinary domains
2. Check that the image URLs are valid Cloudinary URLs
3. Verify your Cloudinary account is active

### Folder not created

1. The folder structure is created automatically on first upload
2. Check your Cloudinary Media Library to see the folder structure
3. Ensure the site name is properly slugified

## 9. Free Tier Limits

Cloudinary's free tier includes:

- 25 GB storage
- 25 GB monthly bandwidth
- 1,000 transformations per month
- All core features

This is generous for most hotel websites. You can upgrade if you need more resources.

## 10. Support

If you encounter issues with Cloudinary integration:

1. Check the [Cloudinary documentation](https://cloudinary.com/documentation)
2. Review the application logs for error messages
3. Contact Cloudinary support for account-specific issues
