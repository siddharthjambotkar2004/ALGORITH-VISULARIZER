console.log('Starting server...');
import('./src/index.js').catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
