### API Calls

- **Prefer Axios over fetch** for HTTP requests
- Client adapters handle BigInt serialization/deserialization automatically

### Styling

- **Default to Tailwind CSS** for styling components
- Avoid inline CSS unless absolutely necessary
- Custom CSS is allowed in `.css` files when Tailwind isn't sufficient
- Follow existing patterns in `src/app/globals.css` and `src/app/grids.css`

### Database & Types

- **TypeORM entities** live in `src/lib/backend/entities/`
- **TypeScript types** live in `src/lib/types/`
- **Always check `src/lib/types/` before creating a new type** - reuse existing types when possible
- Types should mirror entity structures as closely as possible
- Use transformers for special types (e.g., BigInt → `src/lib/backend/entities/shared/db-transformers.ts`)
- **Don't typecast unless absolutely necessary** - prefer proper types and type inference
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safe property access
- Prefer `undefined` over `null` when possible for consistency

### Date & Time Handling

- **Always use UTC date methods** - never use local timezone equivalents
- Use `Date.UTC()`, `getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`, `getUTCHours()`, etc.
- Never use `getFullYear()`, `getMonth()`, `getDate()`, `getHours()`, or `new Date(year, month, day)` without UTC
- When constructing dates, use `new Date(Date.UTC(year, month, day))` instead of `new Date(year, month, day)`

### Blockchain Integration

- Backend endpoints interact with blockchain via wagmi/viem
- Use `useReadContract` for reading blockchain data
- Use custom `writeContract` wrapper for blockchain writes
- Contract ABIs auto-generated in `src/generated.ts` via `yarn generate`

### Context & State

- **AuthProvider** (`src/context/AuthContext.tsx`) - Manages current user selection
- **TradeAccountProvider** (`src/context/TradeAccountContext.tsx`) - Manages organization/role selection
- Access via `useAuth()` and `useTradeAccount()` hooks

### Components & UI

- **Always use design system components from `components/ui/`** before creating new components or using native HTML elements
- Check `components/ui/` for available components (Button, Input, Select, Dialog, etc.) before building custom UI
- Available components include: Button, Input, Select, Dialog, AlertDialog, Sheet, Tabs, Badge, Calendar, DatePicker, Checkbox, RadioGroup, Search, Tooltip, and more
- Import using absolute paths: `import { Button } from "@/components/ui/button/button"`
- These components are built on Shadcn/ui and customized for the project's design system
- Check component Storybook files (`*.stories.tsx`) for usage examples
- Extend design system components via props rather than creating new components when possible
