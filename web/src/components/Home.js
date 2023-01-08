import React, { Component } from 'react';
import {
  routes,
  route,
  trainsByRoute,
  classes,
  schedules,
  getBookedSeatsCount,
} from '../Services';

import { Button, Form, Col, Row, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: '',
      fromOptions: [],
      toOptions: [],
      trains: [],
      errMsg: 'Required fields empty or invalid!!!',
      showErr: false,
    };
  }

  componentDidMount() {
    const uniqueStations = new Set();

    routes()
      .then(res => {
        res.map((item, i) => {
          return item.route.map((station, i) => {
            uniqueStations.add(station.name);
          });
        });
        this.setState({ res });

        const fromOptions = [...uniqueStations].map(station => {
          return {
            value: station,
            label: station,
            routes: res
              .map(item => {
                if (item.route.some(x => x.name === station)) {
                  return { name: item.name, id: item._id };
                }
                return null;
              })
              .filter(x => x !== null),
          };
        });
        this.setState({ fromOptions });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange = type => async selectedOption => {
    await this.setState({ [type]: selectedOption, showErr: false }, () => {
      this.calculateFair();
    });
    if (type === 'from') {
      this.setState({ to: '', train: '', from: selectedOption });
      const toStationNames = new Set();
      selectedOption.routes.forEach(routee => {
        route(routee.id)
          .then(res => {
            res.route.forEach(station => {
              if (station.name !== selectedOption.value) {
                toStationNames.add(station.name);
              }
            });
            const toOptions = [...toStationNames].map(station => {
              return {
                value: station,
                label: station,
                routes: selectedOption.routes
                  .map(item => {
                    if (item.name !== routee.name) {
                      return { name: item.name, id: item.id };
                    }
                    return null;
                  })
                  .filter(x => x !== null),
              };
            });
            this.setState({ toOptions });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
    if (type === 'to') {
      console.log({ selectedOption, from: this.state.from });
      const toStation = selectedOption.value;
      const fromStation = this.state.from.value;
      const allroutes = new Set();

      // find  all routes where from station is before to station in route array wrt index
      this.state.res.map((item, i) => {
        const fromIndex = item.route.findIndex(x => x.name === fromStation);
        const toIndex = item.route.findIndex(x => x.name === toStation);
        if (fromIndex < toIndex && fromIndex !== -1 && toIndex !== -1) {
          allroutes.add(item._id);
        }
      });
      console.log({ allroutes });
      const trains = [];
      allroutes.forEach(routee => {
        trainsByRoute(routee)
          .then(res => {
            const train = res.map((train, i) => {
              return {
                value: train.name,
                label: train.name,
                id: train._id,
                classes: train.classes,
                route: train.route,
                routeID: routee,
              };
            });
            trains.push(...train);
            this.setState({ trains });
            console.log({ trains });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
    if (type === 'train') {
      classes()
        .then(res => {
          var classes = [];
          res.map((trainClass, i) => {
            return classes.push({
              value: trainClass.name,
              label: trainClass.name,
              id: trainClass._id,
              fairRatio: trainClass.fairRatio,
            });
          });
          this.setState({ classes: classes });
        })
        .catch(err => {
          console.log(err);
        });
      schedules()
        .then(res => {
          var schedules = [];
          res.map((schedule, i) => {
            return schedules.push({
              value: schedule.time,
              label: schedule.time,
              id: schedule._id,
            });
          });
          this.setState({ schedules: schedules });
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.updateAvailableSeats();
  };

  updateAvailableSeats = () => {
    if (
      this.state.date &&
      this.state.time &&
      this.state.trainClass &&
      this.state.trains
    ) {
      const tc = this.state.trains.find(
        item => item.value === this.state.train.value
      );
      if (tc && tc.classes) {
        const seats = tc.classes.find(
          item => item.name === this.state.trainClass.value
        ).seats;
        const state = this.state;
        getBookedSeatsCount(
          state.train.value,
          state.trainClass.value,
          state.date,
          state.time.value
        )
          .then(res => {
            const bookings = res.bookings;
            const availableSeats = seats - bookings;
            this.setState({ availableSeats });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  handleQtyChange = () => event => {
    if (event.target.value === '') {
      this.setState({ qty: 0 }, () => this.calculateFair());
    }
    if (Number.isInteger(parseInt(event.target.value))) {
      this.setState({ qty: parseInt(event.target.value) }, () =>
        this.calculateFair()
      );
    }
  };

  calculateFair = () => {
    var user = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
    }
    if (
      this.state.to &&
      this.state.from &&
      this.state.trainClass &&
      this.state.qty
    ) {
      if (!this.state.train.routeID) return;
      route(this.state.train.routeID).then(res => {
        var fromIndex = res.route.findIndex(
          x => x.name === this.state.from.value
        );
        var toIndex = res.route.findIndex(x => x.name === this.state.to.value);
        var fair = res.route[toIndex].fair - res.route[fromIndex].fair;
        var amount =
          Math.abs(fair) * this.state.trainClass.fairRatio * this.state.qty;
        amount = amount.toFixed(2);
        var discount = (user && user.discount ? 0.1 * amount : 0).toFixed(2);
        var total = (amount - discount).toFixed(2);
        this.setState({ amount: amount, discount: discount, total: total });
      });
    }
  };

  handleSubmit = event => {
    this.setState({ showErr: false });
    const state = this.state;
    var user = localStorage.getItem('user');
    if (!user) {
      alert('Please Sign In Before Make a Reservation!!!');
      this.props.history.push('/');
    } else if (
      state.from &&
      state.to &&
      state.train &&
      state.trainClass &&
      state.time &&
      state.qty &&
      state.qty !== 0 &&
      state.date
    ) {
      this.props.history.push('/payment', { ...this.state });
    } else {
      this.setState({ showErr: true });
    }
    event.preventDefault();
    event.stopPropagation();
  };

  handleDateChange = async dt => {
    const date = moment(dt).format('YYYY-MM-DD');
    await this.setState({ date: date });
    this.updateAvailableSeats();
  };

  render() {
    const asColor =
      this.state.availableSeats < this.state.qty ? 'red' : 'black';
    const bookingDisable = this.state.availableSeats < this.state.qty;
    return (
      <Form style={{ padding: 20 }} onSubmit={e => this.handleSubmit(e)}>
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Form.Row
            style={{
              width: '75%',
              borderBottom: '1px solid rgb(200,200,200)',
              marginBottom: 20,
            }}
          >
            <h4>Book Bus Tickets</h4>
          </Form.Row>
          <Form.Row style={{ width: '75%' }}>
            <Form.Group as={Col} controlId="from">
              <Form.Label>From</Form.Label>
              <Select
                options={this.state.fromOptions}
                onChange={this.handleChange('from')}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="to">
              <Form.Label>To</Form.Label>
              <Select
                options={this.state.toOptions}
                onChange={this.handleChange('to')}
                value={this.state.to}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row style={{ width: '75%' }}>
            <Form.Group as={Col} controlId="from">
              <Form.Label>Bus</Form.Label>
              <Select
                options={this.state.trains}
                onChange={this.handleChange('train')}
                value={this.state.train}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="to">
              <Form.Label>Class</Form.Label>
              <Select
                options={this.state.classes}
                onChange={this.handleChange('trainClass')}
                value={this.state.trainClass}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row style={{ width: '75%' }}>
            <Col md={6} lg={6} xl={6}>
              <Form.Label>Date</Form.Label>
              <DatePicker
                className="form-control"
                onChange={this.handleDateChange}
                minDate={new Date()}
                value={this.state.date}
                placeholderText="YYYY-MM-DD"
              />
            </Col>
            <Form.Group as={Col} controlId="time">
              <Form.Label>Time</Form.Label>
              <Select
                options={this.state.schedules}
                onChange={this.handleChange('time')}
                value={this.state.time}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row style={{ width: '75%', paddingBottom: 20 }}>
            <Col md={6} lg={6} xl={6}>
              <Form.Label>No of Tickets</Form.Label>
              <Form.Control
                placeholder="qty"
                value={this.state.qty}
                onChange={this.handleQtyChange()}
              />
            </Col>
          </Form.Row>
          <Form.Row style={{ width: '75%', paddingLeft: 5, align: 'right' }}>
            {this.state.amount && (
              <Table striped size="sm">
                <tbody>
                  <tr>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      Available Seats
                    </td>
                    <td
                      align="right"
                      style={{
                        border: '1px solid #dee2e6',
                        color: asColor,
                      }}
                    >
                      {this.state.availableSeats}
                    </td>
                  </tr>
                  <tr style={{ border: 'none' }}>
                    <td style={{ border: 'none' }} height="40" />
                  </tr>
                  <tr>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      Amount
                    </td>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      {this.state.amount} INR
                    </td>
                  </tr>
                  <tr>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      Discount
                    </td>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      {this.state.discount} INR
                    </td>
                  </tr>
                  <tr>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      Total
                    </td>
                    <td align="right" style={{ border: '1px solid #dee2e6' }}>
                      {this.state.total} INR
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Form.Row>
          <Form.Row style={{ width: '75%' }}>
            {this.state.showErr && (
              <p style={{ color: 'red' }}>{this.state.errMsg}</p>
            )}
          </Form.Row>
          <Form.Row style={{ width: '75%', padding: 5 }}>
            <Button variant="primary" type="submit" disabled={bookingDisable}>
              Make Reservation
            </Button>
          </Form.Row>
        </Row>
      </Form>
    );
  }
}

export default Home;
