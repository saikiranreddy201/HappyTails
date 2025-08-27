import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  breed: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  age: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  weight: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
petSchema.index({ owner: 1, isActive: 1 });

// Virtual for pet's full info
petSchema.virtual('displayName').get(function() {
  return `${this.name} (${this.breed})`;
});

// Method to get pet's basic info
petSchema.methods.getBasicInfo = function() {
  return {
    id: this._id,
    name: this.name,
    breed: this.breed,
    age: this.age,
    weight: this.weight,
    gender: this.gender,
    image: this.image
  };
};

// Static method to find pets by owner
petSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId, isActive: true }).sort({ createdAt: -1 });
};

const petModel = mongoose.models.Pet || mongoose.model('Pet', petSchema);
export default petModel;