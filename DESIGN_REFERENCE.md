# 🎨 Design Reference - Business Tracker

## Color Palette

### Primary Colors
```
Primary Dark:   #081F44  rgb(8, 31, 68)   - Headers, buttons, branding
Primary Light:  #0a2857  rgb(10, 40, 87)  - Secondary elements, hover states
```

### Status Colors
```
Success Green:  #10b981  - Delivered orders, completed days, success messages
Warning Yellow: #f59e0b  - Skipped days, pending actions, warnings
Error Red:      #ef4444  - Cancelled orders, errors, important alerts
Info Blue:      #3b82f6  - Information, today indicator, broadcast availability
```

### Neutral Colors (Light Mode)
```
Background:     #f9fafb  - Page background
White:          #ffffff  - Card backgrounds
Gray 100:       #f3f4f6  - Subtle backgrounds
Gray 200:       #e5e7eb  - Borders, dividers
Gray 300:       #d1d5db  - Disabled states
Gray 600:       #4b5563  - Secondary text
Gray 900:       #111827  - Primary text
```

### Neutral Colors (Dark Mode)
```
Background:     #111827  - Page background
Gray 900:       #111827  - Card backgrounds (dark)
Gray 800:       #1f2937  - Elevated backgrounds
Gray 700:       #374151  - Secondary backgrounds
Gray 600:       #4b5563  - Borders in dark mode
Gray 400:       #9ca3af  - Secondary text (dark)
White:          #ffffff  - Primary text (dark)
```

## Typography

### Font Sizes
```
text-sm:   14px  - Captions, helper text, metadata
text-base: 16px  - Body text, input fields (minimum for mobile)
text-lg:   18px  - Emphasized text, large inputs
text-xl:   20px  - Card titles, button text
text-2xl:  24px  - Section headers
text-3xl:  30px  - Page titles
```

### Font Weights
```
font-normal:    400  - Body text
font-semibold:  600  - Emphasized text
font-bold:      700  - Headers, buttons, important info
```

### Line Heights
```
leading-tight:   1.25  - Headers
leading-normal:  1.5   - Body text
leading-relaxed: 1.625 - Instructions, longer text
```

## Spacing Scale

### Padding/Margin
```
p-2:  0.5rem  (8px)   - Tight spacing
p-3:  0.75rem (12px)  - Compact spacing
p-4:  1rem    (16px)  - Default spacing ✅ Most common
p-5:  1.25rem (20px)  - Comfortable spacing
p-6:  1.5rem  (24px)  - Generous spacing
p-8:  2rem    (32px)  - Large spacing
```

### Gaps
```
gap-2: 0.5rem  (8px)   - Tight gaps
gap-3: 0.75rem (12px)  - Default gaps ✅ Most common
gap-4: 1rem    (16px)  - Comfortable gaps
gap-6: 1.5rem  (24px)  - Large gaps
```

## Border Radius

```
rounded:     4px   - Subtle rounding
rounded-lg:  8px   - Default ✅ Most common
rounded-xl:  12px  - Soft rounding
rounded-2xl: 16px  - Very soft
rounded-full: 9999px - Pills, circles
```

## Component Patterns

### Button (Primary)
```css
Classes: w-full bg-[#081F44] text-white text-xl font-bold py-5 rounded-lg 
         shadow-lg active:scale-95 transition-transform

Width: Full width (mobile-first)
Background: Primary blue
Text: White, extra large (20px), bold
Padding: 20px vertical
Border: Rounded large (8px)
Effect: Shadow + scale on tap
```

### Button (Secondary)
```css
Classes: py-4 px-6 bg-gray-200 text-gray-700 text-lg font-bold rounded-lg
         hover:bg-gray-300 transition-colors

Background: Light gray
Text: Dark gray, large (18px), bold
Padding: 16px vertical, 24px horizontal
Effect: Darken on hover
```

### Input Field
```css
Classes: w-full p-4 text-lg rounded-lg border-2 border-gray-300
         focus:border-[#081F44] focus:outline-none

Width: Full width
Padding: 16px all sides
Text: Large (18px) - prevents iOS zoom
Border: 2px solid gray, blue on focus
```

### Card
```css
Classes: p-4 rounded-lg border-2 border-gray-200 bg-white shadow-sm

Padding: 16px all sides
Border: 2px solid, rounded
Background: White
Effect: Subtle shadow
```

