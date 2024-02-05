// Importez le module mongoose
const mongoose = require('mongoose');

const subscribeNewsletterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }
});

const SubscribeNewsletter = mongoose.model('SubscribeNewsletter', subscribeNewsletterSchema);

module.exports = SubscribeNewsletter;
