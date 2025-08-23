# Phase 13 Dev Notes

## 1. Admin: Settings (GlobalConfig / Feature Flags / Labels / Min Version)
Baseline already present:
- GlobalConfig table seeds: feature_flags, bank.transfer.settings, vat_percent, counters.
- Feature flags loader: `lib/featureFlags.ts` consumed on home page.
- Labels & min version handled via content + flags (no new code required in this phase).

(Sections 2-9 will be appended in subsequent commits following the required order.)
