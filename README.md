# Weather Application 🌦️

A web application for tracking weather in selected cities with email subscription functionality.

## Features ✨

- Real-time weather tracking for any city
- Email subscription for daily weather reports
- User-friendly interface
- REST API documentation

## Prerequisites 🛠️

- Node.js (v22+)
- npm
- Docker (for containerized deployment)

## Installation & Setup ⚙️

For development

### 1. Environment Configuration

Edit the `.env.dev` file with your configuration and edit `frontend/src/environments/environment.ts` (only for development)

### 2. Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Running

```bash
npm run dev:start  # Starts both frontend and backend
```

### Stopping

```bash
npm run dev:stop
```

For production

Edit the `.env` file with your configuration

### Building

```bash
npm run install:all && npm run build:all
```

### Running

```bash
npm run start:backend
```

## Testing �

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Documentation 📚

After starting the application, access the API documentation at:

```
/api/docs
```

## Support 🆘

For issues or questions, please open an issue in the GitHub repository.

## License 📄

This project is licensed under the MIT License.