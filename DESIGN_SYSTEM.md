# TwinFlame Design System

> A comprehensive guide to the design language, components, and patterns used in the TwinFlame application.

---

## 🎨 Design Philosophy

TwinFlame uses a **modern, romantic aesthetic** with:
- **Glassmorphism** for depth and elegance
- **Vibrant gradients** for emotional connection
- **Smooth animations** for delightful interactions
- **Dark theme** with purple and pink accents for intimacy

---

## 🌈 Color Palette

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--primary-color` | `#ff4b6e` | Primary actions, CTAs, links |
| `--primary-hover` | `#e63e5e` | Hover states for primary elements |
| `--secondary-color` | `#7928ca` | Secondary accents, highlights |

### Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-gradient` | `linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)` | Main app background |
| `--card-bg` | `rgba(255, 255, 255, 0.05)` | Glass card backgrounds |
| `--card-border` | `rgba(255, 255, 255, 0.1)` | Glass card borders |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#ffffff` | Primary text, headings |
| `--text-secondary` | `#b3b3b3` | Secondary text, descriptions |

### Semantic Colors

| Color | Value | Usage |
|-------|-------|-------|
| Error | `#ff4b4b` | Error messages, validation |
| Success | `#4ade80` | Success messages, confirmations |
| Love Quote | `#ff8fa3` | Romantic text accents |
| Logout | `#ff6b6b` | Destructive actions |

### Gradients

```css
/* Primary Gradient */
linear-gradient(135deg, #ff4b6e 0%, #ff8fa3 100%)

/* Purple Gradient */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Dare Gradient */
linear-gradient(135deg, #ff0844 0%, #ffb199 100%)

/* Truth & Dare Title */
linear-gradient(to right, #7928ca, #ff0080)

/* Logo Gradient */
linear-gradient(to right, #ff4b6e, #ff8fa3)
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 (Game Title) | `3rem` (48px) | 900 | 1.2 | Major page titles |
| H2 (Page Title) | `2rem` (32px) | 800 | 1.2 | Section headers |
| H3 (Feature Title) | `1.4rem` (22.4px) | 700 | 1.2 | Card titles |
| Body Large | `1.2rem` (19.2px) | 400 | 1.6 | Subtitles |
| Body | `1rem` (16px) | 400 | 1.6 | Default text |
| Body Small | `0.9rem` (14.4px) | 400 | 1.6 | Labels, hints |
| Caption | `0.8rem` (12.8px) | 500 | 1.4 | Badges, metadata |

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (links, labels)
- **Semi-Bold**: 600 (buttons, emphasis)
- **Bold**: 700 (headings)
- **Extra Bold**: 800 (major headings)
- **Black**: 900 (hero text)

---

## 📐 Spacing System

### Padding Scale
- **XS**: `0.5rem` (8px)
- **SM**: `0.75rem` (12px)
- **MD**: `1rem` (16px)
- **LG**: `1.5rem` (24px)
- **XL**: `2rem` (32px)
- **2XL**: `2.5rem` (40px)
- **3XL**: `3rem` (48px)

### Margin Scale
Same as padding scale above.

### Gap Scale (Flexbox/Grid)
- **SM**: `1rem` (16px)
- **MD**: `1.5rem` (24px)
- **LG**: `2rem` (32px)

---

## 🔲 Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | `12px` | Buttons, inputs, badges |
| Medium | `16px` | Dropdown menus, code boxes |
| Large | `24px` | Cards, major containers |
| Circle | `50%` | Avatars, circular elements |
| Pill | `20px` | Badges, tags |

---

## 🎭 Shadows & Effects

### Box Shadows

```css
/* Glass Shadow */
--glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

/* Button Shadow */
box-shadow: 0 4px 15px rgba(255, 75, 110, 0.3);

/* Button Hover Shadow */
box-shadow: 0 6px 20px rgba(255, 75, 110, 0.4);

/* Dropdown Shadow */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

/* Choice Card Shadow */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

/* Truth Card Shadow */
box-shadow: 0 10px 30px rgba(118, 75, 162, 0.4);

/* Dare Card Shadow */
box-shadow: 0 10px 30px rgba(255, 8, 68, 0.4);
```

### Glassmorphism Effect

```css
.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
}
```

### Navbar Blur

```css
background: rgba(20, 20, 30, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

---

## 🎬 Animations & Transitions

### Transition Timing
```css
/* Standard */
transition: all 0.3s ease;

/* Fast */
transition: all 0.2s ease;

/* Bouncy */
transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Keyframe Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide Down
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Pop In
```css
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### Spin
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Hover Effects

```css
/* Button Hover */
button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 75, 110, 0.4);
}

/* Card Hover */
.feature-card:hover {
  transform: translateY(-5px);
}

/* Choice Card Hover */
.choice-card:hover {
  transform: translateY(-10px) scale(1.05);
}
```

---

## 🧩 Components

### Button

#### Primary Button
```css
.login-button {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

**States:**
- Default: Primary color with shadow
- Hover: Darker shade, lifted with larger shadow
- Active: Pressed down (translateY(0))
- Disabled: 60% opacity, no pointer

#### Action Button (Secondary)
```css
.action-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
}
```

#### Connect Partner Button
```css
.connect-partner-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff4b6e 0%, #ff8fa3 100%);
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 75, 110, 0.3);
}
```

---

### Input Field

```css
.login-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 4px rgba(255, 75, 110, 0.1);
}
```

**Features:**
- Dark semi-transparent background
- Subtle border that glows on focus
- Focus ring with primary color
- Smooth transitions

---

### Card Components

#### Glass Card (Base)
```css
.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
}
```

#### Login/Signup Card
```css
.login-card {
  padding: 2.5rem;
  max-width: 420px;
  /* + glass-card styles */
}
```

#### Feature Card
```css
.feature-card {
  padding: 2rem;
  min-height: 200px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}
