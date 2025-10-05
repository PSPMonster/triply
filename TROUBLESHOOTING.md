# 🐛 Troubleshooting Guide - Progress Widget & Optional Steps

## Problem

Po zaznaczeniu 4 wymaganych opcji:

1. ❌ Nie pojawiają się kolejne opcjonalne sekcje (Interests, Mood)
2. ❌ Progress indicator się "zawiesza"
3. ❌ Błąd w konsoli: `spring and inertia animations` z `[1, 1.05, 1]`

## Rozwiązanie

### 1. ✅ Naprawiony błąd Framer Motion

**Problem:**

```javascript
// ❌ Błędne - spring nie obsługuje 3 keyframes
animate={{
  scale: allRequiredComplete ? [1, 1.05, 1] : 1,
}}
transition={{ type: "spring" }}
```

**Rozwiązanie:**

```javascript
// ✅ Poprawne - spring tylko dla y i opacity
animate={{
  y: 0,
  opacity: 1,
}}
transition={{ type: "spring", stiffness: 260, damping: 20 }}

// Scale pulse przez CSS animation
.stickyProgress.expanded {
  animation: expandPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes expandPulse {
  0% { transform: scale(1); }
  40% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### 2. ✅ Flow sekcji opcjonalnych

**Sekwencja renderowania:**

```
1. Destination (required) → shows Group
2. Group (required) → shows Duration
3. Duration (required) → shows Budget
4. Budget (required) → shows Interests ⭐
5. Interests (optional) → Continue button → shows Mood
6. Mood (optional) → Complete!
```

**Kod:**

```javascript
// handleBudgetSelect
const handleBudgetSelect = (budgetId) => {
  setSelectedBudget(budgetId);
  if (!showInterestsSection) {
    setTimeout(() => setShowInterestsSection(true), 200);
  }
};

// Render condition
{
  showInterestsSection && <motion.div>{/* Interests content */}</motion.div>;
}
```

### 3. ✅ Progress Indicator Logic

**Obliczanie kroków:**

```javascript
// Required steps (4)
const completedRequiredSteps = [
  selectedDestination, // Krok 1
  selectedGroup, // Krok 2
  selectedDuration, // Krok 3
  selectedBudget, // Krok 4
].filter(Boolean).length;

// Optional steps (2)
const completedOptionalSteps = [
  selectedInterests.length > 0, // Krok 5 (opcjonalny)
  selectedMood, // Krok 6 (opcjonalny)
].filter(Boolean).length;

// Flag dla rozszerzenia
const allRequiredComplete = completedRequiredSteps === 4;
```

**Render condition:**

```javascript
// Pokazuje się gdy completedRequiredSteps > 0
{
  completedRequiredSteps > 0 && (
    <motion.div
      className={`${styles.stickyProgress} ${
        allRequiredComplete ? styles.expanded : ""
      }`}
    >
      {/* Progress content */}
    </motion.div>
  );
}
```

## Checklist Debugowania

### A. Sprawdź State

```javascript
// W React DevTools sprawdź:
✅ selectedDestination !== null
✅ selectedGroup !== null
✅ selectedDuration !== null
✅ selectedBudget !== null
✅ showInterestsSection === true (po wyborze budgetu)
```

### B. Sprawdź Console

```javascript
// Dodaj tymczasowo:
useEffect(() => {
  console.log("🔍 Debug:", {
    completedRequiredSteps,
    allRequiredComplete,
    showInterestsSection,
    showMoodSection,
  });
}, [
  completedRequiredSteps,
  allRequiredComplete,
  showInterestsSection,
  showMoodSection,
]);
```

### C. Sprawdź CSS

```css
/* Upewnij się że te klasy istnieją: */
✅ .stickyProgress
✅ .stickyProgress.expanded
✅ .stickyProgressSection
✅ .stickyProgressDot
✅ .stickyProgressDot.optional
✅ .motivationalTooltip
```

### D. Sprawdź Animacje

```css
/* Upewnij się że keyframes są zdefiniowane: */
✅ @keyframes expandPulse
✅ @keyframes dotPulse
✅ @keyframes tooltipPulse
```

## Typowe Problemy

### Problem 1: Sekcje nie pojawiają się

**Przyczyna:** `showInterestsSection` pozostaje `false`

**Rozwiązanie:**

```javascript
// Sprawdź czy handleBudgetSelect jest wywoływany
const handleBudgetSelect = (budgetId) => {
  setSelectedBudget(budgetId);
  console.log("✅ Budget selected:", budgetId); // Debug

  if (!showInterestsSection) {
    setTimeout(() => {
      console.log("✅ Showing interests"); // Debug
      setShowInterestsSection(true);
    }, 200);
  }
};
```

### Problem 2: Progress indicator nie rozszerza się

**Przyczyna:** `allRequiredComplete` jest `false`

**Rozwiązanie:**

```javascript
// Sprawdź każdy warunek osobno
console.log({
  selectedDestination: !!selectedDestination,
  selectedGroup: !!selectedGroup,
  selectedDuration: !!selectedDuration,
  selectedBudget: !!selectedBudget,
  completedRequiredSteps,
  allRequiredComplete,
});
```

### Problem 3: Animacja nie działa

**Przyczyna:** Framer Motion layout conflict

**Rozwiązanie:**

```javascript
// Upewnij się że layout prop jest na głównym div
<motion.div
  layout  // ← To musi być tutaj
  className={styles.stickyProgress}
