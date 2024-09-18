module.exports = {
  apps: [
    {
      name: "uet-api",
      script: "./src/index.js",
      instances: "max",
      exec_mode: "cluster",
      watch: ["src"],
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
    },
  ],
};
