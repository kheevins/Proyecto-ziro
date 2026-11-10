
const mongoose = require('mongoose');

const prizeClaimSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },

  xp: {
    type: Number,
    required: true,
    min: 1000
  },

  tipo: {
    type: String,
    enum: ['fisico', 'digital'],
    required: true
  },

  premioId: {
    type: String,
    default: null
  },

  carta: {
    type: String,
    default: null
  },

  codigo: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrizeClaim', prizeClaimSchema);
