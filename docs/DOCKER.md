# Docker - Docker Desktop & Docker Hub

This is a **generic how-to documentation** for using Docker Dekstop and Docker Hub.

# Prerequisite
**Docker Desktop** must be installed. Please find [official documentation](https://docs.docker.com/desktop/setup/install/windows-install/) for detail installation instruction.

# Usage
## Dockerfile & Docker Image (Containerization)
1. Create a `Dockerfile` in the project folder (root)
    ```bash
    # Specify the base image with specific version (e.g. node version)
    FROM <BASE_IMAGE> 

    # Define the path to the application
    WORKDIR /code

    # Copy and install dependencies
    COPY <SOURCE_PATH> <DEST_PATH>

    RUN <FIRST_COMMAND>!> \
        <SECOND_COMMAND_OPTIONAL>

    # Copy application code from the directory in your computer to the image
    COPY <SOURCE> <DESTINATION>

    # Expose the app to specified port
    EXPOSE <PORT>

    # Specify the commands in list, ex: ["node", "server.js"]
    CMD <COMMANDS>
    ```
2. Build the Docker image, tagging is optional but highly recommended, specify the project folder, which should also include `Dockerfile` in there
    ```bash
    docker build -t <image-name>:<tag> <path-to-project>

    # Ex: docker build -t frontend-image:demo ./frontend
    ```
3. Use the Docker Image to start a container, mapping the host machine port (where we access the application from our computer) to container's internal port
    ```bash
    docker run -p <host-port>:<container-port> <image-name>:<tag>
    
    # Ex: docker run -p 8080:3000 frontend-image:demo
    ```
4. Access the application using `host-port`
    ```bash
    http://localhost:<host-port>

    # Ex: http://localhost:8080
    ```

## Docker Compose
1. Define a [`docker-compose.yaml`](../docker-compose.yaml) file, defining and configuring all services in a single file
    - Specify the version
    - Define the services, each needs to include
        - The directory to build the application (must include `Dockerfile`)
        - Container name for the service
        - Mapping the ports (`host-machine-port`:`container-port`)
        - Container health check setting
        - Container restart condition
2. Build all images (optional)
    ```bash
    docker compose build
    ```
3. Start all services with below commands, if the images haven't been built yet, it will automatically build and run afterwards.
    ```bash
    docker compose up
    ```

## Docker Hub
1. Login to Docker
    - Go to DockerHub and generate personal access token
    - Login with below command and your credentials
        ```bash
        docker login
        ```
2. Tag and push the image to DockerHub
    ```bash
    docker tag <image-name> <docker-username>/<image-name>
    docker push <docker-username>/<image-name>
    ```

## Monitoring
Check the container's status
```bash
docker ps
```

## Troubleshooting

If you have problem with **push** or **pull** images, ensure you already logged in and have image pulling permission:
```bash
docker login
```

Then you can revoke the login session with:
```bash
docker logout
```