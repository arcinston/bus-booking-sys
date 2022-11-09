import express from 'express';
const router = express.Router();
import PhoneModel from '../model/phone';
import CardPaymentService from '../service/CardPaymentService';

router.post('/payment/card', async (req, res) => {
  try {
    const cardPaymentService = new CardPaymentService();
    var result = await cardPaymentService.pay(req.body);

    if (result == true) {
      res.status(200).json({ validated: true });
    } else {
      res.status(200).json({ validated: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/payment/phone', (req, res) => {
  const body = req.body;

  try {
    PhoneModel.findOne({ phone: body.phone, pin: body.pin }, (err, val) => {
      if (err) {
        res.status(500).json(err);
      } else if (!val) {
        res.status(200).json({ validated: false });
      } else {
        res.status(200).json({ validated: true });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
