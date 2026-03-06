import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name })

    const response = NextResponse.json({ success: true, name: user.name, email: user.email })
    response.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 })
    return response
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
