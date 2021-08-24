module.exports = {
  apps: [
    {
      name: 'Notedly',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
