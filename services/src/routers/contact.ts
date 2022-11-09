import express from 'express';
const router = express.Router();
import contactModel from '../model/contact';
import { sendEmail } from '../client';

router.post('/railway/contact', async (req, res) => {
  try {
    const body = req.body;
    var contact = new contactModel(body);
    var result = await contact.save();
    const phone = body.phone ? 'Phone :<b> ' + body.phone + ' </b><br> ' : '';
    const html =
      '<h2><u>User Contact</u></h2><p>Reference No : <b> ' +
      result._id +
      ' </b><br><br>Name : <b> ' +
      body.fname +
      ' ' +
      body.lname +
      ' </b><br> ' +
      phone +
      '  Email :<b> ' +
      body.email +
      ' </b><br>Message : <b>' +
      body.message +
      ' </b></p> ';
    sendEmail({
      ...body,
      html: html,
      subject: 'User Contact',
      email: body.email + ', sl.railway.e.ticketing@gmail.com',
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
