import { register } from 'tsx/esm/api';

register();
import('./server/index.ts').catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});