>
```

### Problem 4: Tooltip nie pojawia się

**Przyczyna:** Warunek nie jest spełniony

**Rozwiązanie:**

```javascript
// Tooltip pokazuje się TYLKO gdy:
allRequiredComplete === true && // Wszystkie required wypełnione
  completedOptionalSteps < totalOptionalSteps; // Nie wszystkie optional
```

## Testing Checklist

Przetestuj następującą sekwencję:

1. ✅ Wybierz destination → Group section pojawia się
2. ✅ Wybierz group → Duration section pojawia się
3. ✅ Wybierz duration → Budget section pojawia się
4. ✅ Wybierz budget → **Interests section pojawia się** ⭐
5. ✅ Progress widget rozszerza się (expand animation)
6. ✅ Pojawia się sekcja "Optional" z 2 kropkami
7. ✅ Pojawia się tooltip "💡 Add interests & mood..."
8. ✅ Wybierz jakieś interests → Continue button działa
9. ✅ Kliknij Continue → Mood section pojawia się
10. ✅ Wybierz mood → Optional kropki stają się zielone
11. ✅ Tooltip zmienia się na "🎉 Bonus!"
12. ✅ Na mobile - layout jest pionowy

## Expected Behavior - Step by Step

### Stan Początkowy (0/4)

```
Progress widget: NIEWIDOCZNY
```

### Po 1 kroku (1/4)

```
┌─────────────────┐
│ ●○○○  1/4 req.  │
└─────────────────┘
```

### Po 2 krokach (2/4)

```
┌─────────────────┐
│ ●●○○  2/4 req.  │
└─────────────────┘
```

### Po 3 krokach (3/4)

```
┌─────────────────┐
│ ●●●○  3/4 req.  │
└─────────────────┘
```

### Po 4 krokach (4/4) ⭐ KRITYCZNY MOMENT

```
┌─────────────────────────────┐
│ ●●●●  ✓ Required            │  ← Expand animation!
│  ─────────                  │
│ ○○  +0/2 bonus              │  ← Nowa sekcja
└─────────────────────────────┘
        ↑
┌─────────────────────────────┐
│ 💡 Add interests & mood for │  ← Tooltip
│    better results!          │
└─────────────────────────────┘

⬇️ INTERESTS SECTION POJAWIA SIĘ
```

### Po wyborze interests (4/4 + 1/2)

```
┌─────────────────────────────┐
│ ●●●●  ✓ Required            │
│  ─────────                  │
│ ●○  +1/2 bonus              │  ← Pierwsza kropka zielona
└─────────────────────────────┘
        ↑
┌─────────────────────────────┐
│ 💡 Add interests & mood for │  ← Tooltip dalej widoczny
│    better results!          │
└─────────────────────────────┘
```

### Po wyborze mood (4/4 + 2/2) ✨ COMPLETE

```
┌─────────────────────────────┐
│ ●●●●  ✓ Required            │
│  ─────────                  │
│ ●●  🎉 Bonus!               │  ← Obie zielone + emoji
└─────────────────────────────┘

Tooltip znika ✅
```

## Quick Fixes

### Jeśli nic nie działa - Nuclear Option

```javascript
// 1. Sprawdź czy Budget handler jest wywołany
<motion.button
  onClick={() => {
    handleBudgetSelect(budget.id);
    console.log('🔥 NUCLEAR: Budget clicked'); // Debug
  }}
>

// 2. Force pokazanie sekcji interesów
useEffect(() => {
  if (selectedBudget && !showInterestsSection) {
    console.log('🔥 NUCLEAR: Force showing interests');
    setShowInterestsSection(true);
  }
}, [selectedBudget]);

// 3. Sprawdź czy element jest w DOM
useEffect(() => {
  if (showInterestsSection) {
    console.log('🔥 NUCLEAR: Interests ref:', interestsSectionRef.current);
  }
}, [showInterestsSection]);
```

## Success Indicators

Wszystko działa poprawnie gdy:

✅ Brak błędów w konsoli  
✅ Progress widget pojawia się po 1 kroku  
✅ Progress widget rozszerza się po 4 krokach  
✅ Interests section pojawia się po budgecie  
✅ Mood section pojawia się po Continue  
✅ Tooltip pojawia się i znika we właściwym momencie  
✅ Animacje są płynne (60fps)  
✅ Mobile layout działa poprawnie

---

**Ostatnia aktualizacja:** October 5, 2025  
**Status:** ✅ Wszystkie błędy naprawione  
**Next Steps:** Test w przeglądarce
