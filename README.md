
# SIT737 - 2025 - Task 10.2HD

SpendWise is a cloud-native application project that enables users to manage and monitor personal expenses.
It provides tools for tracking spending over time.

The system is built with a MongoDB database, modular microservices containerized via Docker, and deployed on Google Cloud using CI/CD pipelines.

# Table of Contents
- [About the project](#about-the-project)
- [Containerization](#containerization)
- [Google Cloud Platform Deployment](#google-cloud-platform-deployment)
    - [GCP Kubernetes Cluster setup](#gcp-kubernetes-cluster-setup)
    - [Apply Deployment and Service](#apply-deployment-and-service)
    - [Check the running pods and services](#check-the-running-pods-and-services)
- [Monitoring the application](#monitoring-the-application)
    - [Monitoring in the Cloud Console Web UI (requires permission)](#monitoring-in-the-cloud-console-web-ui)
    - [Monitoring with commands](#monitoring-with-commands)
- [Project clean up](#project-clean-up-optional)
- [Troubleshooting](#troubleshooting)
    - [Useful commands](#useful-commands)
    - [Some encountered issues](#useful-commands)

Detailed step-by-step instructions provided below.

# About the project
The cloud-native application consists of three services: frontend, account, and expense.
The frontend service acts as the main entry point, exposed via an external IP address and accessed by users.
It communicates with the account and expense services to process user requests.


# Containerization
Each service is developed separately in its own directory, with a corresponding Dockerfile.

Run the following commands to containerize the application into Docker images
```bash
docker build -t sit737-account-service ./account_service
docker build -t sit737-expense-service ./expense_service
docker build -t sit737-frontend-service ./frontend
```

Tag the images and push them to Docker Hub:
```bash
docker tag sit737-account-service tut888/sit737-account-service
docker push tut888/sit737-account-service

docker tag sit737-frontend-service tut888/sit737-frontend-service
docker push tut888/sit737-frontend-service

docker tag sit737-expense-service tut888/sit737-expense-service
docker push tut888/sit737-expense-service
```

# Google Cloud Platform Deployment
## GCP Kubernetes Cluster setup
> Prerequisite:
> - A Google Cloud Console account & project
> - Google Cloud SDK Shell installed and configured on your computer
> 
> These steps have already been completed in **Task 5.2D** at [TUT888/sit737-2025/tree/prac5d](https://github.com/TUT888/sit737-2025/tree/prac5d)

Use the Google Cloud SDK Shell to remotely connect to the GCP platform and apply configuration files stored locally.

### Login
- Open the Google Cloud SDK Shell.
- Log in and configure the project:
    ```bash
    gcloud auth login
    gcloud config set project <YOUR-PROJECT-ID> # Ex: sit737-25t1-fname-lname-xxxxxx
    gcloud config set compute/zone <YOUR-COMPUTE-ZONE> # Ex: australia-southeast1-b
    ```

### Create Kubernetes Cluster

We can create a Kubernetes Cluster by providing its name, number of nodes and the compute zone. In this case, our cluster has:
- Name: `simple-k8s-cluster`
- Number of nodes: 1 node (one virtual machine/instance) per zone. If we set `--num-nodes=3`, GCP would spin up 3 virtual machines (nodes), allowing your workloads to be distributed across them for high availability, scalability, and resilience.

The command
```bash
gcloud container clusters create simple-k8s-cluster --num-nodes=1 --zone=australia-southeast1-b
```

After successfully created a cluster, we confirm it by listing all cluster with:
```bash
gcloud container clusters list
```

### Authenicate the cluster

Before using, we must authenticate `kubectl` with the newly created cluster by getting credential with following command:
```bash
gcloud container clusters get-credentials simple-k8s-cluster --location=australia-southeast1-b
```

## Apply Deployment and Service
Navigate to your project directory where the deployment `.yaml` files are stored
```bash
cd <YOUR-PROJECT-LOCATION>
```

Apply the MongoDB deployment:
```bash
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-deployment.yaml
```

Apply the service deployments
```bash
kubectl apply -f frontendsvc-deployment.yaml
kubectl apply -f accountsvc-deployment.yaml
kubectl apply -f expensesvc-deployment.yaml
```

## Check the running pods and services
### Check the running pods

If 3 replicas are specified in the deployment YAML, you should see 3 pods running. In this case, only 1 replica is used
```bash
kubectl get pods
```

### Check the running services
```bash
kubectl get services
```
The Cloud Shell should return a table like:
| NAME | TYPE | CLUSTER-IP | EXTERNAL-IP | PORT(S) | AGE |
| --- |  --- |  --- |  --- |  --- |  --- | 
| kubernetes | ClusterIP | 11.222.224.1 | none | 443/TCP | 15m |
| frontendsvc-service | LoadBalancer | 11.222.224.210 | **pending** | 3080:30142/TCP | 12s |
| accountsvc-service | ClusterIP | 11.222.231.12 | none | 3330/TCP | 10s |
| expensesvc-service | ClusterIP | 11.222.236.138 | none | 3332/TCP | 9s |
| my-mongo-svc | ClusterIP | 11.222.236.138 | none | 27017/TCP | 20s |

Once the `EXTERNAL-IP` is ready, it will appear. Access the application using
```
http://<EXTERNAL-IP>:3080/
```

For example, if the `EXTERNAL-IP` shows 11.222.3.101, we  can access our application with:
```
http://11.222.3.101:3080/
```

**Then the deployment is completed!**

# Monitoring the application
## Monitoring in the Cloud Console Web UI
Google Cloud Platform provides a web-based UI for application monitoring.
Steps:

1. Open Google Cloud Console.
2. Navigate to the **Monitoring** tab in the side menu.
3. Select **Metrics Explorer**.
4. Set the resource type to Kubernetes Container.
5. Choose metrics to view, such as:
    - `kubernetes.io/container/cpu/request_utilization`
    - `kubernetes.io/container/memory/request_utilization`

> **Note:** If you do not have permission to set the resource type to Kubernetes Container, use the CLI commands in the next section

**In this task, since I don't have the permission to set the *Resource Type* to *Kubernetes Container*, the monitoring will be done using the commands in next section**

## Monitoring with commands
### View resource usage
Get pod-level CPU and memory usage:
```bash
kubectl top pod
```

Get pod network details for a specific pod:
```bash
kubectl describe pod <POD-NAME>
```

Get node-level (cluster) resource usage:
```bash
kubectl top nodes
```

### View the logs
```bash
kubectl logs <POD-NAME>
```

Example output from the account service:
> Server started: http://localhost:3030
> Connected to MongoDB
> info: [ACCOUNT] GET at /status: request received, session unavailable {"service":"account"}
> info: [ACCOUNT] GET at /status: request received, session unavailable {"service":"account"}
> error: [ACCOUNT] POST at /login: login failed, user email is invalid {"service":"account"}
> info: [ACCOUNT] GET at /status: request received, session unavailable {"service":"account"}

# Project clean up (Optional)
If the app is no longer needed, delete the deployment to avoid unnecessary costs:
- GCP charges for each external IP tied to a LoadBalancer (even if idle).
- Charges stop only after the LoadBalancer service is deleted..

To stop the service:
- Identify the service with 
    ```bash
    kubectl get service
    ```
- Get ther service name and delete it with 
    ```bash
    kubectl delete service <YOUR-SERVICE-NAME>
    ```

To free all other resources:
```bash
# Delete the deployment
kubectl delete deployment <YOUR-DEPLOYMENT-NAME>

# Delete entire cluster (will remove all workloads and charges)
gcloud container clusters delete <YOUR-CLUSTER-NAME> --zone <YOUR-ZONE>
```

# Troubleshooting
## Useful commands
During the deployment process, you may encounter various issues. Below are useful commands commonly used to troubleshoot and identify the root causes:

### Monitor component status
Check the status of deployed components (e.g., Running, Pending, ImagePullBackOff, etc.)
```bash
# Get the running pods
kubectl get pods

# Get the running service
kubectl get service

# Get the storage class
kubectl get storageclass

# Get the persistent volume claim
kubectl get pvc
```

### Inspect pod events
Describe a specific pod to review events and investigate issues such as image pulling errors, resource limits, or readiness probe failures
```bash
kubectl describe pod <POD-NAME>
```

### View pod logs
View the logs of a specific pod to identify error messages or runtime issues:
```bash
kubectl logs <POD-NAME>
```

### Test inter-service communication
Execute a command inside a running pod (e.g., the frontend service) to test connectivity with another service (e.g., the account service)
```bash
# Replace <POD-NAME> with the actual pod name of the service you want to use for the test (e.g., a frontend pod)
kubectl exec -it <POD-NAME> -- curl http://accountsvc-service:3330/status
```

## Some encountered issues
### Docker Hub authentication

If your deployment use images from your Docker Hub, you mush login to docker to have image pulling permission:
```bash
docker login
```

Then you can revoke the login session with:
```bash
docker logout
```

### Kubernetes Cluster Creation
**VPC Network**

If you encountered errors related to networks (has no network named "default"), we need to create the default Virtual Private Cloud (VPC) network and its subnets
- Create network:
    ```bash
    gcloud compute networks create default --subnet-mode=auto
    ```
- View the network list:
    ```bash
    gcloud compute networks list
    ```
Then try to run the cluster creation command again 

**Google CLoud SDK Shell plugin**

If you encountered errors related to plugins (`gke-gcloud-auth-plugin` is needed for continued use of `kubectl`), you may need to install the plugin in your Google Cloud SDK Shell with following command:
```bash
gcloud components install gke-gcloud-auth-plugin
```

Confirm the installed plugin version:
```bash
gke-gcloud-auth-plugin --version
```

### Kubectl Context problem (Docker Desktop vs Google Cloud SDK)
While working with `kubectl` commands in our local machine, we need to check which context is we currently working on.
- To get all context, run:
    ```bash
    kubectl config get-contexts
    ```
- To check current working context, run:
    ```bash
    kubectl config current-context
    ```
- To use context, run:
    ```bash
    # Use docker desktop
    kubectl config use-context docker-desktop

    # Use google cloud
    kubectl config use-context gke_project-id_cluster-name_region 
    ```