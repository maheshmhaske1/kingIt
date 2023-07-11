const Recharge = require('../model/recharge.model');

exports.createRecharge = async (req, res) => {
  const { image, username, sender, name, paymentId, price, coin, action } = req.body;

  try {
    const newRecharge = new Recharge({
      image: image,
      username: username,
      sender: sender,
      name: name,
      paymentId: paymentId,
      price: price,
      coin: coin,
      action: action,
    });

    await newRecharge.save();

    return res.status(201).json({
      success: true,
      message: 'Recharge transaction created successfully',
      data: newRecharge,
    });
  } catch (error) {
    console.error('Error creating recharge transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create recharge transaction',
      error: error.message,
    });
  }
};
