import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  request_id:  { type: String, required: true, unique: true, index: true },
  payload:     { type: Object, required: true },
  status:      { type: String, enum: ['pending','processing','complete','failed'], default: 'pending' },
  result:      { type: Object },     
  error:       { type: String },      
  updated_at:  { type: Date, default: Date.now },
});

jobSchema.pre('save', function() { this.updated_at = Date.now(); });

export default mongoose.model('Job', jobSchema);
