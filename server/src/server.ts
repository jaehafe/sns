import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('server is running!!');
});

let port = 4000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(() => {
      console.log('database initialized!!!');
    })
    .catch((error) => console.error(error));
});
