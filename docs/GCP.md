# Google Cloud Platform

This is a **generic how-to documentation** for using Google Cloud Platform (GCP):
- [Google Cloud CLI](#google-cloud-cli)
- GCP Services
    - [Artifact Registry](#artifact-registry)
    - [Google Kubernetes Engine (GKE)](#google-kubernetes-engine-gke)

# Google Cloud Console
1. Set up your account
    - Use your browser to sign in to your Google Account, or create a new one if needed.
    - Go to Google Cloud Console > Billing > Enable Billing Account and link it with your payment method.
2. Create new project
    - Go to <https://console.cloud.google.com/> and create new project.
    - Save your project ID, as it will be required later during deployment.

# Google Cloud CLI
> The Google Cloud CLI (gcloud CLI) is the primary set of command-line tools for Google Cloud.
> - It must be installed in your computer to run.
> - Alternatively, you can use the Google Cloud SDK Shell (Cloud Shell) to run the commands in the cloud. It’s accessible in your browser through the Google Cloud Console when you’re logged in with your Google account.

Step by step instruction for setting up Google Cloud CLI in your computer
1. Download and install the Google Cloud CLI
2. Configure the CLI using one of following option:
    - Run following command to config all at once
        ```bash
        # Below command includes
        # - Login to your google account by following the instruction
        # - Choose the target project you working with
        # - Configure the default region (optional)
        gcloud init
        ```
    - Run following commands to config one by one
        - To login
            ```bash
            gcloud auth login
            ```
        - To set working project:
            ```bash
            gcloud config set project <your-project-id>
            ```
        - To set compute zone
            ```bash
            gcloud config set compute/zone <your-compute-zone>
            ```

# Artifact Registry
> Prerequisite:
> - A Google Cloud Console account & project [#Google Cloud Console](#google-cloud-console)
> - Google Cloud CLI installed and configured on your computer: [#Google Cloud CLI](#google-cloud-cli)

Use the Google Cloud SDK Shell to remotely connect to the GCP platform and apply configuration files stored locally.

Before proceeding with the instructions below, ensure that you:
- Are logged into the correct account. If not, run `gcloud auth login`.
- Have the correct project set. If not, run `gcloud config set project <your-project>`.

## Setup Google Cloud registry/repository
1. Access the Google Cloud Platform and choose your project. If not yet created, follows [#Google Cloud Console](#google-cloud-console)
2. Search and go to **Artifact Registry** and enable the API service. Alternatively, run below command in your console
    ```bash
    gcloud services enable artifactregistry.googleapis.com
    ```
3. Create a new repository in **Artifact Registry**, choosing Docker format with Standard mode

## Authenticate to a repository
1. List all hostnames in the helper
    ```bash
    gcloud auth configure-docker
    ```
2. Add target hostname (current region) to the Docker configuration file
    ```bash
    gcloud auth configure-docker <the-repo-region>-docker.pkg.dev
    ```
    
## Publish the image to the registry
After creating the Google Cloud repository, we should be provided the path to the repo with this format: `LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY`. We will use this format to tag and push the image to the cloud.
1. Tag the image with the repo name
    ```bash
    docker tag <local-image-name> <the-path-to-your-repository>/<image-name>
    ```
2. Push the image to the cloud
    ```bash
    docker push <the-path-to-your-repository>/<image-name>
    ```

# Google Kubernetes Engine (GKE)
## Kubernetes Cluster setup
> Prerequisite:
> - A Google Cloud Console account & project [#Google Cloud Console](#google-cloud-console)
> - Google Cloud CLI installed and configured on your computer: [#Google Cloud CLI](#google-cloud-cli)

Use the Google Cloud SDK Shell to remotely connect to the GCP platform and apply configuration files stored locally.

Before proceeding with the instructions below, ensure that you:
- Are logged into the correct account. If not, run `gcloud auth login`.
- Have the correct project set. If not, run `gcloud config set project <your-project>`.

### Setup Google Kubernetes Engine
1. Access the Google Cloud Platform and choose your project. If not yet created, follows [#Google Cloud Console](#google-cloud-console)
2. Search and go to **Kubernetes Engine** and enable the API service. Alternatively, run below command in your console

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
cd <your-project-location>
```

Apply the all configuration and deployments, normally the order should be:
1. Configuration, secrets, other dependencies, etc.
2. Database and storage, etc.
3. Service deployment

```bash
kubectl apply -f <filename>.yaml
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

## Monitoring the application
### Monitoring in the Cloud Console Web UI
Google Cloud Platform provides a web-based UI for application monitoring.
Steps:

1. Open Google Cloud Console.
2. Navigate to the **Monitoring** tab in the side menu.
3. Select **Metrics Explorer**.
4. Set the resource type to Kubernetes Container.
5. Choose metrics to view, such as:
    - `kubernetes.io/container/cpu/request_utilization`
    - `kubernetes.io/container/memory/request_utilization`

### Monitoring with commands
#### View resource usage
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

#### View the logs
```bash
kubectl logs <POD-NAME>
```

Example output from the account service:
> Server started: http://localhost:3030 <br>
> Connected to MongoDB <br>
> info: [ACCOUNT] GET at /status: request received, session unavailable {"service":"account"} <br>
> info: [ACCOUNT] GET at /status: request received, session unavailable {"service":"account"} <br>
> error: [ACCOUNT] POST at /login: login failed, user email is invalid {"service":"account"} <br>
> info: [ACCOUNT] GET at /status: request received, session unavailable {"service":"account"}

## Project clean up (Optional)
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
kubectl delete deployment <your-deployment-name>

# Delete entire cluster (will remove all workloads and charges)
gcloud container clusters delete <your-cluster-name> --zone <your-zone>
```

# Troubleshooting
## Kubernetes Cluster Creation
**VPC Network**

If you encountered errors related to networks **(has no network named "default")**, we need to create the default Virtual Private Cloud (VPC) network and its subnets
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

If you encountered errors related to plugins **(`gke-gcloud-auth-plugin` is needed for continued use of `kubectl`)**, you may need to install the plugin in your Google Cloud SDK Shell with following command:
```bash
gcloud components install gke-gcloud-auth-plugin
```

Confirm the installed plugin version:
```bash
gke-gcloud-auth-plugin --version
```