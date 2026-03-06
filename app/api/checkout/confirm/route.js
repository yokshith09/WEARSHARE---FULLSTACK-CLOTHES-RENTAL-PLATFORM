import { NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Booking from '@/models/Booking'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request) {
  const token = getTokenFromRequest(request)
  const decoded = verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { paymentId, orderId, signature, rentalStart } = await request.json()

    // Verify signature
    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    await connectDB()
    const cart = await Cart.findOne({ userId: decoded.userId })
    if (!cart || !cart.items.length) return NextResponse.json({ error: 'Cart empty' }, { status: 400 })

    // Create bookings
    for (const item of cart.items) {
      const subtotal = item.rentalPricePerDay * item.days
      const platformFee = Math.round((subtotal + item.securityDeposit) * 0.05)
      const total = subtotal + item.securityDeposit + platformFee

      await Booking.create({
        listingId: item.listingId,
        listingName: item.name,
        lenderId: item.ownerId,
        lenderName: item.ownerName,
        renterId: decoded.userId,
        renterName: decoded.name,
        days: item.days,
        rentalStart,
        totalAmount: total,
        securityDeposit: item.securityDeposit,
        paymentId,
        status: 'confirmed'
      })
    }

    await Cart.deleteOne({ userId: decoded.userId })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
