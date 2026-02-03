# SpendWise - Microservice with CI/CD on GCP

SpendWise is a cloud-native application project that enables users to manage and monitor personal expenses.
It provides tools for tracking spending over time.

The system is built with a MongoDB database, modular microservices containerized via Docker, and deployed to Google Cloud.

The project is configured CI/CD workflow
- **CI with GitHub Actions**, any update on `main` branch will automatically trigger the test.
- **CD with Google Cloud Build**, merging changes into `main` automatically triggers a workflow that builds the application (Cloud Build), stores the images (Artifact Registry), and deploys them to production on Google Kubernetes Engine (GKE).

![Account](images/account.png)
![Expense](images/expense.png)

# About the project
The cloud‑native application consists of three services: frontend, account, and expense.
- The **frontend** acts as the **main entry point**, exposed via an **external IP address** and accessed by users. It communicates with the account and expense services to process user requests.
- The **account and expense services** communicate with the frontend and with each other through **cluster IPs**, restricting external access.
- The application uses a **centralized authentication system with JWT**, requiring all protected resources to verify user credentials through the dedicated account service before granting access. This ensures secure and **consistent authorization across all microservices**.


# CI/CD Instruction
## Workflow Setup
The SpendWise project is designed with a fully automated CI/CD pipeline that ensures every code change is tested, validated, built, and deployed in a consistent and reproducible way. The automation is powered by **GitHub Actions** and **Google Cloud Build**, forming a seamless workflow from commit to production.

### 1. GitHub Actions — Continuous Integration (CI)
Every push or pull request to the `main` branch triggers the CI workflow. This stage focuses on code quality and reliability:
- Install dependencies for each microservice
- Run automated tests
- Perform linting and static analysis
- Validate that each service builds successfully
Only when all checks pass does the pipeline allow the change to progress toward deployment. This ensures that broken code never reaches production.

### 2. Cloud Build Trigger — Continuous Delivery (CD)
When changes are merged into `main`, GitHub automatically notifies **Google Cloud Build** through a build trigger configured in GCP.

Cloud Build then executes a multi‑step pipeline:
- Build Docker images for the frontend, account, and expense services
- Tag each image using the commit SHA for traceability
- Push the images to **Artifact Registry**
- Apply updated Kubernetes manifests to the GKE cluster

This creates a fully automated delivery pipeline where every deployment is versioned, reproducible, and auditable.

### 3. Deployment to GKE — Automated Rollout
Once Cloud Build pushes the new images, it updates the running workloads in GKE:
- GKE performs a **rolling update**, replacing old pods with new ones
- Traffic is shifted gradually to avoid downtime
- If a deployment fails, GKE automatically rolls back to the previous stable version
This ensures that production deployments are safe, controlled, and fully automated.


## Manual Deployment (Workaround)
### Purpose
In cases where your Google Cloud account does not have sufficient permissions to allow fully automated deployment (for example, restricted IAM roles or disabled Cloud Build triggers), SpendWise can still be deployed manually. This fallback workflow ensures that updates can be delivered reliably even without full CI/CD privileges.

The manual deployment process still uses **GitHub Actions for CI**, but replaces the automated CD stage with a manual deployment to GKE.

### How It Works
Generally, the workflow is: commit & push → automated testing → automatic image build → automatic publish to Docker Hub → manually apply the new image in GKE.

- In the GitHub Actions workflow, Docker images are built and pushed to Docker Hub after all tests pass. Each image is tagged with the `GITHUB_SHA` for uniqueness and easier maintenance.
- After the image is published, update the running service in GKE using `kubectl set image` and then trigger a rollout restart. Example for the account service:
    ```bash
    # For first time using `<SHORT_GIT_SHA>` tag -> we need to set new image tag for deployed image
    # Ex: kubectl set image deployment/accountsvc-deployment accountsvc-container=dockeruser/sit737-account-service:1t11tt1

    kubectl set image deployment/<deployment-name> <container-name>=<docker-username>/<image-name>:<SHORT_GIT_SHA>
    
    # For later updates -> we only need to restart the deployment to re-pull new image
    # Ex: kubectl rollout restart deployment accountsvc-deployment -n production
    kubectl rollout restart deployment <your-deployment-name> -n <namespace>
    ```

# Application Instruction
## Start the application
### Run all with docker compose
- Start all services:
    ```bash
    docker compose up
    ``` 
- Access the application (frontend): `http://localhost:3380`

### Run individually
- Start service one by one (Account, Expense and Frontend):
    ```bash
    cd <service_directory>
    npm install
    npm start
    ```
- Access the application (frontend): `http://localhost:3081`

## Run the test
> **The project configured CI/CD with GitHub Actions, any update on main branch will automatically trigger the test and build new images.**
> - Account service & expense service: unit testing with Mocha/Chai
> - Frontend service: end to end testing with Cypress

For manually run the test, type below commmands
- Test backend services:
    ```
    cd <service_directory>
    npm test
    ```
- Test frontend:
    ```
    cd frontend
    npm run test:e2e
    ```

## Containerize with Docker
> Prerequisite: 
> - Docker Desktop must be installed
> - Detail instruction please refer to my documentation at [Docker Documentation](./docs/DOCKER.md)

Each service is developed separately in its own directory, with a corresponding Dockerfile.

Run the following commands to containerize all images at once
```bash
docker compose build
```

Tag the images and push them to Docker Hub:
```bash
docker tag spendwise-account-service <docker-username>/spendwise-account-service
docker push <docker-username>/spendwise-account-service

docker tag spendwise-expense-service <docker-username>/spendwise-expense-service
docker push <docker-username>/spendwise-expense-service

docker tag spendwise-frontend <docker-username>/spendwise-frontend
docker push <docker-username>/spendwise-frontend
```

## Deploy with Kubernetes
> Prerequisite: 
> - Docker Desktop must be installed, Kubernetes must be enabled. Alternatively, any other k8s engine such as Minikube can also be used for your preference.
> - Detail instruction please refer to my documentation at [Kubernetes Documentation](./docs/KUBERNETES.md)

### Deployment
> Detail instruction for **GCP deployment** please refer to my documentation at [GCP Documentation](./docs/GCP.md)

- Check and swith to your target **kubectl context**
    - Check context
        ```bash
        # Get all contexts
        kubectl config get-contexts

        # Check current context
        kubectl config current-context
        ```
    - Switch context
        ```bash
        # Option 1: Use docker desktop (local deployment)
        kubectl config use-context docker-desktop

        # Option 2: Use Google Cloud Platform (cloud deployment)
        # YOU SHOULD HAVE SUCCESSFULLY LOGGED IN AND COMPLETED GOOGLE CLOUD SETUP 
        kubectl config use-context gke_project-id_cluster-name_region 
        ```
- Navigate to your project directory where the deployment `.yaml` files are stored
    ```bash
    cd k8s/local
    ```
- Apply the MongoDB deployment:
    ```bash
    kubectl apply -f mongodb-pvc.yaml
    kubectl apply -f mongodb-secret.yaml
    kubectl apply -f mongodb-deployment.yaml
    ```
- Apply the service deployments
    ```bash
    kubectl apply -f frontendsvc-deployment.yaml
    kubectl apply -f accountsvc-deployment.yaml
    kubectl apply -f expensesvc-deployment.yaml
    ```

### Troubleshooting
During the deployment process, you may encounter various issues. Variety of commands can be used to troubleshoot and identify the root causes, some of them are
```bash
kubectl get <type>
kubectl describe <type> <target-name>
kubectl logs <pod-name>
```


