import app from './app';
import config from './config/config';

const { port, host } = config.server;

app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});