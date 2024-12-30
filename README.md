# File Upload Microservice

A NestJS-based microservice that handles file uploads to Google Drive by processing URLs asynchronously. This service is designed to handle bulk uploads, process large files, and store them securely in Google Drive while maintaining detailed upload records.

## Features

- Asynchronous URL processing
- Bulk upload support
- Direct upload to Google Drive
- Files over 1000MB are processed in microservice
- Error handling and reporting
- Database persistence of upload history

## API Endpoints

### Get file data

```http
GET /upload/urls
Content-Type: application/json
```

#### Response Format

```json
[
 {
   "url": "https://example.com/large-file1.zip",
   "result": {
     "success": true,
     "fileId": "123456",
     "webViewLink": "https://view.example.com/123456",
     "webContentLink": "https://download.example.com/123456",
     "name": "large-file1.zip",
     "mimeType": "application/zip",
     "fileSize": 1040
   },
   {
   "url": "https://example.com/large-file1.zip",
   "result": {
     "success": true,
     "fileId": "123456",
     "webViewLink": "https://view.example.com/123456",
     "webContentLink": "https://download.example.com/123456",
     "name": "large-file1.zip",
     "mimeType": "application/zip",
     "fileSize": 0.1
   }
 }
]
```

### Upload Multiple Files from URLs

```http
POST /upload/urls
Content-Type: application/json

{
  "urls": [
    "https://example.com/large-file1.zip",
    "https://example.com/small-file2.pdf"
  ]
}
```

#### Response Format

```json
[
  {
    "url": "https://example.com/large-file1.zip",
    "result": {
      "success": true,
      "fileId": "123456",
      "webViewLink": "https://view.example.com/123456",
      "webContentLink": "https://download.example.com/123456",
      "name": "large-file1.zip",
      "mimeType": "application/zip",
      "fileSize": 1040
    },
    {
    "url": "https://example.com/large-file1.zip",
    "result": {
      "success": true,
      "fileId": "123456",
      "webViewLink": "https://view.example.com/123456",
      "webContentLink": "https://download.example.com/123456",
      "name": "large-file1.zip",
      "mimeType": "application/zip",
      "fileSize": 0.1
    }
  }
]
```

## Prerequisites

- Docker and Docker Compose installed
- Google Cloud Project with Drive API enabled

## Deployment

1. Clone the repository

```bash
git clone git@github.com:dazyhero/nebula.git
cd nebula
```

2. Start the service using Docker Compose

```bash
docker-compose up --build -d
```

3. Install dependencies

```bash
pnpm install
```

4. Migrate the database

```bash
pnpm db:push
```

5. To view logs:

```bash
docker-compose logs -f
```

To stop the service:

```bash
docker-compose down
```

## Error Handling

The service handles various error scenarios:

- Invalid URLs
- Network timeouts
- Storage failures

Each error returns appropriate HTTP status codes and detailed error messages.
