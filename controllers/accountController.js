
const Account = require('../models/account');

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAccount = async (req, res) => {
  const newAccount = new Account(req.body);
  try {
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllAccounts,
  createAccount
};
