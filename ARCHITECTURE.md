# DuitKu — Architecture

Single-file vanilla JS app, offline-first, localStorage-backed. No build step, no framework, no runtime npm deps (Chart.js via CDN, lazy-loaded).

---

## Module map (single `app.js`, sectioned)

```
┌─ CONSTANTS ───────────────── DEFAULT_CATEGORIES, ACCOUNT_TYPES,
│                              CYCLES, ACCENTS, CURRENCIES, TIMING,
│                              EMOJI_PALETTE, TAG_COLORS, MAIN_TABS
│
├─ STATE & STORAGE ─────────── let state, let ui, _balanceCache (early)
│                              defaultState(), load(), save(),
│                              migrate() — auto-fills missing fields
│
├─ HELPERS ─────────────────── Categories: getCategories, getCategory
│                              Accounts:   getAccounts, accountBalance
│                                          totalBalance (memoized via _balanceCache)
│                              Tags:       getTag, getTags
│                              Insights:   getRecentSuggestions, suggestCategory,
│                                          learnCategoryFromTx, computeStreak,
│                                          computeMonthInsight, effectiveBudget,
│                                          daysSinceLastBackup
│
├─ FORMAT/UTILS ─────────────── money, moneyShort, moneyTiny, isoDate,
│                              fullDate, shortDate, monthYear
│                              el(), $, $$, uid(), hap(kind),
│                              haptic(ms), expenseSign, hexToRgba
│
├─ PICKER FACTORIES ─────────── buildAccountPicker(getCurrent, onChange, opts)
│                              buildAccountTypePicker
│                              buildCategoryPicker(type, getCurrent, onChange)
│                                  → grid with .refresh() for smart-suggest updates
│                              buildSwitch(initial, onChange)
│                              buildTypeSwitch
│                              illustratedEmpty(icon, title, desc)
│                              buildSparkline(accountId, days)
│
├─ TOAST/OVERLAY/FX ─────────── toast(msg, opts) + variants .success/error/warning/info
│                              showSuccess() — checkmark overlay
│                              fireConfetti(count) — CONFETTI_PIECES default 80
│                              countUp(elem, target, opts) — eased number animation
│                              fireMilestone(emoji, text) — streak celebration
│
├─ THEME/NAV ────────────────── applyTheme() — wraps with .theme-transitioning
│                              navigate(view, opts) — slide-left/right based on tab idx
│                              goBack() — pops navStack
│                              setupScrollObserver, setupLongPress, setupTapRipple
│                              setupModalDrag, setupFocusTrap, setupGridKeyboardNav
│                              setupPullToRefreshHint, setupSwipeToDelete,
│                              setupHeroParallax, setupInstallPrompt
│
├─ AUTO BACKGROUND ──────────── runAutoRecurring() — backfill recurring subs
│                              runRecurringGoalContributions() — monthly auto-add
│                              maybeAutoUnpauseSubs() — re-enable past-pause subs
│                              fireUpcomingNotifications() — native Notification API
│                              maybeShowOnboardingTour() — first-time tooltip flow
│
├─ VIEW RENDERERS ──────────── renderDashboard, renderExpense, renderCalendar,
│                              renderSubscription, renderSubCalendar,
│                              renderBudget, renderBudgetTab, renderGoalTab,
│                              renderReports — uses lazy Chart.js
│                                  renderPieChart, renderLineChart,
│                                  renderNetWorthChart, renderDayOfWeekChart,
│                                  renderTopPayees, renderIncomeExpenseRatio,
│                                  renderSubForecast
│                              renderSettings, renderAccounts, renderDebts, renderTags
│                              renderTxRow, renderAccountRow, renderSubRow,
│                              renderBudgetRow, renderGoalRow, renderDebtRow
│                              renderStatsWidget — week heatmap on dashboard
│                              renderAccountFilterRow, renderTagFilterRow, renderQuickFilterRow
│
├─ MODAL FLOWS ──────────────── openExpenseModal, openTransferModal,
│                              openSubModal, openBudgetModal, openGoalModal,
│                              openAccountModal, openDebtModal, openPayDebtModal,
│                              openSplitBillModal, openTagModal, openTagPicker,
│                              openCategoryEditor, openEmojiPicker,
│                              openOptionPicker, openShortcutHelp,
│                              openHealthCheckModal, openTxContextMenu, openSubContextMenu
│                              showModal({ title, body, save }) / hideModal()
│                              openActionSheet, hideActionSheet
│                              openPhotoViewer, closePhotoViewer
│
├─ SAVE/DELETE HANDLERS ─────── saveTx/deleteTx, saveTransfer,
│                              saveSub/deleteSub/advanceSub,
│                              saveBudget/deleteBudget,
│                              saveGoal/deleteGoal,
│                              saveAccount/deleteAccount,
│                              saveDebt/deleteDebt,
│                              bulkDelete (cycle 1)
│
├─ DATA EXPORT/IMPORT ───────── exportJson, exportCsv, downloadFile,
│                              shareBackup (Web Share API),
│                              importJson, importCsv, parseCsv,
│                              seedData, resetAll, runHealthCheck
│
└─ INIT ────────────────────── document.addEventListener('DOMContentLoaded', init)
                               wires all event handlers in one place
```

