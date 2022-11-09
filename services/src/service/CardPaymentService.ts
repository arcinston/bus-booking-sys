import CardModel from '../model/card';

class CardPaymentService {
  validateFields(data: { card: any; cvc: any; exp: any }) {
    return data.card && data.cvc && data.exp;
  }

  async checkAccountExistance(data: { card: any; cvc: any; exp: any }) {
    var cardObj = {};
    await CardModel.findOne(
      { card: data.card, cvc: data.cvc, exp: data.exp },
      (err: any, val: {}) => {
        if (err) {
          console.log(err);
        } else if (val) {
          cardObj = val;
        }
      }
    );
    return cardObj;
  }

  checkAmount(currentAmount: number, purchaseAmount: number) {
    return currentAmount >= purchaseAmount;
  }

  reduceAmount(val: any, purchaseAmount: number) {
    const newAmt = val.amount - purchaseAmount;
    val.set({ ...val, amount: newAmt });
    val.save();
  }
}
export default CardPaymentService;
