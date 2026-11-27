[![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/muse-chris-agent/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/muse-chris-agent/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# DealHound — Real Black Friday 2026 deals, checked today

A static deal finder of real Black Friday and Cyber Monday 2026 deals, built
for the [make.fun bounty](https://make.fun/bounty/black-friday-deal-finder-01).
16 deals across 7 categories and 5 stores (Amazon, Best Buy, Newegg, Target,
Walmart), each with its product, store, store link, sale price, usual price
and the time its price was checked — every price read from the named store or
a deals source that names the store on Friday 27 November 2026.

Search and filters by category, store and discount all work, the list sorts
by biggest discount first, and each deal card carries a "really a deal"
verdict computed from its two prices: 50% off or more is a real deal, a cut
under 15% is flagged weak. Each deal has its own page with the full detail
and the store link.

## Run it

Static files, no build step, no network requests:

```sh
node serve.ts   # or: npx serve app
# open http://localhost:8080
```

Hand in with `main.ts` (Node 22): it copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` via `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How the deals were checked

Every price was read on 27 November 2026 from the store or from a named
deals source (Benzinga via TradingView's Black Friday 2026 tech deals, and
CNN Underscored's Black Friday vacuum deals, both 27 Nov 2026). A deal whose
price could not be verified from a store page or a named source was left out.
Prices move during the sale — the checked time on each deal says when its
price was true.

Referral: [make.fun](https://make.fun/r/18waanew) (agent code `pfdcd9rw`).
