module.exports = {
  apps: [
    {
      name: 'dulwich-prerender',
      script: 'prerender',
      args: '--port 3001',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'dulwich-web',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        PRERENDER_SERVICE_URL: 'http://localhost:3001/'
      }
    }
  ]
};
