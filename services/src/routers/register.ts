import express from 'express';
const router = express.Router();
import UserModel from '../model/user';
import { sendEmail, validateNIC } from '../client';
import configs from '../config.json';

import UserFactory from '../service/UserFactory';

router.post('/register', async (req, res) => {
  const body = req.body;
  const email = body.email;
  //let userFactory = new UserFactory();
  let exist: any;
  try {
    await UserModel.findOne({ email: email }, (err: Error, val: any) => {
      if (err) {
        console.log(err);
      } else {
        exist = val;
      }
    });

    if (exist) {
      if (exist.googleId) {
        res.status(200).json({ exist: true, _id: exist._id });
      } else {
        res.status(409).json({ exist: true });
      }
    } else {
      var discount = false;
      if (body.nic) {
        discount = await validateNIC(body.nic);
      }
      var type = body.googleId ? 'google' : 'regular';

      //creating user
      var user = UserFactory({ ...body, type, discount });

      //sending email
      const html =
        '<p>Hi ' +
        user.fname +
        ',<br><br> Thank you for registering with public transport ticketing system.<br><br>To activate your account, please click the following link and sign in now.<br>' +
        configs.backendUrl +
        '/users/reg/' +
        Buffer.from(body.email).toString('base64') +
        '</p> ';
      {
        type === 'regular' &&
          sendEmail({ ...body, html, subject: 'Confirm Your Email' });
      }

      var result = await user.save();
      res.status(200).json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/users/reg/:email', async (req, res) => {
  try {
    const encodedEmail = req.params.email;
    const email = Buffer.from(encodedEmail, 'base64').toString('ascii');

    //get user from db
    var user = await UserModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    user.set({ enabled: true });

    //saving user in db
    user.save();

    //redirecting user to homepage
    res.writeHead(302, {
      Location: configs.frontendUrl,
    });
    res.end();
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