### Status Badge (Success)
```css
Classes: bg-green-100 border-2 border-green-500 text-green-800
         p-3 rounded-lg font-bold

Background: Light green
Border: Green, 2px
Text: Dark green, bold
Padding: 12px all sides
```

### Navigation Button (Active)
```css
Classes: bg-[#081F44] text-white shadow-lg py-4 px-4 text-base 
         font-bold rounded-lg min-w-[120px]

Background: Primary blue
Text: White, 16px, bold
Padding: 16px vertical, 16px horizontal
Min width: 120px
Effect: Shadow
```

### Navigation Button (Inactive)
```css
Classes: bg-gray-100 text-gray-700 hover:bg-gray-200 py-4 px-4 
         text-base font-bold rounded-lg min-w-[120px]

Background: Light gray
Text: Dark gray
Hover: Slightly darker
Same padding as active
```

## Section Layouts

### Orders Section
```
┌─────────────────────────────────────┐
│ 📊 Orders (sticky)                  │
├─────────────────────────────────────┤
│ ┌─────────────┬─────────────────┐  │
│ │ Today's     │ Weekly Revenue  │  │
│ │ Revenue     │                 │  │
│ │ ₦50,000     │ ₦350,000        │  │
│ └─────────────┴─────────────────┘  │
│                                     │
│ Weekly Progress: 5 of 7 completed   │
│ [████████░░░░░░░░░░░░] 71%         │
│                                     │
│ [+ Quick Add Order]                 │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 270126        ₦5,000            │ │
│ │ Rice                            │ │
│ │ [📦 New ▼]                      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 260126        ₦12,000           │ │
│ │ Cooking Oil                     │ │
│ │ [🎉 Delivered ▼]  (Green bg)   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Daily Status Section
```
┌─────────────────────────────────────┐
│ ✅ Daily Status (sticky)            │
├─────────────────────────────────────┤
│ 📝 Instructions:                    │
│ ✅ Tick each day when you post...   │
│ 📢 Broadcasts only every 5 days     │
├─────────────────────────────────────┤
│ This Week: 3 of 7 days completed    │
│ [██████░░░░░░░░░░░░░░░░] 43%       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Monday           ✅              │ │
│ │ Day 27 (Today)                  │ │
│ │ [☑] Status Posted ✅             │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Sunday           ⚠️              │ │
│ │ Day 26                          │ │
│ │ [☐] Mark as Posted               │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Broadcasts Section
```
┌─────────────────────────────────────┐
│ 📢 Broadcasts (sticky)              │
├─────────────────────────────────────┤
│ 📢 Instructions:                    │
│ You can only broadcast once every   │
│ 5 days. Complete your daily status  │
├─────────────────────────────────────┤
│ [✅ Mark Broadcast as Done]         │
│    (Green button if unlocked)       │
│                                     │
│ OR                                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔒 Broadcast not available yet  │ │
│ │ Complete 5 days to unlock       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Broadcast History                   │
│ ┌─────────────────────────────────┐ │
│ │ 📢 Broadcast Sent       ✅      │ │
│ │ Monday, January 20, 2026        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Templates Section
```
┌─────────────────────────────────────┐
│ 💬 Shortcut Templates (sticky)      │
├─────────────────────────────────────┤
│ 💬 Instructions:                    │
│ Tap any template to copy it.        │
│ Then paste into WhatsApp!           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ✅ New Order Confirmation       │ │
│ ├─────────────────────────────────┤ │
│ │ Hello! 👋                        │ │
│ │                                 │ │
│ │ Thank you for your order!       │ │
│ │ ...                             │ │
│ │                                 │ │
│ │ [📋 Copy to WhatsApp]           │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🚚 Order Ready for Delivery     │ │
│ ├─────────────────────────────────┤ │
│ │ Good day! 🌟                     │ │
│ │ ...                             │ │
│ │ [📋 Copy to WhatsApp]           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Header Layout
```
┌─────────────────────────────────────┐
│ 📊 Business Tracker         🌙     │ ← Title + Theme toggle
├─────────────────────────────────────┤
│ [📦 Orders] [✅ Daily] [📢 Broad]  │ ← Navigation buttons
│             [💬 Templates]          │   (horizontal scroll)
└─────────────────────────────────────┘
```

## Touch Targets

### Minimum Sizes
```
Buttons:      44px × 44px (iOS minimum)
Checkboxes:   32px × 32px (enlarged from default)
Inputs:       44px height minimum
Dropdowns:    56px height (extra large)
Nav buttons:  56px height
```

