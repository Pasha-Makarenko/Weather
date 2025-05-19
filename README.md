# Weather Application 🌦️

A web application for tracking weather in selected cities with email subscription functionality.

## Features ✨

- Real-time weather tracking for any city
- Email subscription for daily weather reports
- User-friendly interface
- REST API documentation

Here's the additional "Tech Stack" section to add to your README, maintaining the same style:

## Tech Stack 💻

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Sequelize ORM
- **Caching**: Redis for data caching
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest (unit tests)

### Frontend
- **Framework**: Angular
- **State Management**: NgRx
- **Confirmation**: Via email
- **Testing**: Jest (unit tests)

### Infrastructure
- **Containerization**: Docker
- **Email Service**: Nodemailer 

Key Features Implementation:
- Weather data caching with Redis TTL
- Persistent user preferences via cookies

## Prerequisites 🛠️

- Node.js (v22)
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
