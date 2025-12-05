const { spawn } = require("child_process");
const path = require("path");

const serverDir = path.resolve(__dirname, "../server");

console.log("🚀 Starting Production Server...");

const child = spawn("npm", ["start"], {
  cwd: serverDir,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

child.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});
