const concurrently = require("concurrently");
const path = require("path");

const { result } = concurrently(
  [
    {
      command: "npm run dev",
      name: "client",
      cwd: path.resolve(__dirname, "../client"),
      prefixColor: "blue",
    },
    {
      command: "npm run dev",
      name: "server",
      cwd: path.resolve(__dirname, "../server"),
      prefixColor: "green",
    },
  ],
  {
    prefix: "name",
    killOthers: ["failure", "success"],
    restartTries: 3,
  }
);

result.then(
  () => console.log("All processes exited successfully"),
  () => console.log("A process exited with error")
);
