import Gig from "../models/gig.model.js"
import Order from "../models/order.model.js"
import createError from "../utils/createError.js"
import Stripe from "stripe";
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
            // isCompleted: false,
        });

        res.status(200).send(orders);
    } catch (err) {
        next(err);
    }
};
const getOrder = (req, res) => {
    try {

    } catch (error) {
        next(err)
    }
}
const createOrder = async (req, res, next) => {

    try {

        const gig = await Gig.findById(req.params.gigId);


        const newOrder = new Order({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: req.userId,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: "temporary"
        });

        await newOrder.save();
        res.status(200).send("successful");
    } catch (error) {
        return next(createError(500, "Onlly sellerss can create a gig"));
    }
}


const intent = async (req, res, next) => {
    const stripe = new Stripe(
        process.env.STRIPE
    );


    const gig = await Gig.findById(req.params.gigID);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: gig.price * 100,
        currency: "cad",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    const newOrder = new Order({
        gigId: gig._id,
        img: gig.cover,
        title: gig.title,
        buyerId: req.userId,
        sellerId: gig.userId,
        price: gig.price,
        payment_intent: paymentIntent.id
    });
    await newOrder.save();

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
        // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
        // dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });

}

export const confirm = async (req, res, next) => {
    try {
      const orders = await Order.findOneAndUpdate(
        {
          payment_intent: req.body.payment_intent,
        },
        {
          $set: {
            isCompleted: true,
          },
        }
      );
  
      res.status(200).send("Order has been confirmed.");
    } catch (err) {
      next(err);
    }
  };
  

export {
    getOrders, createOrder, getOrder, intent
}