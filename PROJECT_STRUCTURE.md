# 📁 Project Structure

## Directory Organization

```
src/
├── pages/              # 🏠 Route-level components (Pages)
│   ├── index.js        # Barrel export for all pages
│   ├── LandingPage.jsx
│   ├── LandingPage.module.css
│   ├── TripSelector.jsx
│   ├── TripSelector.module.css
│   ├── TripView.jsx
│   └── TripView.module.css
│
├── components/         # 🧩 Reusable UI components
│   ├── index.js        # Barrel export for all components
│   ├── Header.jsx
│   ├── Header.module.css
│   ├── TripHero.jsx
│   └── TripHero.module.css
│
├── data/               # 📊 Mock data & constants
│   └── mockTrips.js
│
├── assets/             # 🎨 Static assets (images, icons)
│   └── react.svg
│
├── App.jsx             # 🎯 Root component with Router
├── App.css
├── main.jsx            # ⚡ Entry point
└── index.css           # 🎨 Global styles
```

---

## 🏗️ Architecture Philosophy

### Pages vs Components

#### 📄 **Pages** (`src/pages/`)

**Purpose**: Route-level components that represent entire views/screens

**Characteristics**:

- ✅ Mapped to URL routes (e.g., `/`, `/explore`, `/trip/:cityId`)
- ✅ Use React Router hooks (`useParams`, `useNavigate`, `useLocation`)
- ✅ Orchestrate multiple components
- ✅ Handle page-specific state and data fetching
- ✅ Named after the feature/view (e.g., `LandingPage`, `TripView`)

**Examples**:

```jsx
// LandingPage.jsx - Route: /
export default function LandingPage() {
  const navigate = useNavigate();
  return <div>Welcome to Triply</div>;
}

// TripView.jsx - Route: /trip/:cityId
export default function TripView() {
  const { cityId } = useParams();
  return <div>Trip to {cityId}</div>;
}
```

---

#### 🧩 **Components** (`src/components/`)

**Purpose**: Reusable UI building blocks

**Characteristics**:

- ✅ Presentation-focused (minimal logic)
- ✅ Receive data via props
- ✅ Can be used across multiple pages
- ✅ No direct routing logic
- ✅ Named by UI function (e.g., `Header`, `Button`, `Card`)

**Examples**:

```jsx
// Header.jsx - Used in TripView
export default function Header({ title, onBack }) {
  return <header>{title}</header>;
}

// TripHero.jsx - Used in TripView
export default function TripHero({ trip }) {
  return <div>{trip.city}</div>;
}
```

---

## 📦 Barrel Exports (index.js)

### What Are Barrel Exports?

Centralized export files that simplify imports:

```js
// src/pages/index.js
export { default as LandingPage } from "./LandingPage";
export { default as TripSelector } from "./TripSelector";
export { default as TripView } from "./TripView";
```

### Benefits

#### ❌ **Without Barrel Exports**:

```jsx
import LandingPage from "./pages/LandingPage";
import TripSelector from "./pages/TripSelector";
import TripView from "./pages/TripView";
```

#### ✅ **With Barrel Exports**:

```jsx
import { LandingPage, TripSelector, TripView } from "./pages";
```

**Advantages**:

- 🎯 Single import statement
- 📝 Easier to refactor (change file structure)
- 🧹 Cleaner code
- 🔍 IDE autocomplete works better

---

## 🗂️ File Naming Conventions

### Components & Pages

- **PascalCase**: `LandingPage.jsx`, `TripSelector.jsx`
- **Co-located CSS**: `LandingPage.module.css`
- **One component per file** (except small helpers)

### Styles

- **CSS Modules**: `ComponentName.module.css`
- **Global styles**: `index.css`, `App.css`

### Data

- **camelCase**: `mockTrips.js`, `constants.js`
- **Organized by domain**: `tripData.js`, `userData.js`

---

## 📍 Import Path Strategy

### Absolute vs Relative

#### Current Structure (Relative):

```jsx
// src/pages/TripView.jsx
import { Header, TripHero } from "../components";
import { mockTrips } from "../data/mockTrips";
```

#### Future: Absolute Imports (Optional)

```jsx
// jsconfig.json or tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src"
  }
}

// Now you can import:
import { Header, TripHero } from "components";
import { mockTrips } from "data/mockTrips";
```

---

## 🎯 When to Create New Directories

### ✅ Create New Directory When:

- **Multiple related files** (e.g., `hooks/`, `utils/`)
- **Domain-specific logic** (e.g., `features/trips/`, `features/auth/`)
- **More than 3 files** of the same type