---

## State Shape

```js
{
  accounts: [
    { id, name, type, initialBalance, includeInTotal, archived, pausedUntil? }
  ],
  expenses: [  // all transactions, including transfers
    { id, type:'expense'|'income'|'transfer', date, category?, name, amount,
      accountId? | fromAccountId+toAccountId, tags:[], receipt?, note, createdAt }
  ],
  subscriptions: [
    { id, name, amount, category, cycle, nextRenewal, reminderDays, active,
      type:'expense'|'income', accountId, tags, autoExecute, endDate, pausedUntil? }
  ],
  budgets: { [categoryId]: monthlyLimit },
  goals: [
    { id, name, target, current, deadline,
      monthlyContribution?, contributionAccountId?, lastContributionAt? }
  ],
  debts: [
    { id, person, type:'i_owe'|'owed_to_me', originalAmount,
      payments: [{ amount, date, accountId }],
      date, dueDate, note }
  ],
  tags: [{ id, name, color }],
  settings: {
    theme:'auto'|'light'|'dark',
    accent:'green'|'blue'|...,
    currency:'IDR'|'USD'|...,
    density:'comfortable'|'compact',
    monthStartDay:1..28,
    showDecimals, haptic, autoExecRecurring,
    budgetRollover,
    notifications, lastNotifCheck,
    customCategories: { expense: [...], income: [...], subscription: [...] },
    categoryLearning: { expense: { [nameLower]: catId }, income: {...} },
    defaultAccountId,
    lastBackupAt,         // ms timestamp
    lastStreakMilestone,  // last celebrated streak number (7/30/100/365)
    tourSeen,             // bool — onboarding tour completed
  },
}
```

---

## Performance

- `accountBalance(account)` memoized via `_balanceCache: Map<accountId, balance>`. Cache built lazily on first call after each `save()` (which invalidates). O(N+M) total per save cycle instead of O(N×M) per render.
- Chart.js lazy-loaded only when Reports view opens (`ensureChartLoaded()`).
- Stats widget hidden when fewer than 3 transactions.
- Sparklines hidden for accounts with <2 transactions.
- Chart instances destroyed before re-creation to avoid memory leaks.

---

## Key UX patterns

**iOS HIG-inspired:**
- Large title navigation with scroll-aware compact mode
- Inset grouped lists (Settings.app style)
- Modal sheets slide up from bottom, grab handle, Cancel/Save header
- Tab bar at bottom with blur background + sliding accent pill indicator
- Cubic-bezier(.32, .72, 0, 1) — Apple's preferred easing for transitions

**Modern interactivity:**
- Long-press tx → context menu (Edit / Duplikat / Pilih beberapa / Hapus)
- Swipe-to-delete on tx rows
- Bulk select mode with floating action bar
- Pull-to-refresh visual hint
- Tap ripple feedback
- Haptic patterns (11 semantic kinds via `hap('save'|'delete'|...)`)
- Toast variants with icons + auto-haptic for errors

**Discovery:**
- Onboarding tour: spotlight + tooltip walk on first-with-data load
- Insight card on dashboard (7 variants: budget warn, cat trend, weekend spike, etc.)
- Streak counter + milestone celebration at 7/30/100/365 days
- Tag autocomplete dropdown while typing
- Quick filter chips (Hari Ini/Minggu/Bulan/Tahun)
- Account filter chips, tag filter chips
- Stats widget (week heatmap) + top category footer

**Accessibility:**
- prefers-reduced-motion respected (disables all animations)
- :focus-visible global styles
- Modal focus trap (Tab cycles within, focus restored on close)
- Picker grids: role=radiogroup, tabindex=0, role=radio, aria-checked, aria-label
- Arrow-key navigation in picker grids
- Skip-to-content link
- Toast aria-live=polite, role=status
- Keyboard shortcuts: ?, g+letter, n, Esc

---

## Build/Deploy

**Web:** Plain static files in `www/`. Open `index.html` in any browser or serve via `python -m http.server 8000 -d www`.

**PWA:** `manifest.json` + `sw.js` (service worker). Browsers offer "Install" prompt; we surface our own banner via `beforeinstallprompt` capture.

**Android APK:** Capacitor 6 wraps the PWA. Run `npm run android:build` → `android/app/build/outputs/apk/debug/app-debug.apk`.

**GitHub Pages auto-deploy:** `.github/workflows/pages.yml` runs on push to main, deploys `www/` to https://cena135.github.io/duitku/.
