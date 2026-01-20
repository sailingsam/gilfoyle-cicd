```
Made with ❤️ by Saksham Jain
```
# House Arena

Hi! I am [Saksham Jain](https://sailingsam.vercel.app), I made this project as part of my buildspace N&Ws5 program.

House Arena is your one-stop platform for tracking house points, viewing past events, and fostering a vibrant spirit of competition and camaraderie among your individual houses. Each house in the student community can view their progress, participate in events, and aim for the top of the leaderboard.

## Features

- Track the current leaderboard of house points
- View detailed scores of past events
- User authentication with login and registration pages
- Admin dashboard for managing events (add/update/delete)

## Project Structure

The project is organized into two main directories:

- `/frontend` - React-based frontend built with Vite
- `/backend` - Express and Node.js backend with MongoDB

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/sailingsam/house-arena.git
   cd house-arena
   ```

2. Install Frontend Dependencies:

   ```sh
   cd frontend
   npm install
   ```

3. Install Backend Dependencies:

   ```sh
   cd ../backend
   npm install
   ```

4. Setup MongoDB Database:
   - Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new project and cluster
   - Create `.env` file in the backend folder, copy the keys from `..env` file.
   - Add MONGO_URI with your connection string (replace `<db_password>` with your password)

### Setting Up Admin Access & Sample Data

Before running the application, you'll need to set up admin access and seed the database:

1. Open `backend/seeders/seeder.js` and add your email to the adminEmails array:

   ```javascript
   const adminEmails = [
     {
       email: "your.email@example.com", // Add your email here
     },
   ];
   ```

2. **Run the seeder script**: In terminal, move to the backend directory `/house-arena/backend` and run the seeder script:

   ```sh
   npm run seed
   ```

3. **Important Security Step**: After registering, remove your email from `seeder.js`:
   ```javascript
   const adminEmails = [
     {
       email: "", // Remove your email before committing
     },
   ];
   ```

**Note**: Only emails listed in the admin emails collection can register accounts.

#### Setting up ENV variables
Create a `.env` file in the frontend folder, copy the keys from `..env` file.

### Running the Application

1. Start the Backend:

   ```sh
   cd backend
   npm run dev
   ```

   The server will run on http://localhost:4000

2. Start the Frontend:
   ```sh
   cd frontend
   npm run dev
   ```
   Access the application at http://localhost:5173

## DevOps CI/CD Pipeline

This project implements a production-grade CI/CD pipeline using GitHub Actions, Docker, and Kubernetes.

### CI/CD Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CI PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐   ┌─────────┐   ┌────────┐   ┌───────┐   ┌──────────────────┐ │
│  │ Checkout │ → │ Setup   │ → │ Lint   │ → │ Test  │ → │ Build            │ │
│  │          │   │ Node.js │   │        │   │       │   │                  │ │
│  └──────────┘   └─────────┘   └────────┘   └───────┘   └──────────────────┘ │
│                                                               ↓              │
│  ┌──────────────────┐   ┌─────────────────┐   ┌────────────────────────────┐│
│  │ Registry Push    │ ← │ Container Test  │ ← │ Docker Build               ││
│  │ (DockerHub)      │   │                 │   │                            ││
│  └──────────────────┘   └─────────────────┘   └────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CD PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │ Configure    │ → │ Deploy to    │ → │ Health       │ → │ Rollback     │  │
│  │ Kubernetes   │   │ K8s Cluster  │   │ Verification │   │ (on failure) │  │
│  └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Stages Explained

| Stage | Purpose | Why It Matters |
|-------|---------|----------------|
| **Checkout** | Retrieve source code | Foundation for all subsequent stages |
| **Setup Runtime** | Install Node.js 20 | Consistent, reproducible build environment |
| **Linting** | Enforce coding standards | Prevents technical debt, catches bugs early |
| **Unit Tests** | Validate business logic | Prevents regressions |
| **Build** | Package application | Catches build-time errors |
| **Docker Build** | Create container images | Ensures consistent deployment |
| **Container Test** | Validate container behavior | Ensures image is runnable |
| **Registry Push** | Publish trusted images | Enables downstream CD |
| **K8s Deploy** | Deploy to cluster | Production deployment |

### Running with Docker (Recommended)

#### Prerequisites
- Docker and Docker Compose installed

#### Quick Start with Docker Compose

```sh
# Clone the repository
git clone https://github.com/sailingsam/house-arena.git
cd house-arena

# Create environment file
cp backend/..env backend/.env
# Edit backend/.env with your MongoDB URI and secrets

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:4000

### GitHub Secrets Configuration

To run the CI/CD pipeline, configure these secrets in your GitHub repository:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `DOCKERHUB_USERNAME` | Your DockerHub username | Yes |
| `DOCKERHUB_TOKEN` | DockerHub access token | Yes |
| `KUBE_CONFIG` | Base64 encoded kubeconfig | For CD |
| `MONGO_URI` | MongoDB connection string | For CD |
| `TOKEN_SECRET` | JWT secret key | For CD |
| `EMAIL_USER` | Email for notifications | Optional |
| `EMAIL_PASS` | Email password | Optional |

#### Setting up DockerHub Token
1. Go to DockerHub > Account Settings > Security
2. Create a new access token
3. Add it to GitHub Secrets as `DOCKERHUB_TOKEN`

### Kubernetes Deployment

The `k8s/` directory contains production-ready Kubernetes manifests:

```
k8s/
├── namespace.yaml          # Resource isolation
├── configmap.yaml          # Non-sensitive configuration
├── backend-deployment.yaml # Backend pods with health checks
├── backend-service.yaml    # Internal service exposure
├── frontend-deployment.yaml# Frontend pods
├── frontend-service.yaml   # External load balancer
├── ingress.yaml           # HTTP routing
└── hpa.yaml               # Auto-scaling configuration
```

#### Manual Kubernetes Deployment

```sh
# Create namespace and secrets
kubectl apply -f k8s/namespace.yaml
kubectl create secret generic house-arena-secrets \
  --namespace=house-arena \
  --from-literal=MONGO_URI="your-mongo-uri" \
  --from-literal=TOKEN_SECRET="your-secret"

# Deploy application
kubectl apply -f k8s/

# Check status
kubectl get all -n house-arena
```

### Local Development

#### Backend
```sh
cd backend
npm install
npm run dev    # Development with hot reload
npm run lint   # Run ESLint
npm test       # Run tests
```

#### Frontend
```sh
cd frontend
npm install
npm run dev    # Development server
npm run lint   # Run ESLint
npm run build  # Production build
```

### Project File Structure

```
house-arena/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI Pipeline
│       └── cd.yml              # CD Pipeline
├── backend/
│   ├── Dockerfile              # Backend container
│   ├── .dockerignore
│   ├── .eslintrc.json          # Linting rules
│   ├── tests/                  # Unit tests
│   └── ...
├── frontend/
│   ├── Dockerfile              # Frontend container
│   ├── nginx.conf              # Nginx configuration
│   ├── .dockerignore
│   └── ...
├── k8s/                        # Kubernetes manifests
├── docker-compose.yml          # Local development
└── README.md
```

## Contributing

All code contributions must go through a pull request and be approved by a core developer before being merged. This is to ensure a proper review of all the code.

We truly love pull requests! If you wish to help, you can learn more about how you can contribute to this project in the [**contribution guide**](CONTRIBUTING.md).

## Contact

If you have any questions or suggestions, feel free to contact me at [jainsaksham1004@gmail.com](mailto:jainsaksham1004@gmail.com).# gilfoyle-cicd
