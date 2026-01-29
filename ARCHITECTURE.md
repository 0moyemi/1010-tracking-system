# 🏗️ Architecture & Code Explanation

## Overview

This is a **mobile-first Progressive Web App (PWA)** built with:
- **Next.js 16** (React framework with App Router)
- **Tailwind CSS 4** (Utility-first CSS)
- **TypeScript** (Type safety)
- **Service Workers** (Offline support)
- **localStorage** (Client-side data persistence)

## Component Architecture

### 1. Main Page (`app/page.tsx`)

**Purpose**: Container for all sections with navigation

**Key Features**:
```typescript
// State management
const [isDark, setIsDark] = useState(false);        // Dark mode toggle
const [activeSection, setActiveSection] = useState(); // Current section

// Refs for smooth scrolling
const ordersRef = useRef<HTMLDivElement>(null);     // Reference to Orders section
// ... other refs

// Scroll to section on navigation click
const scrollToSection = (section) => {
  refs[section].current?.scrollIntoView({ behavior: 'smooth' });
};
```

**Why This Approach?**:
- Single-page app (no page reloads)
- Smooth scrolling for better UX
- Persistent theme across sections
- Each section is self-contained component

### 2. Orders Section (`app/components/OrdersSection.tsx`)

**Data Structure**:
```typescript
interface Order {
  id: string;          // Unique identifier (timestamp)
  date: string;        // Format: ddmmyy (e.g., "270126")
  item: string;        // Order item name
  status: 'New' | 'Confirmed' | 'Delivered' | 'Cancelled';
  price: number;       // Price in Naira
}
```

**Key Functions**:

```typescript
// Format date as ddmmyy
const formatDate = (date: Date): string => {
  // 27/01/26 → 270126
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

// Calculate daily revenue (only "Delivered" orders)
const calculateDailyRevenue = () => {
  const today = formatDate(new Date());
  return orders
    .filter(o => o.date === today && o.status === 'Delivered')
    .reduce((sum, o) => sum + o.price, 0);
};

// Calculate weekly revenue (last 7 days)
const calculateWeeklyRevenue = () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  // Filter orders in date range
  return orders
    .filter(o => o.date >= weekAgoStr && o.date <= todayStr && o.status === 'Delivered')
    .reduce((sum, o) => sum + o.price, 0);
};
```

**Auto-save Logic**:
```typescript
// Load from localStorage on mount
useEffect(() => {
  const savedOrders = localStorage.getItem('orders');
  if (savedOrders) {
    setOrders(JSON.parse(savedOrders));
  }
}, []);

// Save to localStorage whenever orders change
useEffect(() => {
  if (orders.length > 0) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}, [orders]);
```

**Why This Works**:
- No backend needed - all data is local
- Instant updates (no API calls)
- Survives browser refresh
- Works completely offline

### 3. Daily Status Section (`app/components/DailyStatusSection.tsx`)

**Data Structure**:
```typescript
interface DayStatus {
  date: string;              // Format: YYYY-MM-DD
  checked: boolean;          // User marked this day
  broadcastAllowed: boolean; // Can broadcast after this day?
  daysSinceLastBroadcast: number; // Counter for 5-day rule
}
```

**5-Day Broadcast Rule Logic**:
```typescript
const calculateBroadcastAllowance = (statusArray: DayStatus[]) => {
  let daysSinceLastCheck = 0;
  
  statusArray.forEach((day, index) => {
    if (day.checked) {
      daysSinceLastCheck++;
      
      // Allow broadcast every 5 days
      if (daysSinceLastCheck >= 5) {
        day.broadcastAllowed = true;
        daysSinceLastCheck = 0; // Reset counter
      } else {
        day.broadcastAllowed = false;
      }
    }
  });
};
```

**Example Flow**:
1. User checks Day 1 → daysSinceLastCheck = 1
2. User checks Day 2 → daysSinceLastCheck = 2
3. User checks Day 3 → daysSinceLastCheck = 3
4. User checks Day 4 → daysSinceLastCheck = 4
5. User checks Day 5 → daysSinceLastCheck = 5 → **Broadcast unlocked!** → Reset to 0

**Color Coding Logic**:
```typescript
const getDayColor = (day: DayStatus, isPast: boolean) => {
  const today = new Date().toISOString().split('T')[0];
  
  if (day.date > today) {
    // Future - gray (not yet available)
    return 'bg-gray-100 border-gray-300';
  }
  
  if (day.checked) {
    // Completed - green
    return 'bg-green-100 border-green-500';
  } else if (day.date < today) {
    // Missed - yellow/red warning
    return 'bg-yellow-100 border-yellow-500';
  }
  
  // Today - default
  return 'bg-white border-gray-300';
};
```

### 4. Broadcasts Section (`app/components/BroadcastsSection.tsx`)

