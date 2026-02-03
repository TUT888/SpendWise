# Kubernetes

This is a **generic how-to documentation** for using Kubernetes with Docker Desktop.

# Prerequisite
- **Docker Desktop** must be installed: [Docker - Prerequisite](./DOCKER.md#prerequisite)
- **Kubernetes** must be enabled:
    1. Activate Hyper-V

        > **Control Panel > Turn Windows Features On or Off > Select Hyper-V**
    2. Install and enable Kubernetes from setting

        > **Start Docker Desktop > Setting > Kubernetes > Enable Kubernetes > Apply and Restart**

# Usage
## Setup
1. Activate Hyper-V:
    
    **Control Panel** > **Turn Windows Features On or Off** > **Select Hyper-V**

2. Install and enable Kubernetes:

    **Start Docker** > **Setting** > **Kubernetes** > **Enable Kubernetes** > **Apply and Restart**

## Kubernetes Context (Docker Desktop vs Cloud Provider)
While working with `kubectl` commands in our local machine and manual cloud deployment (e.g. **Google Cloud SDK**), it is essential to use the right context.
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

## Kubernetes Dashboard (Optional)
1. Deploy the Dashboard UI:
    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
    ```

2. Create admin user for dashboard:
    - Specify user information and assign role in `.yaml` file: [dashboard-admin.yaml](../k8s/dashboard/dashboard-admin.yaml)
    - Apply the configuration:
        ```bash
        kubectl apply -f dashboard-admin.yaml
        ```

3. Login to Dashboard
    - Create login token for created user
        ```bash
        kubectl -n kubernetes-dashboard create token admin-user
        ```
    - Launch the dashboard (serving on localhost:8001 by default)
        ```bash
        kubectl proxy
        ```
    - Use the generated token to login and access the dashboard using below URL:
        ```bash
        http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
        ```

## Kubernetes Namespace
1. To create namespace:
    ```bash
    # Ex: kubectl create namespace production
    kubectl create namespace <your-name-space>
    ```
2. Set namespace to current `kubectl` context, use `-n` or `--name-space`
    ```bash
    # Ex: kubectl config set-context --current --namespace=production
    kubectl config set-context --current --namespace=<your-name-space>
    ```

## Kubernetes deployment
### Deployment
1. Create `.yaml` configuration files, some common files are
    - Credential & Configuration: secrets, config maps, etc
    - Database: persistent volume claims, database image deployment, etc
    - Service: deployment with target image, service config, etc
2. Apply the files
    ```bash
    kubectl apply -f <filename>.yaml
    ```

### Direct changes 
#### Update and restart deployment
We can manually apply the changes to k8s using `set image` and `rollout restart` commands. Below code is example for account service deployment
```bash
# For first time using `newtag` tag -> we need to set new image tag for deployed image
kubectl set image deployment/accountsvc-deployment accountsvc-container=tut888/sit737-account-service:newtag

# For later updates -> we only need to restart the deployment to re-pull new image
kubectl rollout restart deployment/accountsvc-deployment
```

## Monitoring and interaction
### Port-forwarding
- To forward the traffic, creating a temporary tunnel from your laptop to the cluster:
    > The `<service-name>` and `<service-port>` must match with your service configuration
    ```bash
    kubectl port-forward service/<service-name> <host-port>:<service-port>
    ```
- Access the application:
    ```bash
    http://localhost:<host-port>
    ```

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

### Inspect pod
Describe a specific pod to review events and investigate issues such as image pulling errors, resource limits, or readiness probe failures
```bash
kubectl describe pod <pod-name>
```

View the logs of a specific pod to identify error messages or runtime issues:
```bash
kubectl logs <pod-name>
```

### Check inter-service communication
Execute a command inside a running pod (e.g., the frontend service) to test connectivity with another service (e.g., the account service)
```bash
# Replace <pod-name> with the actual pod name of the service you want to use for the test (e.g., a frontend pod)
kubectl exec -it <pod-name> -- curl http://accountsvc-service:3330/status
```

## Clean Up
```bash
kubectl delete <type> <name>

# Ex: kubectl delete deployment account-svc-deployment
```