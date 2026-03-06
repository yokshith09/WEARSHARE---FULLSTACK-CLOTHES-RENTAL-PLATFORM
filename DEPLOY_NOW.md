# 🚀 WearShare - Deploy in 15 Minutes

## What You're Getting
A live peer-to-peer clothing rental app with:
- User registration & login
- Browse & rent items
- **Razorpay payment integration** (real INR payments!)
- Dashboard to manage rentals
- List your own items

---

## Step 1: Get Free Services (5 min)

### MongoDB Atlas (Database - Free)
1. Go to https://cloud.mongodb.com
2. Sign up free → Create Organization → Create Project → Build a Cluster (M0 Free)
3. Database Access → Add DB User (username/password) → note them
4. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Click "Connect" on your cluster → Drivers → Copy the connection string
   - Looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/wearshare?retryWrites=true`

### Razorpay (Payments - Free Test Mode)
1. Go to https://razorpay.com → Sign Up free
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy: **Key ID** (starts with `rzp_test_`) and **Key Secret**
4. ⚠️ Test mode is free - no real money charged during testing!

---

## Step 2: Deploy to Vercel (5 min)

### Option A: Deploy via GitHub (Recommended)
1. Create account at https://github.com and https://vercel.com
2. Upload this project folder to GitHub (drag & drop at github.com/new)
3. In Vercel: New Project → Import from GitHub → Select your repo
4. Add Environment Variables (see Step 3)
5. Click Deploy!

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
cd wearshare
vercel --prod
```

---

## Step 3: Set Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/wearshare?retryWrites=true` |
| `JWT_SECRET` | Any random string e.g. `wearshare-super-secret-key-2024` |
| `RAZORPAY_KEY_ID` | `rzp_test_XXXXXXXXXXXXXX` |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret key |

Click "Save" then redeploy.

---

## Step 4: Seed Demo Data

After deployment, visit:
```
https://your-app.vercel.app/api/seed
```

This creates 10 demo clothing listings so your friends can start browsing immediately!

---

## Step 5: Share with Friends! 🎉

Your app is live at: `https://your-app.vercel.app`

### Test Payment
Use Razorpay test card:
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `1234`

---

## Going Live with Real Payments

1. Complete Razorpay KYC (business verification)
2. Replace test keys with live keys in Vercel environment variables
3. That's it! Real INR payments start flowing 💰

---

## Sharing the Platform

Share the link with:
- WhatsApp: "Hey! Rent premium clothes on WearShare: https://your-app.vercel.app"
- Instagram: Post about it with the link
- Community groups: Post the link and explain how to register

---

## Support

- MongoDB Docs: https://docs.atlas.mongodb.com
- Razorpay Docs: https://razorpay.com/docs
- Vercel Docs: https://vercel.com/docs
