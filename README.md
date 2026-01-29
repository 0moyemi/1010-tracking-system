# Business Tracker - Nigerian SME App 🇳🇬

A mobile-first Progressive Web App (PWA) built with Next.js and Tailwind CSS for Nigerian small business owners.

## Features ✨

### 📦 Orders Section
- **Quick Add**: Tap to add orders with auto-date formatting (ddmmyy)
- **Status Tracking**: New → Confirmed → Delivered → Cancelled
- **Smart Highlighting**: Green for delivered, red for cancelled
- **Revenue Tracking**: Auto-calculate daily and weekly revenue in ₦
- **Progress Indicators**: Visual progress bars for weekly orders

### ✅ Daily Status Section
- **Monthly View**: Vertical layout showing Monday-Sunday
- **Checkbox System**: Simple taps to mark daily activity
- **5-Day Broadcast Rule**: Broadcasts unlock after 5 consecutive days
- **Color Coding**: 
  - ✅ Done (Green)
  - ⚠️ Skipped (Yellow)
  - ⏳ Future (Gray)
- **Progress Tracking**: Weekly completion visualization

### 📢 Broadcasts Section
- **Automatic Unlock**: Available only after 5 days of daily status
- **Simple Tracking**: One-tap to mark broadcasts as sent
- **History View**: See all past broadcasts

### 💬 Shortcut Templates
- **6 Pre-filled Templates**: 
  - New Order Confirmation
  - Order Ready for Delivery
  - Payment Reminder
  - Order Delivered
  - Product Availability
  - Thank You Message
- **One-Click Copy**: Copy and paste directly into WhatsApp
- **Customizable**: Edit placeholders like [ITEM], [PRICE], [DATE]

## Design Principles 🎨

### Mobile-First
- All tap targets are large (minimum 44px)
- No horizontal scrolling
- Optimized for one-handed use
- Font size minimum 16px (prevents iOS zoom)

### Accessibility (60+ Users)
- Clear, large labels with emojis
- High contrast colors
- Simple navigation with obvious buttons
- No guessing required - everything is labeled

### Color Scheme
- **Primary**: #081F44 (Dark Blue)
- **Secondary**: #0a2857 (Lighter Blue)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red

### Dark/Light Mode
- Toggle button in header
- Preference saved automatically
- Optimized for both modes

## Technical Features 🛠️

### PWA Capabilities
- **Offline Support**: Service Worker with aggressive caching
- **Installable**: Add to home screen on mobile
- **Fast Loading**: Cache-first strategy
- **Auto-save**: All data saved to localStorage instantly

### Performance
- Next.js 16 with App Router
- Tailwind CSS 4 for minimal CSS
- No external API calls (fully offline)
- Instant interactions (no loading states)

## Getting Started 🚀

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure 📁

```
my-app/
├── app/
│   ├── components/
│   │   ├── OrdersSection.tsx          # Orders management
│   │   ├── DailyStatusSection.tsx     # Daily activity tracking
│   │   ├── BroadcastsSection.tsx      # Broadcast scheduling
│   │   └── ShortcutTemplatesSection.tsx # WhatsApp templates
│   ├── globals.css                     # Global styles + mobile optimizations
│   ├── layout.tsx                      # Root layout with PWA metadata
│   └── page.tsx                        # Main page with navigation
├── public/
│   ├── manifest.json                   # PWA manifest
│   ├── sw.js                          # Service Worker
│   ├── icon-192.png                   # App icon (192x192)
│   └── icon-512.png                   # App icon (512x512)
├── next.config.ts
├── package.json
└── README.md
```

## Usage Guide 📖

### Adding an Order
1. Tap **"+ Quick Add Order"** button
2. Enter item name
3. Enter price in ₦
4. Date auto-fills to today
5. Tap **"Add Order"**
6. Change status as order progresses

### Tracking Daily Status
1. Scroll to **Daily Status** section
2. Tap checkbox for each day you post
3. After 5 consecutive days, broadcast unlocks
4. View progress bar for weekly completion

### Sending Broadcasts
1. Complete 5 days of daily status
2. Broadcast button becomes available
3. Tap **"Mark Broadcast as Done"**
4. Wait 5 more days for next broadcast

### Using Templates
1. Scroll to **Templates** section
2. Tap any template to copy
3. Open WhatsApp
4. Paste and customize before sending

## Data Storage 💾

All data is stored locally in your browser's localStorage:

- **Orders**: `localStorage.getItem('orders')`
- **Daily Status**: `localStorage.getItem('dailyStatus')`
- **Broadcasts**: `localStorage.getItem('broadcasts')`
- **Theme**: `localStorage.getItem('theme')`

### Clearing Data
To reset all data, open browser console and run:
```javascript
localStorage.clear();
location.reload();
```

## Mobile Installation 📱

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

## Customization 🎨

### Changing Colors
Edit app/globals.css:
```css
:root {
  --primary: #081F44;  /* Change primary color */
  --primary-light: #0a2857;  /* Change secondary color */
}
```

### Adding More Templates
Edit app/components/ShortcutTemplatesSection.tsx and add to the templates array.

### Modifying Order Status Options
Edit app/components/OrdersSection.tsx and update the status type and dropdown options.

## Browser Support 🌐

- ✅ Chrome 90+ (Android/Desktop)
- ✅ Safari 14+ (iOS/macOS)
- ✅ Edge 90+
- ✅ Firefox 88+

## Troubleshooting 🔧

### Data not saving
- Check if localStorage is enabled in browser
- Clear cache and reload
- Check browser console for errors

### App not installing
- Ensure HTTPS (required for PWA)
- Check manifest.json is accessible
- Verify service worker is registered

### Styles not loading
- Clear browser cache
- Run npm run build again
- Check Tailwind CSS configuration

---

**Made with ❤️ for Nigerian SME Owners**

*Empowering small businesses with simple, effective tools.*


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
