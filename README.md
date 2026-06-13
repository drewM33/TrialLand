# TrialLand

A marketplace for **human-verified free trials**. Browse trials from popular AI tools, prove you're a unique human with [World ID](https://docs.world.org/world-id), and claim a non-transferable promo code — **one per human, per trial**. Partners can then redeem those codes without ever seeing the raw code or the human's identity.

> This is a frontend-only demo. The "backend" is simulated in the browser via `localStorage`, and World ID verification is mocked to model the real uniqueness and privacy concepts.

## How it works

1. **Browse** trials on the home page (trending, made-for-you, and by category).
2. **Verify** you're a unique human with a (simulated) World ID proof.
3. **Claim** a unique promo code bound to your per-human, per-trial *nullifier*. Claiming the same trial twice returns your existing code.
4. **Redeem** on the partner side: the partner checks the hashed code, then confirms the same human via World ID before marking it used.

Privacy by design: partners only ever receive the **hash** of the code plus the nullifier and status — never the raw code or the user's identity. See `lib/store.ts` for the simulated model.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- TypeScript, `sonner` for toasts, `@vercel/analytics`

## Getting started

```bash
git clone https://github.com/drewM33/TrialLand.git
cd TrialLand

# install deps (a pnpm-lock.yaml is included)
pnpm install

# run the dev server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

## Project structure

```
app/                  App Router routes
  page.tsx            Home (trial catalog)
  how-it-works/       Explainer page
  trial/[slug]/       Trial detail + claim flow
  partner/[slug]/     Partner redeem flow
  partners/           Partner directory
components/           UI + feature components (incl. components/ui from shadcn)
lib/
  trials.ts           Trial catalog + helpers
  store.ts            Simulated backend (localStorage) + World ID model
  crypto.ts           sha256 helper
public/               Icons and static assets
```

## License

MIT — see [LICENSE](LICENSE).
