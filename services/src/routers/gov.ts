import express from 'express';
const router = express.Router();
import employeeModel from '../model/employee';

router.get('/gov/employee/:nic', (req, res) => {
  try {
    employeeModel.findOne({ nic: req.params.nic }, (err: Error, val: any) => {
      if (err) {
        console.log(err);
      } else {
        if (val) {
          res.status(200).json({ validated: true });
        } else {
          res.status(200).json({ validated: false });
        }
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
