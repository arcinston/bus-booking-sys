import express from 'express';
const app = express();
import config from './config.json';
import login from './routers/login';
import register from './routers/register';
import railway from './routers/railway';
import payment from './routers/payment';
import gov from './routers/gov';
import user from './routers/user';
import contact from './routers/contact';
import admin from './routers/admin';
import mongoose from 'mongoose';

mongoose.connect(config.mongoDB, { useNewUrlParser: true }, function (err) {
  if (err) throw err;
  console.log('mongo db connected');
});

app.use(express.static('images'));
app.use(express.json());
app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(login, register, railway, payment, gov, user, contact, admin);
app.listen(3001, () => {
  console.log('app listening on port 3001');
});
