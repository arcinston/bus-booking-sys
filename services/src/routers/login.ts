import express from 'express';
const router = express.Router();
import UserModel from '../model/user';

router.post('/login', (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  try {
    UserModel.findOne(
      { email: username, password: password },
      (err: Error, val: any) => {
        if (err) {
          console.log(err);
        } else {
          if (val) {
            res.status(200).json(val);
          } else {
            res.status(401).json('unauthorized');
          }
        }
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
