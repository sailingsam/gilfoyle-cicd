import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Middleware
app.use(cors({}));
app.use(morgan("dev"));
app.use(json());

// =============================================================================
// API Endpoints
// =============================================================================
// This is a simplified backend focused on demonstrating CI/CD pipeline.
// Single API endpoint without authentication for DevOps project demonstration.
// =============================================================================

// Health check endpoint for container orchestration (Kubernetes liveness/readiness probes)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "house-arena-backend",
    version: "1.1.0"
  });
});

// Main API endpoint - Returns system status and information
app.get("/api/status", (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: "operational",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
    },
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version
  });
});

// Welcome endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to House Arena API - Live Demo",
    version: "1.1.0",
    endpoints: [
      { method: "GET", path: "/api/health", description: "Health check endpoint" },
      { method: "GET", path: "/api/status", description: "System status and metrics" }
    ]
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler (Express requires 4 params for error middleware)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    timestamp: new Date().toISOString()
  });
});

export default app;

