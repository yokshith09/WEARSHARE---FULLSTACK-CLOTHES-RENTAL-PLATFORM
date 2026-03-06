import { NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Booking from '@/models/Booking'
import Listing from '@/models/Listing'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request) {
  const token = getTokenFromRequest(request)
  const decoded = verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { paymentId, orderId, signature, rentalStart } = await request.json()

    // Verify Razorpay signature
    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const cart = await Cart.findOne({ userId: decoded.userId })
    if (!cart || !cart.items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const startDate = new Date(rentalStart)
    const bookings = []

    for (const item of cart.items) {
      const listing = await Listing.findById(item.listingId)
      if (!listing) continue

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + item.days)

      const booking = await Booking.create({
        listingId: item.listingId,
        lenderId: listing.ownerId,
        renterId: decoded.userId,
        rentalStart: startDate,
        rentalEnd: endDate,
        rentalPrice: item.rentalPricePerDay * item.days,
        securityDeposit: item.securityDeposit,
        totalAmount: item.rentalPricePerDay * item.days + item.securityDeposit,
        status: 'confirmed',
        paymentId,
        orderId
      })
      bookings.push(booking)
    }

    // Clear cart
    await Cart.deleteOne({ userId: decoded.userId })

    return NextResponse.json({ success: true, bookings: bookings.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
