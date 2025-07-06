# Maintenance Section - Cloud Storage

The maintenance section has been updated to work with Cloudinary cloud storage instead of local file storage. This provides better functionality for production environments.

## Features

### 1. Cloud Storage Analysis

- **Cloudinary Usage**: Displays storage usage, bandwidth usage, and plan information
- **Resource Analysis**: Shows total resources organized by folder type
- **Orphaned Detection**: Identifies resources that are no longer referenced in the database

### 2. Folder Organization

Resources are organized in the following folder structure:

```
{site-name-slug}/
├── logo/          # Site logo files
├── favicon/       # Site favicon files
├── hero/          # Hero section background images
├── gallery/       # Gallery images
├── room-types/    # Room type images
└── event-venues/  # Event venue images
```

### 3. Orphaned Resource Detection

The system checks the following database collections to identify orphaned resources:

- **Logo/Favicon**: Checks AppSetting.branding fields
- **Hero Images**: Checks AppSetting.heroSettings.backgroundImages
- **Gallery**: Checks Gallery.imageUrl
- **Room Types**: Checks RoomType.images.url
- **Event Venues**: Checks EventType.images.url

### 4. Cleanup Operations

- **Individual Folder Cleanup**: Clean orphaned resources from a specific folder
- **Bulk Cleanup**: Clean all orphaned resources across all folders
- **Batch Processing**: Deletes resources in batches to respect Cloudinary API limits
- **Error Handling**: Provides detailed error reports for failed deletions

## How to Use

1. **Analyze Storage**: Click "Analyze Cloud Storage" to scan your Cloudinary resources
2. **Review Results**: Check the summary cards and folder analysis
3. **Clean Up**: Use the "Clean" buttons to remove orphaned resources
4. **Monitor Usage**: Keep track of your Cloudinary storage and bandwidth usage

## Benefits

- **Production Ready**: Works seamlessly in production environments
- **Scalable**: Handles large numbers of resources efficiently
- **Safe**: Only removes resources that are not referenced in the database
- **Informative**: Provides detailed usage statistics and resource information
- **User-Friendly**: Clean, modern interface matching the admin theme

## Technical Details

- Uses Cloudinary Admin API for resource management
- Implements proper error handling and logging
- Respects Cloudinary API rate limits
- Provides comprehensive resource metadata (size, format, dimensions, creation date)
- Maintains folder structure based on site name for organization
