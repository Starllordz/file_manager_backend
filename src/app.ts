import cors from 'cors';
import express from 'express';
import routes from './routes';
import config from './config/config';


const app = express();

app.use(express.json());
app.use(cors(config.cors));

app.use(`${config.api.basePath}/${config.api.version}`, routes);

export default app;