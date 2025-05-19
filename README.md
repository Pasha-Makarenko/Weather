# Weather Application 🌦️

A web application for tracking weather in selected cities with email subscription functionality.

## Features ✨

- Real-time weather tracking for any city
- Email subscription for daily weather reports
- User-friendly interface
- REST API documentation

## Prerequisites 🛠️

- Node.js (v14+)
- npm
- Docker (for containerized deployment)

## Installation & Setup ⚙️

### 1. Environment Configuration

```bash
cp .env.template .env
# Edit the .env file with your configuration
```

### 2. Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Running the Application �

### Development Mode

```bash
npm run start  # Starts both frontend and backend
```

### Stopping the Application

```bash
npm run stop
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