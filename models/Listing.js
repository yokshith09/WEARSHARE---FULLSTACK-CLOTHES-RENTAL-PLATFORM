import mongoose from 'mongoose'

const ListingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  rentalPricePerDay: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  available: { type: Boolean, default: true },
  availableFrom: { type: String },
  availableUntil: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
