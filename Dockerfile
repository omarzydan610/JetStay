# Backend Dockerfile
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first for better caching
COPY backend/pom.xml ./
COPY backend/.mvn/ .mvn/
COPY backend/mvnw ./

# Download dependencies and compile (with retry logic)
RUN ./mvnw clean compile -B --batch-mode --errors

# Copy source code
COPY backend/src ./src/

# Build the application
RUN ./mvnw clean package -DskipTests --batch-mode --errors

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start the application
CMD ["java", "-jar", "app.jar"]