### Tap Spacing
```
Between buttons:     12px minimum
Around inputs:       16px padding
Card spacing:        12px gap
Section spacing:     32px gap
```

## Responsive Breakpoints

### Mobile (Default)
```css
/* All base styles apply here */
p-4        /* 16px padding */
text-lg    /* 18px text */
gap-3      /* 12px gap */
```

### Tablet (640px+) - Not heavily used
```css
sm:p-6     /* 24px padding */
sm:text-xl /* 20px text */
sm:gap-4   /* 16px gap */
```

### Desktop (768px+) - Rare
```css
md:max-w-2xl  /* Constrain width */
md:mx-auto    /* Center on screen */
```

## Animation Patterns

### Button Press
```css
active:scale-95        /* Shrink 5% */
transition-transform   /* Smooth animation */
duration-100          /* 100ms fast feedback */
```

### Hover (Desktop)
```css
hover:bg-gray-200     /* Lighten background */
transition-colors     /* Smooth color change */
duration-200         /* 200ms standard */
```

### Scroll
```css
scroll-behavior: smooth  /* Smooth section navigation */
```

### Loading States (Future)
```css
animate-pulse         /* Skeleton loading */
animate-spin         /* Loading spinner */
```

## Accessibility Features

### Focus States
```css
focus:ring-4                /* 4px focus ring */
focus:ring-blue-400        /* Blue ring color */
focus:outline-none         /* Remove default outline */
```

### Contrast Ratios
```
Text on White:     4.5:1  (WCAG AA)
Text on Blue:      7:1    (WCAG AAA)
Green on White:    4.5:1  (WCAG AA)
```

### Screen Reader Support
```html
<button aria-label="Toggle theme">🌙</button>
<section aria-labelledby="orders-heading">
  <h2 id="orders-heading">Orders</h2>
</section>
```

## Dark Mode Adjustments

### Background Hierarchy
```
Level 0 (deepest):  #111827  - Page background
Level 1 (cards):    #1f2937  - Card backgrounds
Level 2 (inputs):   #374151  - Form controls
```

### Text Adjustments
```
Primary:   #ffffff  - Headers, important text
Secondary: #d1d5db  - Body text
Tertiary:  #9ca3af  - Helper text, captions
```

### Border Adjustments
```
All borders 30% lighter in dark mode
Gray 300 → Gray 600
Blue 500 → Blue 400
```

## Icon Usage

### Emoji Icons (Universal)
```
📦 - Orders, packages
✅ - Completed, confirmed
📢 - Broadcasts, announcements
💬 - Messages, templates
🚚 - Delivery
💰 - Money, payments
🎉 - Success, celebration
⚠️ - Warning
❌ - Error, cancelled
🔒 - Locked, restricted
☀️ - Light mode
🌙 - Dark mode
📊 - Analytics, business
🔥 - Popular, hot
🙏 - Thank you
```

### When to Use Icons
- Navigation: Always with text label
- Status: To reinforce state
- Actions: On buttons for clarity
- Empty states: To add personality

## Print Styles (Future)
```css
@media print {
  .no-print { display: none; }  /* Hide nav, buttons */
  body { color: black; }         /* Force black text */
  .bg-* { background: white; }   /* Remove backgrounds */
}
```

---

## Quick Copy Patterns

### Primary Button
```tsx
<button className="w-full bg-[#081F44] text-white text-xl font-bold py-5 rounded-lg shadow-lg active:scale-95 transition-transform">
  Click Me
</button>
```

### Input with Icon
```tsx
<div className="relative">
  <span className="absolute left-4 top-4 text-lg font-bold">₦</span>
  <input 
    type="number"
    className="w-full p-4 pl-10 text-lg rounded-lg border-2 border-gray-300 focus:border-[#081F44] focus:outline-none"
    placeholder="Price"
  />
</div>
```

### Success Card
```tsx
<div className="p-4 rounded-lg border-2 border-green-500 bg-green-100">
  <p className="text-green-800 font-bold">Success message here!</p>
</div>
```

### Progress Bar
```tsx
<div className="w-full bg-gray-300 rounded-full h-4">
  <div 
    className="bg-green-500 h-4 rounded-full transition-all"
    style={{ width: '75%' }}
  ></div>
</div>
```

---

**Reference this document when customizing or extending the app!**
