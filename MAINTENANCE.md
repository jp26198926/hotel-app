# System Maintenance

## Overview
The maintenance section provides tools to clean up orphaned files in the upload directories. These are files that exist in the file system but are no longer referenced in the database.

## Features

### 1. Upload Analysis
- Scans all upload directories (`favicon`, `logo`, `gallery`, `hero`, `room-types`, `event-venues`)
- Compares files against database records
- Identifies orphaned files that can be safely deleted

### 2. File Cleanup
- Selective cleanup by directory
- Bulk cleanup of all orphaned files
- Real-time progress and results reporting
- Safe deletion with confirmation dialogs

### 3. Database Cross-Reference
The system checks files against the following models:
- **Gallery files**: `Gallery` model `imageUrl` field
- **Logo/Favicon files**: `AppSetting` model `branding.logo` and `branding.favicon` fields
- **Hero images**: `AppSetting` model `heroSettings.backgroundImages` array
- **Room type images**: `RoomType` model `images.url` array
- **Event venue images**: `EventType` model `images.url` array

## API Endpoints

### GET `/api/admin/maintenance`
Analyzes upload directories and returns orphaned file information.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFiles": 45,
    "orphanedFiles": 8,
    "cleanupResults": [
      {
        "directory": "gallery",
        "totalFiles": 25,
        "orphanedFiles": 5,
        "files": [
          {
            "filename": "gallery-1234567890.jpg",
            "path": "/uploads/gallery/gallery-1234567890.jpg",
            "size": 245760
          }
        ]
      }
    ],
    "errors": []
  }
}
```

### POST `/api/admin/maintenance`
Performs cleanup of orphaned files.

**Request:**
```json
{
  "action": "cleanup",
  "directory": "gallery" // Optional: specific directory, omit for all
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedFiles": 5,
    "deletedSize": 1228800,
    "errors": []
  }
}
```

## Usage

1. Navigate to **Admin** → **Maintenance**
2. Click **"Analyze Uploads"** to scan for orphaned files
3. Review the results by directory
4. Use **"Clean"** buttons to remove orphaned files from specific directories
5. Use **"Clean All Orphaned Files"** to remove all orphaned files at once

## Safety Features

- **Confirmation dialogs** before deletion
- **Database verification** to prevent accidental deletion of referenced files
- **Error handling** with detailed error reporting
- **Regex matching** for flexible file path detection
- **Whitelist approach** - only deletes files confirmed to be orphaned

## File Matching Logic

The system uses multiple matching strategies:
1. Exact path match (`/uploads/gallery/image.jpg`)
2. Filename match (`image.jpg`)
3. Case-insensitive regex match for flexibility

This ensures files are not accidentally deleted if they're referenced in different formats in the database.
