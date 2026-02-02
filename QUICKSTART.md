# Quick Start Guide - Scrapify Platform

## ⚡ How to See Your Website

Since PowerShell execution is restricted, follow these steps:

### Method 1: Using Command Prompt (EASIEST)

1. **Open Command Prompt** (not PowerShell)
   cd C:\Users\gaikw\.gemini\antigravity\scratch\waste-trading-platform
   ```

3. **Start the server**
   
   ```

4. **Open your browser**
   - Go to: **http://localhost:3000**

### Method 2: Using File Explorer

1. Open File Explorer
2. Navigate to: `C:\Users\gaikw\.gemini\antigravity\scratch\waste-trading-platform`
3. Type `cmd` in the address bar and press Enter
4. In the Command Prompt that opens, type:
   ```cmd
   npm run dev
   ```
5. Open browser to: **http://localhost:3000**

### Method 3: Fix PowerShell (For Future)

If you want to use PowerShell in the future:

1. **Open PowerShell as Administrator**
2. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Then you can use `npm run dev` in PowerShell

---

## 🎯 What You'll See

Once the server starts, you'll see:

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

Then open **http://localhost:3000** in your browser!

---

## 👤 Test Accounts

**Admin Account:**
- Email: `admin@waste.com`
- Password: `admin123`

**Create Your Own:**
- Click "Sign Up" and choose Seller or Buyer role

---

## 🎨 Features to Try

1. **Home Page** - Beautiful landing page
2. **Sign Up** - Create seller/buyer account
3. **Login** - Access your dashboard
4. **Create Listing** (Seller) - Upload waste with images
5. **Browse Listings** (Buyer) - Filter and search
6. **Admin Panel** - Approve listings, manage users

---

## ❓ Troubleshooting

**Server won't start?**
- Make sure you're in the correct directory
- Check if port 3000 is already in use
- Try: `npm install` first if you see errors

**Can't access localhost:3000?**
- Make sure the server is running (you should see "Ready in X.Xs")
- Try: http://127.0.0.1:3000 instead

---

## 📞 Need Help?

The server must be running to see the website. Keep the Command Prompt window open while using the site!