### ❌ Don't Create Directory If:

- Only 1-2 files
- No clear categorization
- Adds unnecessary nesting

---

## 🚀 Scalability Plan

### Phase 1: Current (Hackathon MVP)

```
pages/          (3 files)
components/     (2 files)
data/           (1 file)
```

### Phase 2: Production-Ready

```
pages/
components/
  ├── common/     (Button, Input, Card)
  ├── layout/     (Header, Footer, Sidebar)
  └── trip/       (TripHero, ActivityCard, DayTabs)
data/
hooks/            (useTrip, useAuth)
utils/            (formatDate, calculateDuration)
api/              (tripService, authService)
```

### Phase 3: Enterprise Scale

```
features/
  ├── landing/
  ├── trips/
  │   ├── pages/
  │   ├── components/
  │   ├── hooks/
  │   └── api/
  └── auth/
shared/
  ├── components/
  ├── hooks/
  └── utils/
```

---

## 🔄 Migration Guide

### Moving Component to Page (or vice versa)

#### Example: Move `Button` from `pages/` to `components/`

1. **Move file**:

   ```powershell
   Move-Item src/pages/Button.jsx src/components/Button.jsx
   ```

2. **Update barrel export**:

   ```js
   // src/components/index.js
   export { default as Button } from "./Button";
   ```

3. **Update imports**:

   ```jsx
   // Before
   import Button from "../pages/Button";

   // After
   import { Button } from "../components";
   ```

---

## 📚 Best Practices

### 1. Page Composition

```jsx
// ✅ Good: Page orchestrates components
function TripView() {
  return (
    <div>
      <Header />
      <TripHero />
      <ActivityList />
    </div>
  );
}

// ❌ Bad: Page does too much
function TripView() {
  return <div>{/* 500 lines of JSX */}</div>;
}
```

### 2. Component Reusability

```jsx
// ✅ Good: Generic, reusable
function Card({ title, children }) {
  return (
    <div>
      {title}
      {children}
    </div>
  );
}

// ❌ Bad: Too specific
function LisbonTripCard() {
  return <div>Lisbon Trip</div>;
}
```

### 3. Import Organization

```jsx
// ✅ Good: Grouped by source
// External libraries
import React, { useState } from "react";
import { motion } from "framer-motion";

// Router
import { useNavigate, useParams } from "react-router-dom";

// Internal - Components
import { Header, TripHero } from "../components";

// Internal - Data
import { mockTrips } from "../data/mockTrips";

// Styles
import styles from "./TripView.module.css";
```

---

## 🎨 CSS Modules Strategy

### Co-location Pattern

```
TripView.jsx
TripView.module.css  ← Same directory
```

**Why?**

- 📦 Self-contained feature
- 🔍 Easy to find related files
- ♻️ Easy to delete/move together

### Import Pattern

```jsx
import styles from "./TripView.module.css";

// Usage
<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>;
```

### Generated Class Names

```html
<!-- Input -->
<div className="{styles.container}">
  <!-- Output -->
  <div class="TripView_container__a3b4c"></div>
</div>
```

**Benefits**:

- ✅ No naming conflicts
- ✅ Scoped to component
- ✅ Tree-shakeable (unused styles removed)

---

## 🧪 Testing Structure (Future)

```
src/
├── pages/
│   ├── LandingPage.jsx
│   └── LandingPage.test.jsx    ← Co-located test
├── components/
│   ├── Header.jsx
│   └── Header.test.jsx          ← Co-located test
```

**Pattern**: Test files live next to what they test

---

## 🔍 Quick Reference

### Import Cheatsheet

```jsx
// Pages (in App.jsx)
import { LandingPage, TripView } from "./pages";

// Components (in pages)
import { Header, TripHero } from "../components";

// Data
import { mockTrips } from "../data/mockTrips";

// Styles
import styles from "./Component.module.css";

// Assets
import logo from "../assets/logo.svg";
```

---

## 📖 Summary

| Directory     | Purpose          | Examples              | Routing |
| ------------- | ---------------- | --------------------- | ------- |
| `pages/`      | Full views       | LandingPage, TripView | ✅ Yes  |
| `components/` | Reusable UI      | Header, Button, Card  | ❌ No   |
| `data/`       | Static data      | mockTrips, constants  | ❌ No   |
| `hooks/`      | Custom hooks     | useAuth, useTrip      | ❌ No   |
| `utils/`      | Helper functions | formatDate, API calls | ❌ No   |

---

**Built with ❤️ for Triply**  
_Clean architecture, scalable structure_
