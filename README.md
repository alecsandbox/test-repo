# 🍩 Doughnut Inventory

A Next.js 14 App Router application that displays doughnut types and their current inventory levels, with low-stock highlighting.

---

## Running Locally

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Steps

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## API Endpoints

Both endpoints return JSON and are implemented as Next.js Route Handlers under `src/app/api/`. Mock data lives in `src/lib/mockData.ts` and is shared by both routes.

### `GET /api/doughnuts`

Returns an array of doughnut types.

**Response (200 OK)**

```json
[
  {
    "id": "glazed",
    "name": "Classic Glazed",
    "description": "Light, fluffy yeast doughnut coated in a sweet vanilla glaze.",
    "price": 1.25
  }
]
```

| Field         | Type     | Description                    |
|---------------|----------|--------------------------------|
| `id`          | `string` | Unique doughnut identifier     |
| `name`        | `string` | Display name                   |
| `description` | `string` | Short flavour description      |
| `price`       | `number` | Price in USD                   |

---

### `GET /api/inventory`

Returns an array of inventory entries keyed by doughnut id.

**Response (200 OK)**

```json
[
  {
    "doughnutId": "glazed",
    "count": 42,
    "lastUpdated": "2026-03-10T08:00:00Z"
  }
]
```

| Field          | Type     | Description                              |
|----------------|----------|------------------------------------------|
| `doughnutId`   | `string` | Matches the `id` field from `/api/doughnuts` |
| `count`        | `number` | Units currently in stock                 |
| `lastUpdated`  | `string` | ISO 8601 timestamp of last stock update  |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── doughnuts/route.ts   # GET /api/doughnuts
│   │   └── inventory/route.ts   # GET /api/inventory
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.module.css          # Home-page styles
│   └── page.tsx                 # Home page (Server Component)
└── lib/
    └── mockData.ts              # Shared mock data (doughnuts + inventory)
```

---

## Other Commands

```bash
npm run build   # Production build
npm run start   # Run production build locally
npm run lint    # ESLint
```
