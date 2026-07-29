# Inventory Management System

A modern, responsive inventory management dashboard built with Next.js and Tailwind CSS. Track stock levels, monitor low-stock alerts, visualize stock movement, and manage products from a clean, unified interface.

## Features

- **Dashboard Overview** — At-a-glance stats for total products, low stock items, inventory value, and categories, each with trend indicators.
- **Stock Movement Chart** — Interactive area chart (Recharts) showing stock in/out over 7, 30, or 90 day ranges.
- **Low Stock Alerts** — Real-time list of items below their reorder threshold, with quick "mark as restocked" actions.
- **Recent Activity Feed** — Table of the latest stock movements (in/out/adjustments) with timestamps.
- **Add Product Modal** — Quick-add form for new inventory items that immediately reflects in the activity feed.
- **Fully Responsive** — Mobile-first layout that scales from single-column on phones to a multi-column grid on desktop.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` custom properties) |
| Charts | Recharts |
| Icons | lucide-react |
| Fonts | Geist Sans / Geist Mono |

## Design System

Colors are defined once as CSS custom properties in `globals.css` and consumed as Tailwind utility classes throughout the app — no hardcoded hex values in components.

```css
@theme {
  --color-primary: #f97316;
  --color-primary-dark: #ea580c;
  --color-bg: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-text: #171717;
  --color-text-muted: #6b7280;

  --radius-card: 0.75rem;
  --spacing-section: 6rem;
}
```

| Token | Utility class | Usage |
|---|---|---|
| `--color-primary` | `bg-primary` / `text-primary` | Primary actions, active states |
| `--color-primary-dark` | `bg-primary-dark` | Hover states |
| `--color-bg` | `bg-bg` | Page background |
| `--color-surface` | `bg-surface` | Card / panel background |
| `--color-border` | `border-border` | Dividers, card borders |
| `--color-text` | `text-text` | Primary text |
| `--color-text-muted` | `text-text-muted` | Secondary/muted text |
| `--radius-card` | `rounded-card` | Card corner radius |

> **Note:** Semantic status colors (success/warning/danger) aren't yet defined as custom tokens — the UI currently falls back to standard Tailwind `emerald`/`red` for stock-in/stock-out states. Consider adding `--color-success`, `--color-warning`, and `--color-danger` to the theme for full consistency.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone <your-repo-url>
cd inventory-management
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard overview page
│   ├── globals.css         # Tailwind + custom color theme
│   └── layout.tsx
├── components/              # Shared UI components
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Roadmap

- [ ] Product list page (searchable, filterable, sortable table)
- [ ] Add/Edit product form as a dedicated page
- [ ] Category management
- [ ] Sidebar + top navigation shell
- [ ] Order/purchase tracking
- [ ] User authentication & roles
- [ ] Semantic color tokens (`success` / `warning` / `danger`)
- [ ] Real backend integration (replace mock data)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

## License

This project is licensed under the MIT License.