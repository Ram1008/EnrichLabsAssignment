// src/models/job.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobSchema = new Schema({
  request_id: { type: String, index: true, unique: true, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['pending', 'processing', 'complete', 'failed'], default: 'pending' },
  result: Schema.Types.Mixed,
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() }
});


jobSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Job', jobSchema);
