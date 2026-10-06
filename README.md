# ALTITUDE

**GEAR FOR A HIGHER JOURNEY**

ALTITUDE is a premium outdoor and adventure gear e-commerce website designed for people who
love hiking, camping, traveling, and exploring.

The website provides a complete simulated shopping experience, from discovering outdoor
products and selecting variants to cart management, checkout, shipping selection, simulated
payment, order confirmation, and delivery tracking.

The project focuses on premium visual design, responsive user experience, functional e-commerce
interactions, and a cinematic outdoor brand identity.

## Tech stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js (App Router)                    |
| Language       | TypeScript                              |
| Styling        | Tailwind CSS                            |
| State          | Zustand                                 |
| Persistence    | LocalStorage (no backend, no database)  |
| Hosting        | Vercel                                  |
| Repository     | GitHub                                  |

All data is local mock data — no backend, no database, no real payment gateway, no real
courier or shipment connection.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run lint    # eslint
npx tsc --noEmit
npm run build   # production build
npm run start   # serve the production build
```

## Project structure

```
app/            App Router routes, root layout, global styles and design tokens
components/     Reusable UI (layout, product, checkout)
data/           Mock catalog, shipping options, payment methods, brand constants
lib/            Formatting, catalog logic, storage and order helpers
store/          Zustand stores (cart, wishlist)
types/          Product, cart and order types
public/images/  Local imagery (editorial photography + product plates)
```

## Design system

| Token            | Value     | Usage                     |
| ---------------- | --------- | ------------------------- |
| Charcoal         | `#111111` | Dark surfaces, primary CTA |
| Off White        | `#F5F4F0` | Page background            |
| Warm Bronze      | `#B88A4A` | Accent, eyebrow labels     |
| Ink              | `#171717` | Primary text               |
| Muted            | `#666666` | Secondary text             |

Headings use **Space Grotesk**, body copy uses **Inter**, and technical data
(order IDs, stock, tracking) uses **JetBrains Mono**.

## Notes

- Payment is simulated. The site never asks for card numbers, CVV, PIN, OTP or bank credentials.
- Order tracking is a demo timeline, not live courier data.
- Cart, wishlist and orders persist in `localStorage`.
