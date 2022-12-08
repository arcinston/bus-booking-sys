import fetch, { Response } from 'node-fetch';
import nodemailer from 'nodemailer';
import config from './config.json';

const twilio = require('twilio')(
  config.messageClient.accountSid,
  config.messageClient.authToken
);

const validateNIC = (nic: string) => {
  return fetch(config.govAPI + nic)
    .then(handleErrors)
    .then(res => res.json())
    .then(data => {
      return data.validated;
    })
    .catch(err => {
      console.log(err);
    });
};

const sendEmail = async (body: { email: any; subject: any; html: any }) => {
  const emailConfig = config.emailClient;

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: 465,
    secure: true,
    auth: emailConfig.auth,
  });

  var mailOptions = {
    from: '"Sri Lanka Railways"' + emailConfig.email,
    to: body.email,
    subject: body.subject,
    html: body.html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const sendReservationEmail = async (body: {
  email: any;
  subject: any;
  html: any;
  path: any;
}) => {
  const emailConfig = config.emailClient;

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: 465,
    secure: true,
    auth: emailConfig.auth,
  });

  var mailOptions = {
    from: '"Sri Lanka Railways"' + emailConfig.email,
    to: body.email,
    subject: body.subject,
    html: body.html,
    attachments: [
      {
        path: body.path,
        cid: '123',
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const sendTextMessage = async (body: {
  phone: any;
  reservationID: string;
  from: string;
  to: string;
  date: string;
  time: string;
  train: string;
  trainClass: string;
  qty: string;
  total: string;
}) => {
  var to = body.phone;
  if (to.startsWith('0')) {
    to = to.replace('0', '+94');
  }
  twilio.messages
    .create({
      body:
        'Sri Lanka Railway - Reservation Slip \n\n Reference No : ' +
        body.reservationID +
        ' \n\n From ' +
        body.from +
        ' to ' +
        body.to +
        ' \n Date : ' +
        body.date +
        ' \n Time : ' +
        body.time +
        ' \n Train : ' +
        body.train +
        ' \n Class: ' +
        body.trainClass +
        ' \n Quantity : ' +
        body.qty +
        ' \n Total : ' +
        body.total +
        ' INR',
      from: config.messageClient.phoneNo,
      to: to,
    })
    .then((message: { sid: any }) => console.log(message.sid))
    .catch((err: any) => console.log(err));
};

const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw new Error('Request failed ' + response.statusText);
  }
  return response;
};

export { validateNIC, sendEmail, sendReservationEmail, sendTextMessage };
