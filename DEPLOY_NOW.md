# 🚀 How to Update Your App on Vercel

You're ready to make your new App overhaul live! Here is the step-by-step guide:

## 1. Push Your Code to GitHub
Open a terminal in VS Code (or your current terminal app) and run the following commands one by one to push all the new changes (including the new Advanced AI Try-On and OTP Auth):

```bash
git add .
git commit -m "feat: complete UI overhaul, AI Try-On, and OTP Auth"
git push origin main
```
*(If your branch is named `master` instead of `main`, use `git push origin master`)*

## 2. Update Vercel Environment Variables
Because we added some new secrets, you MUST add them to your Vercel project before the AI and Emails will work in production!

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click on the **WearShare** project.
2. Click on the **Settings** tab.
3. On the left side, click **Environment Variables**.
4. Add the following keys and values exactly as they are in your local `.env.local` file:

**Required New Variables to Add:**
- `REPLICATE_API_TOKEN` = `r8_ZAbm1Vv5abETH0laUNML...` (The API key you just got)
- `JWT_SECRET` = (Copy the long string from your local .env.local)
- `RAZORPAY_KEY_ID` = (Copy from your local .env.local)
- `RAZORPAY_KEY_SECRET` = (Copy from your local .env.local)

*(If you also set up Email provider keys like `EMAIL_USER` or `EMAIL_PASS`, add those here too!)*

## 3. Wait for the Build
Because Vercel is linked to your GitHub repository, the moment you run `git push origin main`, Vercel will automatically start building the new version of your site.

You can watch it build in the "Deployments" tab. Once it turns Green ✅, your new advanced app will be live at `https://wearshare-six.vercel.app`!
