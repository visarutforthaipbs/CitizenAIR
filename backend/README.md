# CitizenAIR Backend API

Backend API server for the CitizenAIR project, connecting to Notion database for citizen-contributed air quality solutions.

## Features

- 🔗 **Notion Integration**: Real-time connection to Notion database
- 🌐 **RESTful API**: Clean endpoints for frontend consumption
- 🛡️ **CORS Support**: Proper cross-origin resource sharing
- 📊 **Data Transformation**: Converts Notion data to frontend-friendly format
- 🔍 **Search & Filter**: Category-based solution filtering
- ⚡ **Express.js**: Fast and lightweight web framework

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Notion integration token
- Notion database ID

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Update `.env` file with your Notion credentials:
```
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
PORT=5000
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```http
GET /api/health
```

### Get All Solutions
```http
GET /api/solutions
```

### Get Solution by ID
```http
GET /api/solutions/:id
```

### Get Solutions by Category
```http
GET /api/solutions/category/:category
```

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## Notion Database Schema

The API expects the following Notion database properties:

- **Name** (Title): Solution name
- **Category** (Select): Solution category
- **Province** (Rich Text): Province location
- **District** (Rich Text): District location
- **Description** (Rich Text): Detailed description
- **Image** (Files): Solution image
- **Source URL** (URL): Reference link
- **Date** (Date): Implementation date
- **Organization / Author** (Rich Text): Creator information
- **Implementation Status** (Select): Current status

## Development

### Project Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

### Adding New Endpoints

1. Add route handler in `server.js`
2. Implement Notion API integration
3. Transform data for frontend consumption
4. Add error handling

### Error Handling

The API includes comprehensive error handling for:
- Missing environment variables
- Notion API errors
- Invalid requests
- Database connection issues

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment
2. Update `FRONTEND_URL` for CORS configuration
3. Use process manager like PM2
4. Set up reverse proxy (nginx)
5. Enable HTTPS

## Contributing

1. Follow the existing code style
2. Add error handling for new features
3. Update API documentation
4. Test all endpoints before committing

## License

This project is part of the CitizenAIR application for air quality monitoring in Thailand.
