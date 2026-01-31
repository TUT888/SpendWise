# Kubernetes

This is a **generic how-to documentation** for using Kubernetes with Docker Desktop.

## Prerequisite
- **Docker Desktop** must be installed: [Docker - Prerequisite](./DOCKER.md#prerequisite)
- **Kubernetes** must be enabled:
    1. Activate Hyper-V

        > **Control Panel > Turn Windows Features On or Off > Select Hyper-V**
    2. Install and enable Kubernetes from setting

        > **Start Docker Desktop > Setting > Kubernetes > Enable Kubernetes > Apply and Restart**

## Kubernetes Cluster setup
1. Activate Hyper-V:
    
    **Control Panel** > **Turn Windows Features On or Off** > **Select Hyper-V**

2. Install and enable Kubernetes:

    **Start Docker** > **Setting** > **Kubernetes** > **Enable Kubernetes** > **Apply and Restart**

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
    - Launch the dashboard (serving on localhost:8001 by default)
        ```bash
        kubectl proxy
        ```
    - Create login token for created user
        ```bash
        kubectl -n kubernetes-dashboard create token admin-user
        ```
    - Use the generated token to login and access the dashboard using below URL:
        ```bash
        http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
        ```

## Kubernetes Deployment
1. Create `.yaml` configuration files, some common files are
    - Credential & Configuration: secrets, config maps, etc
    - Database: persistent volume claims, database image deployment, etc
    - Service: deployment with target image, service config, etc
2. Apply the files
    ```bash
    kubectl apply -f <filename>.yaml
    ```

## Monitoring and Interaction
### Pod and service checking
To verify the running pods and services:
```bash
kubectl get pods
kubectl get services
```

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