**Integration with Daily Status**:
```typescript
useEffect(() => {
  // Load daily status to check if broadcast is allowed
  const savedDailyStatus = localStorage.getItem('dailyStatus');
  
  if (savedDailyStatus) {
    const dailyStatus = JSON.parse(savedDailyStatus);
    const today = new Date().toISOString().split('T')[0];
    
    // Find today and check if broadcastAllowed flag is true
    const todayStatus = dailyStatus.find((d: any) => d.date === today);
    
    if (todayStatus && todayStatus.broadcastAllowed) {
      setCanBroadcast(true); // Enable broadcast button
    }
  }
}, []);
```

**Why This Approach?**:
- Cross-component communication via localStorage
- No need for complex state management (Redux, Context)
- Simple and reliable for small app
- Clear dependency: Broadcasts depend on Daily Status

### 5. Shortcut Templates (`app/components/ShortcutTemplatesSection.tsx`)

**Copy to Clipboard Logic**:
```typescript
const copyToWhatsApp = async (template: Template) => {
  try {
    // Modern clipboard API
    await navigator.clipboard.writeText(template.message);
    
    // Show success feedback for 2 seconds
    setCopied(template.id);
    setTimeout(() => setCopied(null), 2000);
    
    // Optional: Auto-open WhatsApp Web
    // const encodedMessage = encodeURIComponent(template.message);
    // window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    
  } catch (err) {
    alert('Failed to copy. Please try again.');
  }
};
```

**Template Structure**:
```typescript
const templates: Template[] = [
  {
    id: '1',
    title: 'New Order Confirmation',  // Display name
    icon: '✅',                        // Visual identifier
    message: `Hello! 👋...`           // Actual message
  },
  // ... more templates
];
```

**Customization Tips**:
- Add placeholders like [ITEM], [PRICE] for users to replace
- Keep messages short and mobile-friendly
- Use emojis for visual appeal
- Test on actual WhatsApp before deploying

## PWA Architecture

### Service Worker (`public/sw.js`)

**Cache-First Strategy**:
```javascript
// Intercept all fetch requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // 1. Check cache first
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Return cached version
        }
        
        // 2. If not in cache, fetch from network
        return fetch(event.request).then((response) => {
          // 3. Cache the new response for next time
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
          
          return response;
        });
      })
  );
});
```

**Why Cache-First?**:
- App loads instantly (even offline)
- No waiting for network
- Perfect for static content
- Updates happen in background

### Manifest (`public/manifest.json`)

**Key Properties**:
```json
{
  "name": "Business Tracker - SME App",    // Full name
  "short_name": "BizTracker",              // Home screen name
  "start_url": "/",                        // Where to start
  "display": "standalone",                 // Hide browser UI
  "background_color": "#081F44",           // Splash screen color
  "theme_color": "#081F44",                // Status bar color
  "orientation": "portrait",               // Lock to portrait
  "icons": [...]                           // App icons
}
```

**Why These Settings?**:
- `standalone`: Looks like native app (no browser chrome)
- `portrait`: Better for business data entry
- `#081F44`: Professional blue color
- Icons: Required for install prompt

## Styling Architecture

### Tailwind CSS Approach

**Mobile-First Breakpoints**:
```css
/* Default styles apply to mobile */
<div className="p-4 text-lg">
  
/* Apply to tablets and up */
<div className="p-4 text-lg sm:p-6 sm:text-xl">

/* Apply to desktop and up */
<div className="p-4 text-lg sm:p-6 md:p-8 md:text-2xl">
```

