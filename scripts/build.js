const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "client");
const serverDir = path.join(rootDir, "server");

console.log("🏗️  Building Client...");
execSync("npm run build", { cwd: clientDir, stdio: "inherit" });

console.log("🏗️  Building Server...");
execSync("npm run build", { cwd: serverDir, stdio: "inherit" });

console.log("📦 Copying Client build to Server...");
// In a real scenario, we might want to copy dist to server/public or similar
// But our server is configured to serve from ../client/dist directly in development/production
// However, for a standalone build, we might want to copy it.
// Let's stick to the plan: "Build client -> copy to server/public" (or similar)
// My server code uses: app.use(express.static(path.join(__dirname, '../../client/dist')));
// This works fine if we keep the directory structure.
// So no copy needed if we deploy the whole repo.
// But if we want a standalone server artifact, we should copy.
// For this "Single Repo" setup, keeping them separate but built is fine.

console.log("✅ Build Complete!");
