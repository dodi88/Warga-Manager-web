/**
 * File: app.js
 * Bridge for Node.js Startup in cPanel
 */

import('tsx/cli').then(() => {
  import('./server.ts');
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