```

#### Connect Partner Card
```css
.connect-card {
  padding: 3rem;
  max-width: 500px;
  text-align: center;
}
```

#### Question Card
```css
.question-card {
  padding: 3rem;
  max-width: 500px;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.question-card.truth {
  border-top: 5px solid #764ba2;
}

.question-card.dare {
  border-top: 5px solid #ff0844;
}
```

---

### Navigation Bar

```css
.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
  background: rgba(20, 20, 30, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(to right, #ff4b6e, #ff8fa3);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Features:**
- Fixed positioning with blur effect
- Gradient logo text
- Profile avatar with fallback
- Animated burger menu
- Dropdown with slide animation

---

### Avatar

```css
.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.profile-avatar-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: uppercase;
}
```

---

### Code Display Box

```css
.code-box {
  background: rgba(0, 0, 0, 0.3);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 16px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.code-box:hover {
  border-color: var(--primary-color);
  background: rgba(0, 0, 0, 0.4);
}
```

---

### Badge

```css
.badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
}
```

---

### Divider

```css
.divider {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 1rem 0 2rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}
```

---

### Choice Cards (Truth/Dare)

```css
.choice-card {
  width: 200px;
  height: 250px;
  border-radius: 24px;
  font-size: 2rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.truth-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(118, 75, 162, 0.4);
}

.dare-card {
  background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);
  box-shadow: 0 10px 30px rgba(255, 8, 68, 0.4);
}
```

---

### Dropdown Menu

```css
.dropdown-menu {
  position: absolute;
  top: 70px;
  right: 2rem;
  background: rgba(30, 30, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease;
}

.dropdown-item {
  padding: 0.875rem 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem 1.5rem;
  }
  
  .dropdown-menu {
    right: 1.5rem;
  }
}
```

### Container Max-Widths
- Dashboard: `1200px`
- Cards: `420px` - `500px`
- Content: `600px` (for quotes)

---

## 🎨 Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

---

## 🔧 Utility Classes

### Text Utilities
```css
.error-text {
  color: #ff4b4b;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.success-text {
  color: #4ade80;
  margin-bottom: 1rem;
  font-weight: 600;
}

.love-quote {
  font-style: italic;
  color: #ff8fa3;
  font-size: 1rem;
  line-height: 1.6;
}
```

### Layout Utilities
```css
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}
```

---

## 📋 Component Patterns

### Form Pattern
1. **Label** (`.login-label`) - Semi-bold, small, primary text
2. **Input** (`.login-input`) - Dark background, focus ring
3. **Error** (`.error-text`) - Red, small, below input
4. **Button** (`.login-button`) - Full width, primary color

### Card Pattern
1. **Container** - Glass effect, rounded corners
2. **Title** - Large, gradient text
3. **Description** - Secondary color, smaller
4. **Content** - Flexible middle section
5. **Action** - Button or link at bottom

### Dashboard Grid
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

---

## 🎯 Best Practices

### Do's ✅
- Use CSS variables for colors
- Apply glassmorphism for depth
- Add smooth transitions (0.3s ease)
- Use gradient text for emphasis
- Implement hover states with lift effect
- Keep border-radius consistent (12px, 16px, 24px)
- Use backdrop-filter for blur effects

### Don'ts ❌
- Don't use hard-coded colors
- Don't skip hover states
- Don't use sharp corners on cards
- Don't forget webkit prefixes for blur
- Don't use transitions longer than 0.4s
- Don't mix different shadow styles

---

## 🚀 Implementation Notes

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Webkit prefixes included for Safari
- Backdrop-filter may need fallback for older browsers

### Performance
- Use `will-change` sparingly for animations
- Backdrop-filter can be GPU-intensive
- Optimize images and use lazy loading
- Keep animations under 0.5s for snappiness

### Accessibility
- Maintain color contrast ratios
- Ensure focus states are visible
- Use semantic HTML
- Add ARIA labels where needed
- Test with keyboard navigation

---

## 📦 File Structure

```
client/src/
├── index.css              # Global styles, CSS variables
├── App.css                # App-level styles
└── components/
    ├── LoginForm.css      # Login page styles
    ├── SignupForm.css     # Signup page styles
    ├── Dashboard.css      # Dashboard styles
    ├── ConnectPartner.css # Partner linking styles
    ├── TruthDare.css      # Game styles
    ├── Navbar.css         # Navigation styles
    └── ProfileSetup.css   # Profile setup styles
```

---

## 🎨 Design Tokens Summary

```css
:root {
  /* Colors */
  --primary-color: #ff4b6e;
  --primary-hover: #e63e5e;
  --secondary-color: #7928ca;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  
  /* Backgrounds */
  --bg-gradient: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  
  /* Effects */
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  /* Typography */
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
  font-weight: 400;
}
```

---

*This design system is a living document and should be updated as the TwinFlame application evolves.*
