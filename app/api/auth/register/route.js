import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, phone: phone || '' })

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name })

    const response = NextResponse.json({ success: true, name: user.name, email: user.email }, { status: 201 })
    response.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 })
    return response
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
