module.exports = {
  apps: [
    {
      name: 'gallery',
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
      },
      // Zero-downtime reload configuration
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,

      // Auto-restart configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',

      // Logging
      error_file: '/app/logs/error.log',
      out_file: '/app/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Time zone
      time: true,
    },
  ],
};
