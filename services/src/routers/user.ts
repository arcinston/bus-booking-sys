import express from 'express';
const router = express.Router();
import UserModel from '../model/user';
import { validateNIC } from '../client';

router.put('/users/:id', async (req, res) => {
  const body = req.body;
  try {
    var user = await UserModel.findById(req.params.id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const discount = body.nic ? await validateNIC(body.nic) : false;
    user.set({ ...body, discount: discount });
    var result = await user.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/users', async (req, res) => {
  try {
    var userList = await UserModel.find();
    res.status(200).json(userList);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const result = await UserModel.deleteOne({ email: req.params.id }).exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const result = await UserModel.findOne({ email: req.params.id }).exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
