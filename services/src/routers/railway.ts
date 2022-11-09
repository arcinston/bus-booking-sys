import express from 'express';
const router = express.Router();
import routeModel from '../model/route';
import trainModel from '../model/train';
import classModel from '../model/classes';
import scheduleModel from '../model/schedule';
import reservationModel from '../model/reservation';
import { sendReservationEmail, sendTextMessage } from '../client';
import configs from '../config.json';
import qrcode from 'qrcode';

router.get('/railway/routes', async (_req, res) => {
  try {
    const result = await routeModel.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/route/:id', async (req, res) => {
  try {
    const result = await routeModel.findOne({ _id: req.params.id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/trains', async (_req, res) => {
  try {
    const result = await trainModel.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/trains/:route', async (req, res) => {
  try {
    const route = await routeModel.findOne({ _id: req.params.route });
    if (!route) {
      throw new Error('Route not found');
    }

    const result = await trainModel.find({ route: route.name });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/classes', async (_req, res) => {
  try {
    const result = await classModel.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/schedules', async (_req, res) => {
  try {
    const result = await scheduleModel.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/railway/reservations', async (req, res) => {
  try {
    const body = req.body;
    var reservation = new reservationModel(body);
    var result = await reservation.save();

    // send email
    const img = await qrcode.toDataURL(
      configs.frontendUrl + '/ticket/' + result._id
    );
    var base64Data = img.replace(/^data:image\/png;base64,/, '');
    await require('fs').writeFile(
      'images/' + result._id + '.png',
      base64Data,
      'base64',
      function (err: any) {
        console.log(err);
      }
    );

    const html =
      '<html><body><h2><u>Reservation Slip</u></h2><p>Reference No : <b> ' +
      result._id +
      ' </b><br><br>From <b> ' +
      body.from +
      ' </b> to <b> ' +
      body.to +
      ' </b><br>' +
      'Date :<b> ' +
      body.date +
      ' </b> Time :<b> ' +
      body.time +
      ' </b><br>Train : <b>' +
      body.train +
      ' </b> Class: <b> ' +
      body.trainClass +
      ' </b><br>Quantity : <b> ' +
      body.qty +
      ' </b></p><p>Total : <b> ' +
      body.total +
      ' LKR</b></p><br><img src="cid:123"/></body></html>';
    sendReservationEmail({
      ...body,
      html: html,
      subject: 'Railway e-Ticket',
      path: 'images/' + result._id + '.png',
    });

    // send text message
    if (body.phone) {
      sendTextMessage({ ...body, reservationID: result._id });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/reservations', async (_req, res) => {
  try {
    const result = await reservationModel.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/railway/users/:user/reservations', async (req, res) => {
  try {
    const result = await reservationModel.find({ user: req.params.user });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get(
  '/railway/reservations/trains/:train/class/:trainClass/date/:date/time/:time',
  async (req, res) => {
    try {
      const train = req.params.train;
      const trainClass = req.params.trainClass;
      const date = req.params.date;
      const time = req.params.time;
      //TODO: FIX THIS SHIT CODE
      /* eslint-disable no-return-assign, no-param-reassign */
      const result = await reservationModel.find({
        train: train,
        trainClass: trainClass,
        date: date,
        time: time,
      });
      /* eslint-disable no-return-assign, no-param-reassign */
      var bookings = 0;
      result.map(item => (bookings += item.qty));
      if (result.length <= 0) {
        res.status(200).json({ bookings: 0 });
      } else {
        res.status(200).json({ bookings });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get('/railway/reservations/:id', async (req, res) => {
  try {
    const result = await reservationModel
      .findOne({ _id: req.params.id })
      .exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/railway/reservations/:id', async (req, res) => {
  try {
    const result = await reservationModel
      .deleteOne({ _id: req.params.id })
      .exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/railway/route', async (req, res) => {
  const query = { name: req.body.name };
  routeModel.find(query, (err, route) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      if (route.length != 0) {
        res.status(200).json({ routeExist: true });
      } else {
        let routes = new routeModel(req.body);
        routes.save(err => {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          } else {
            res.status(200).json({ routeExist: false });
          }
        });
      }
    }
  });
});

router.put('/railway/route', async (req, res) => {
  const body = {
    name: req.body.station,
    fair: req.body.fair,
  };
  const query = { name: req.body.name };
  await routeModel.find(query, async (err, route) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      var found = null;
      found = await route[0].route.find(function (data) {
        return data.name === req.body.station;
      });

      if (found) {
        res.status(200).json({ stationExist: true });
      } else {
        routeModel.updateOne(query, { $push: { route: body } });
      }
    }
  });
});

router.post('/railway/train', async (req, res) => {
  const query = { name: req.body.name };
  trainModel.find(query, (err, train) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      if (train.length != 0) {
        res.status(200).json({ trainExist: true });
      } else {
        let trains = new trainModel(req.body);
        trains.save(err => {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          } else {
            res.status(200).json({ trainExist: false });
          }
        });
      }
    }
  });
});

router.delete('/railway/train', async (req, res) => {
  const query = { name: req.body.name };
  trainModel.deleteOne(query, (err: any) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json({ status: true });
    }
  });
});

router.delete('/railway/route', async (req, res) => {
  const query = { name: req.body.name };
  routeModel.deleteOne(query, (err: any) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json({ status: true });
    }
  });
});

router.post('/railway/reservations/monthly', (req, res) => {
  const yearMonth = req.body.year + '-' + req.body.month;
  const query = { date: new RegExp(yearMonth, 'i') };
  reservationModel.find(query as any, (err: any, reservation: any) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(reservation);
    }
  });
});

router.post('/railway/reservations/yearly', (req, res) => {
  const query = { date: new RegExp(req.body.year, 'i') };
  reservationModel.find(query as any, (err: any, reservation: any) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(reservation);
    }
  });
});

export default router;
