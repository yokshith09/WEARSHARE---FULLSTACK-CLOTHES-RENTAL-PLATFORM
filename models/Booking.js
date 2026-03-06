import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  listingName: String,
  lenderId: String,
  lenderName: String,
  renterId: String,
  renterName: String,
  days: Number,
  rentalStart: Date,
  rentalEnd: Date,
  rentalPrice: Number,
  totalAmount: Number,
  securityDeposit: Number,
  status: { type: String, default: 'confirmed' },
  paymentId: String,
  orderId: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
