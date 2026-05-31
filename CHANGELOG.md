# DuitKu — Changelog

## Round 7 (2026-06-01)
- Sub context menu: "Lewati Renewal Ini" (skip one renewal cycle)
- Inline category rename helper (`renameCategoryInline`)
- Tag merge tool (Settings → Gabung Tag, picks source + target)
- Weekend vs Weekday breakdown card di Reports (+ ratio)
- Account share helper (`renderAccountSharePieData`)
- Subscription price-change detection (Settings → Perubahan Harga Langganan)
- `findSimilarTxs` helper untuk modal-side suggestions
- Quick-pay debt action (debt context menu → "Bayar Cepat" → amount/account dialog)
- Heart-burst celebration animation (alt to confetti)
- A11y focus order audit helper (`auditFocusOrder`)

## Round 6 (2026-06-01)
- Global undo bar (sticky bottom pill, last 5 destructive actions, undo with one tap)
- Scheduled (future-dated) transactions — `t.scheduled = true` flag, auto-execute when date reached
- Weekly velocity chart (8-week bar, current week highlighted)
- Savings goal forecast helper (`forecastGoalCompletion` — months-to-target from explicit monthlyContribution)
- Category trend card (top growing + shrinking categories MoM with % change)
- Tag autosuggest from name patterns (suggests tags from similar past tx names)
- CSV import preview (validates header before commit, shows 3-row sample)
- Performance baseline measurement (`measurePerformance` — accountBalance/insight/dup/recurring timings)
- Accent pulse animation helper for save buttons
- `deleteTx` now wired into undo stack

## Round 5 (2026-06-01)
- Settings search bar (live filter cells by query)
- Category drilldown modal (helper `openCategoryDrilldown(catId, type)`)
- FAB long-press menu now includes "Dari Template" (when templates exist)
- Per-day budget pace line — vertical marker on progress bar shows where
  you should be by today; "Hemat" badge when ahead of pace
- Yearly summary share button (Web Share API → clipboard fallback,
  formatted as monospace-friendly text)
- Low balance auto-warn (toast on load if any non-credit account < 100k)
- Day-of-week spend prediction (`getTodayDoWInsight`)
- Skeleton loader CSS for chart cards
- CHANGELOG.md kept current

## Round 4 (2026-06-01)
- Goal milestone celebration (25/50/75% → fireMilestone burst)
- Upcoming debt due-date reminder banner (jatuh tempo 7 hari ke depan)
- Yearly summary card di Reports (12-bulan heatmap intensitas)
- Quick amount chips di expense modal (+10k/+25k/+50k/+100k/+200k/+500k/Reset)
- Smart budget recommendation (Settings → Saran Budget, rata-rata 3 bln +10% buffer)
- Spending anomaly toast (auto-warn kalau hari ini >2× rata-rata harian)
- A11y: high-contrast mode toggle + larger-text toggle
- Number row keyboard (1-7 jump to tab)

## Round 3 (2026-06-01)
- Kalender: tombol "+ Tambah transaksi" untuk tanggal yang dipilih
- Auto-kategori dari pola merchant (Gojek/Indomaret/PLN/Spotify/dll)
- Saran langganan dari deteksi pola tx berulang (Settings → Saran Langganan)
- 7-day rolling burn rate card di dashboard
- Cumulative spend overlay (bulan ini vs bulan lalu) di Reports
- Monthly heatmap di dashboard
- Long-press progress visual (filling bar saat hold)
- Drag-to-reorder akun (di view Akun)

## Round 2 (2026-06-01)
- Advanced filter modal (amount range, date range, multi-account, multi-tag) dengan badge counter
- Ctrl+K command palette dengan recent searches + shortcuts (`>amount`, `<amount`, `@account`, `#tag`)
- Bulk operations v2: recategorize, move-account, add-tag, change-date
- Transaction templates (long-press tx → "Simpan sebagai template", picker dengan usage count)
- Top 5 expenses ever card
- Projected month-end balance card
- 6-month savings rate trend chart
- Duplicate transaction detection (Settings → Deteksi Duplikat)
- Backup reminder banner (auto-toast saat >30 hari tanpa backup)

## Round 1 (2026-06-01)
- **Cycle 1** — onboarding tour, bulk select, pull-to-refresh hint, smart category learning
- **Cycle 2** — 4 new Reports charts (day-of-week, top payees, income/expense ratio, sub forecast)
- **Cycle 3** — swipe-to-delete, milestone burst, theme transition, parallax hero
- **Cycle 4** — health check tool, recurring goal contribution, sub pause-until
- **Cycle 5** — ARCHITECTURE.md, JSDoc on key APIs, 58/58 smoke test
