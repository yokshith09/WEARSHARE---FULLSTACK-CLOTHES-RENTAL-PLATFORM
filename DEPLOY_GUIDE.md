# 🚀 WearShare - Deploy in 15 Minutes

## Your Complete Tech Stack
- **Frontend + Backend**: Next.js 14 (React + API Routes)
- **Database**: MongoDB Atlas (free tier)
- **Payments**: Razorpay (India)
- **Hosting**: Vercel (free tier)

---

## Step 1: Get MongoDB URI (Free, 5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → "Build a database" → Select **FREE M0**
3. Choose AWS, any region → Click **Create**
4. Create username & password (save them!)
5. In "Network Access" → Add IP → **Allow Access from Anywhere** (0.0.0.0/0)
6. In "Database" → Click **Connect** → "Connect your application"
7. Copy the URI: `mongodb+srv://username:password@cluster.mongodb.net/wearshare`

---

## Step 2: Get Razorpay Keys (Free, 3 min)

1. Go to https://dashboard.razorpay.com
2. Create account (free, no KYC needed for test mode)
3. Go to **Settings → API Keys** → **Generate Test Key**
4. Copy:
   - Key ID: `rzp_test_XXXXXXXX`
   - Key Secret: `YYYYYYYY`

---

## Step 3: Deploy to Vercel (Free, 5 min)

### Option A: GitHub (Recommended)

1. Create GitHub account at https://github.com
2. Create new repository named `wearshare`
3. Upload all project files
4. Go to https://vercel.com → Sign up with GitHub
5. Click **"Add New Project"** → Import your repo
6. Before deploying, add **Environment Variables**:
   ```
   MONGODB_URI = mongodb+srv://...your uri...
   JWT_SECRET = any-random-string-here-make-it-long
   RAZORPAY_KEY_ID = rzp_test_XXXXXXXX
   RAZORPAY_KEY_SECRET = YYYYYYYY
   ```
7. Click **Deploy** → Get your live URL!

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts, add env vars when asked
```

---

## Step 4: Seed Demo Data

After deployment, visit:
`https://your-app.vercel.app/api/seed`

This creates 10 demo clothing listings so people can browse immediately!

---

## Step 5: Test Payment

Use these test card details:
- **Card**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **OTP**: 1234 (Razorpay test OTP)

---

## Your App Will Have:
✅ Beautiful home page with hero section
✅ Browse & search with filters (category, price, size)
✅ User registration & login
✅ Add items to cart
✅ Razorpay payment integration
✅ Booking confirmation
✅ User dashboard with rental history
✅ List your own items for rent
✅ Mobile responsive design
✅ 10 demo items pre-loaded

---

## Demo Credentials (after seeding)
- Email: `demo@wearshare.in`
- Password: `demo123456`

---

## Going Live (Real Payments)

1. Complete KYC on Razorpay dashboard
2. Replace test keys with live keys in Vercel env vars
3. That's it! Real payments work in India via UPI, Cards, NetBanking

---

## Sharing With Friends

Share your Vercel URL: `https://your-app.vercel.app`

They can:
- Register with their email
- Browse items
- Rent clothes with real/test payment
- List their own clothes for rent
