import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Basic Grooming',
      'Premium Grooming', 
      'Spa & Wellness',
      'Nail & Paw Care',
      'Dental Care',
      'Specialty Services'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 15,
    max: 300
  },
  image: {
    type: String,
    default: ''
  },
  suitableFor: [{
    type: String,
    enum: ['Small Breed', 'Medium Breed', 'Large Breed', 'Extra Large Breed', 'All Breeds']
  }],
  features: [{
    type: String,
    trim: true
  }],
  available: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0 // percentage
  },
  slots: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Virtual for discounted price
serviceSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Index for better search performance
serviceSchema.index({ category: 1, available: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

// Static method to get services by category
serviceSchema.statics.getByCategory = function(category) {
  return this.find({ category, available: true }).sort({ createdAt: -1 });
};

// Static method to get popular services
serviceSchema.statics.getPopular = function() {
  return this.find({ popular: true, available: true }).sort({ createdAt: -1 });
};

const serviceModel = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default serviceModel;