**Component Example**:
```tsx
<button
  className={`
    w-full                    // Full width on mobile
    bg-[#081F44]             // Custom color
    text-white               // White text
    text-xl                  // Large text (18px)
    font-bold                // Bold weight
    py-5                     // Vertical padding (20px)
    rounded-lg               // Rounded corners
    shadow-lg                // Drop shadow
    active:scale-95          // Shrink on tap (feedback)
    transition-transform     // Smooth animation
  `}
>
  + Quick Add Order
</button>
```

**Why This Works**:
- Mobile-first by default
- Easy to customize
- No separate CSS files needed
- IntelliSense support in VS Code

### Custom Global Styles (`app/globals.css`)

**Touch Optimizations**:
```css
/* Large touch targets */
button, a, input, select, textarea {
  min-height: 44px;              /* iOS recommended */
  touch-action: manipulation;    /* Disable double-tap zoom */
}

/* Prevent iOS zoom on input focus */
input, select, textarea {
  font-size: 16px;               /* Minimum to prevent zoom */
}

/* Remove number input spinners (cleaner mobile UI) */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
```

## Data Flow

### Complete Flow Example: Adding an Order

1. **User taps "+ Quick Add Order"**
   ```tsx
   setIsAddingOrder(true)  // Show form
   ```

2. **User enters item and price**
   ```tsx
   <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
   <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
   ```

3. **User taps "Add Order"**
   ```tsx
   const order: Order = {
     id: Date.now().toString(),          // Unique ID
     date: formatDate(new Date()),       // Auto-filled
     item: newItem.trim(),               // User input
     status: 'New',                      // Default
     price: parseFloat(newPrice)         // User input
   };
   
   setOrders([order, ...orders]);       // Add to state (prepend)
   ```

4. **Auto-save triggers**
   ```tsx
   useEffect(() => {
     localStorage.setItem('orders', JSON.stringify(orders));
   }, [orders]);  // Runs when orders change
   ```

5. **UI updates automatically**
   ```tsx
   {orders.map(order => (
     <div key={order.id}>...</div>
   ))}
   ```

6. **Totals recalculate**
   ```tsx
   const dailyRevenue = calculateDailyRevenue();    // Re-runs
   const weeklyRevenue = calculateWeeklyRevenue();  // Re-runs
   ```

### State Management Philosophy

**Why No Redux/Context?**
- Small app (4 sections)
- No complex shared state
- localStorage provides persistence
- Each component manages own state
- Cross-component: read from localStorage

**When to Add State Management?**
- Multiple users/accounts
- Real-time sync across devices
- Complex business logic
- Server-side data
- More than 10 interconnected components

## Performance Optimizations

### 1. **No API Calls**
```typescript
// ❌ Slow (network request)
const orders = await fetch('/api/orders').then(r => r.json());

// ✅ Fast (instant)
const orders = JSON.parse(localStorage.getItem('orders') || '[]');
```

### 2. **Lazy Loading** (Built-in Next.js)
```typescript
// Only loads components when needed
import dynamic from 'next/dynamic';

const OrdersSection = dynamic(() => import('./components/OrdersSection'));
```

### 3. **Memoization** (If needed)
```typescript
import { useMemo } from 'react';

// Only recalculates when orders change
const totalRevenue = useMemo(() => {
  return orders.reduce((sum, o) => sum + o.price, 0);
}, [orders]);
```

### 4. **Virtual Scrolling** (For large lists)
```typescript
// Not needed now, but if you have 1000+ orders:
import { FixedSizeList } from 'react-window';
```

## Security Considerations

### Current Security:
- ✅ No user authentication (local only)
- ✅ No server-side code (no backend vulnerabilities)
- ✅ Data stored locally (user's device)
- ✅ HTTPS required for PWA install

### If Adding Backend:
- 🔐 Add authentication (JWT, OAuth)
- 🔐 Validate all inputs server-side
- 🔐 Use HTTPS everywhere
- 🔐 Sanitize user data (XSS prevention)
- 🔐 Rate limiting on APIs

## Testing Recommendations

### Manual Testing Checklist:
- [ ] Add order → Check localStorage → Reload page → Order persists
- [ ] Mark 5 days → Broadcast unlocks
- [ ] Copy template → Paste in notes app → Verify text
- [ ] Toggle dark mode → Reload → Preference saved
- [ ] Disconnect WiFi → App still works
- [ ] Change order status → Revenue updates
- [ ] Tap all navigation buttons → Smooth scrolling works

### Automated Testing (Future):
```bash
# Unit tests (Jest)
npm test

# E2E tests (Playwright)
npx playwright test

# Accessibility (axe)
npm run a11y
```

## Deployment Guide

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Option 2: Netlify
```bash
npm run build
# Drag 'out' folder to Netlify

### Option 3: Self-hosted
```bash
npm run build
npm start
# Use nginx/apache as reverse proxy
```

## Troubleshooting

### Issue: Orders not saving
**Cause**: localStorage disabled or full
**Fix**: 
```javascript
// Check if localStorage available
if (typeof window !== 'undefined' && window.localStorage) {
  // Save here
}
```

### Issue: Service Worker not updating
**Cause**: Aggressive caching
**Fix**:
```javascript
// In sw.js, increment version
const CACHE_NAME = 'business-tracker-v2';
```

### Issue: Dark mode not persisting
**Cause**: localStorage not checked on mount
**Fix**: Already implemented in `page.tsx`

## Future Enhancements

### Phase 2 Ideas:
1. **Export Data**
   ```typescript
   const exportToCSV = () => {
     const csv = orders.map(o => `${o.date},${o.item},${o.price}`).join('\n');
     download(csv, 'orders.csv');
   };
   ```

2. **Multiple Businesses**
   ```typescript
   const [currentBusiness, setCurrentBusiness] = useState('business1');
   const orders = JSON.parse(localStorage.getItem(`orders-${currentBusiness}`));
   ```

3. **Cloud Sync**
   ```typescript
   // Sync to Firebase/Supabase
   const syncToCloud = async () => {
     await fetch('/api/sync', {
       method: 'POST',
       body: JSON.stringify(orders)
     });
   };
   ```

## Code Quality

### TypeScript Benefits:
- ✅ Catch errors before runtime
- ✅ IntelliSense in IDE
- ✅ Self-documenting code
- ✅ Refactoring confidence

### Best Practices Used:
- ✅ Component composition
- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ Clear naming conventions
- ✅ Inline comments for complex logic
- ✅ Mobile-first responsive design

---

## Summary

This architecture provides:
- **Simplicity**: Easy to understand and modify
- **Performance**: Instant interactions, offline support
- **Maintainability**: Clear structure, well-commented
- **Scalability**: Can grow with business needs
- **Accessibility**: Optimized for 60+ users

Perfect for Nigerian SME owners who need a **reliable, offline-first business tracker** without complexity!
