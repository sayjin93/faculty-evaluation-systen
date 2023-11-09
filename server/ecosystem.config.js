module.exports = {
  apps: [{
    name: 'uet-api',
    script: './src/index.js',
    watch: ['src'],
    watch_delay: 1000,
    ignore_watch: ['node_modules'],
  }],
};
