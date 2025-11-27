# JetStay

A full-stack travel booking application with separate frontend and backend services.

## Architecture

- **Frontend**: React application served by Nginx
- **Backend**: Spring Boot REST API
- **Database**: MySQL

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

### Manual Docker Commands

1. **Build and run backend**:

   ```bash
   docker build -t jetstay-backend .
   docker run -p 8080:8080 jetstay-backend
   ```

2. **Build and run frontend**:
   ```bash
   cd frontend
   docker build -t jetstay-frontend .
   docker run -p 3000:80 jetstay-frontend
   ```

## Services

### Backend (Port 8080)

- REST API built with Spring Boot
- MySQL database integration
- JWT authentication
- File upload handling

### Frontend (Port 80/3000)

- React application with routing
- Tailwind CSS styling
- Axios for API communication
- Responsive design

### Database (Port 3306)

- MySQL 8.0
- Persistent data storage
- Automatic schema creation

## Development

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- Java 21+ (for local backend development)

### Local Development Setup

1. **Start only the database**:

   ```bash
   docker-compose up db
   ```

2. **Run backend locally**:

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Run frontend locally**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Environment Variables

### Backend

- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_PROFILES_ACTIVE`: Spring profile (docker/prod)

### Database

- `MYSQL_ROOT_PASSWORD`: Root password
- `MYSQL_DATABASE`: Database name
- `MYSQL_USER`: Application user
- `MYSQL_PASSWORD`: Application user password

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Backend**: Maven build, unit tests, coverage reporting
- **Frontend**: NPM build and linting

## API Documentation

Once the backend is running, API documentation is available at:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## Health Checks

Both services include health check endpoints:

- Backend: `http://localhost:8080/` (simple check)
- Frontend: `http://localhost/` (nginx serving check)

## Project Structure

```
jetstay/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml       # Development setup
├── Dockerfile              # Backend Dockerfile
└── .github/workflows/      # CI/CD pipelines
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `mvn test` (backend) and `npm test` (frontend)
5. Submit a pull request

## License

This project is licensed under the MIT License.
