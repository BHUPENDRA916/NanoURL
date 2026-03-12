import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  }
});

clickSchema.index({ shortCode: 1, timestamp: -1 });

const Click = mongoose.model('Click', clickSchema);

export default Click;
