
const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  stockInicial: {
    type: Number,
    required: true,
    min: 0
  },

  stockDisponible: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prize', prizeSchema);
