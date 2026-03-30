# CLOTHI - Quick Start Guide

## 🚀 Start Development (2 Minutes)

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
✅ Wait for: `Server is running at http://0.0.0.0:3001`

### Terminal 2: Start Frontend  
```bash
cd frontend
npm run dev
```
✅ Wait for: `Ready in XXXms`

### 🌐 Open Browser
```
http://localhost:3000
```

---

## 🧪 Quick Test (5 Minutes)

### 1. Register New Account
- Go to http://localhost:3000/register
- Fill form with any info
- Click CREATE ACCOUNT
- ✅ Should be logged in & redirected home

### 2. Try Demo Google/Apple
- Click Google or Apple button
- ✅ Instant account created & logged in

### 3. Add to Cart
- Click product anywhere on site
- Select size & color
- Click ADD TO CART
- ✅ Should succeed (you're logged in)

### 4. Add to Favorites
- Still on product page
- Click heart button (♡)
- ✅ Should change to filled heart (❤️)
- Click again to unfavorite
- ✅ Should change back to empty

### 5. Test Session
- Refresh page (Ctrl+R)
- ✅ Still logged in
- Cart & favorites still there

---

## 📋 Features Checklist

- ✅ Register with email/password
- ✅ Login with email/password
- ✅ Demo Google OAuth
- ✅ Demo Apple OAuth
- ✅ Add to cart
- ✅ Remove from cart
- ✅ Update quantities
- ✅ Add to favorites
- ✅ Remove from favorites
- ✅ Session persistence
- ✅ Logout
- ✅ Error handling
- ✅ Form validation
- ✅ Loading states
- ✅ Mobile responsive

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Kill port 3001
lsof -ti:3001 | xargs kill -9

# Try again
npm run dev
```

### Frontend won't start
```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

### Mongoose warnings
✅ Already fixed in all models - no warnings expected

### Login not working
1. Check email/password correct
2. Verify registration first
3. Check backend logs for errors

### Cart not loading
1. Make sure you're logged in
2. Check browser console for errors
3. Verify backend is running

---

## 📚 Documentation Files

- **API_INTEGRATION.md** - Complete API reference & examples
- **SETUP_TESTING.md** - Detailed setup & testing guide
- **PRODUCTION_READY.md** - Production checklist
- **ISSUE_RESOLUTION_SUMMARY.md** - What was fixed & how

---

## ✨ Key Features Working

### Authentication
- Email/password registration & login
- Demo Google account creation
- Demo Apple account creation
- Session persistence with JWT
- Automatic session check on app load

### Shopping Cart
- Add items with size/color/quantity
- View cart contents
- Update quantities
- Remove items
- Clear entire cart
- Cart persists across sessions

### Favorites
- Toggle favorite with heart button
- View all favorites
- Remove from favorites
- Favorites persist across sessions

### User Experience
- Form validation with helpful errors
- Loading states during operations
- Success messages for actions
- Mobile responsive design
- Professional styling

---

## 🚀 Deploy to Production

Before deploying:

1. ✅ Set production API URL
2. ✅ Update MongoDB connection
3. ✅ Set secure JWT secrets
4. ✅ Configure OAuth with real credentials
5. ✅ Enable HTTPS
6. ✅ Test all features

See PRODUCTION_READY.md for full checklist.

---

## 💡 Tips

- Test registration first before login testing
- Use demo Google/Apple to test quick login
- Check browser DevTools (localStorage) to see token
- Watch backend logs while testing
- Test on mobile too (responsive design)

---

## 📞 Support

Any issues? Check the logs:

**Backend**: Watch terminal 1 for errors
**Frontend**: Check DevTools console (F12)
**Both**: Check the 4 documentation files

---

**Status**: ✅ Ready to Use
**Version**: 1.0.0
**Last Updated**: March 2026
