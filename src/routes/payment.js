const express = require('express');
const paymentRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require('../utils/constants');
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");
const User = require('../models/user');

// create order Razorpay
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const {membershipType} = req.body.membershipType;
        const {firstName, lastName, emailId} = req.user;
        const options = {
            "amount": membershipAmount[membershipType],
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
              "firstName": firstName,
              "lastName": lastName,
              "membershipType": membershipType,
            }
        };

       const order = await  razorpayInstance.orders.create(options, async function(err, order) {
            console.log(order);
            // save the order in DB,
            
            const payment = new Payment({
                userId: req.user._id,
                orderId: order.id,
                status: order.status,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
                notes: order.notes,
            });
            const savedPayment = await payment.save();


            // return back my order details to front end.
            res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

        });
    } catch (error) {
        
    }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
    const webhookBody = req.body;
    const webhookSignature = req.header("x-razorpay-signature");
    try {
      const isWebhookValid  =  validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
      if (!isWebhookValid) {
        return res.status(400).json({msg: "webhook signature is invalid"});
      }

    //   update my payment status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({orderId: paymentDetails.orderId});
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({
        _id: payment.userId
    });

    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();
    // update the user as premium.
   
      if(req.body.event == "payment.captured") {

      }

      if(req.body.event == "payment.failed") {

      }

       // return success response to razorpay.
      res.status(200).json({msg: "webhook received successfully"});
    } catch (error) {
        
    }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    const user = req.user.toJSON();
    if (user.isPremium) {
        return res.status(200).json({isPremium: true});
    }

    return res.status(200).json({isPremium: false});
})


module.exports = paymentRouter;