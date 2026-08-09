---
name: react-crud-module
description: Scaffold or port a permission-gated CRUD feature module (models, api, hooks, routes, List/Form components) into this React app, following the app's established `users` module pattern. Use when adding a new feature module, or when porting a module from the Eleven.Security.Web Angular app (ngx-permissions guarded module -> React equivalent).
---

# React CRUD module (this app's convention)

This app has one fully-built reference module: `src/features/users/`. Every other
module (`roles`, `menu-options`, `applications`, `modules`, `actions`, `permissions`, ...)
should follow the exact same shape. Do not invent a new pattern — copy this one and
adapt field names.

If you are porting a module from the Angular app `Eleven.Security.Web`
(`src/app/<module>/`), the Angular `*.service.ts` maps 1:1 to `api/*Api.ts`, the
Angular models map 1:1 to `models/*.ts`, the Angular routing module maps to
`<module>Routes.tsx`, and the Angular search/new-edit components map to
`<Singular>List.tsx` / `<Singular>Form.tsx`. `*ngxPermissionsOnly="PERMISSIONS.X"` maps to
`<HasPermissions permissions={[PERMISSIONS.X]}>`, and `NgxPermissionsGuard` route data maps
to nothing extra — permission gating in this app is inline UI-only (there is no route-level
guard), so just gate the buttons/rows.

## Before you start

1. Check whether `src/core/auth/permissions/modules.ts` (`MODULES`) and
   `src/core/auth/permissions/permissions.ts` (`PERMISSIONS`) already have an entry for
   your module. Angular's `PERMISSIONS` catalog (`Eleven.Security.Web/src/app/core/config/permissions/permissions.ts`)
   is the source of truth for the exact permission code strings (e.g. `'roles.permissions'`).
   Add a `MODULES.<NAME>` + `PERMISSIONS.<NAME>: { CREATE, DELETE, EDIT, SEARCH, EXPORT, ... }`
   entry only if missing — most modules already have theirs.
2. Check `src/core/i18n/modules/<module>.en.ts` / `.es.ts` for existing translation keys
   before adding new ones — the convention below assumes they exist (`<MODULE>.SEARCH.TITLE`,
   `<MODULE>.SEARCH.SUB_TITLE`, `<MODULE>.COMMON.FIELDS.*`, `<MODULE>.NEW.*`, `<MODULE>.EDIT.*`).
   Reuse `src/core/i18n/shared/common.en.ts` (`COMMON.ACTIONS.*`, `COMMON.MESSAGES.*`,
   `COMMON.FIELDS.*`) and `validation.en.ts` (`VALIDATION.*`) rather than duplicating strings.

## File layout

```
src/features/<module>/
  <module>Routes.tsx          # only if the module is independently routable — see "Embedded modules" below
  api/<module>Api.ts
  hooks/<module>Hooks.ts
  models/*.ts
  components/<Singular>List.tsx
  components/<Singular>Form.tsx
```

## 1. Models (`models/*.ts`)

One interface per DTO shape, matching the Angular models file-for-file:

```ts
// XModel.ts — the base shape (create-time fields)
export interface XModel {
  fieldA: string;
  fieldB: string;
}

// GetXModel.ts
import type { XModel } from "./XModel";
export interface GetXModel extends XModel {
  id: string;
  isActive: boolean;
}

// CreateXModel.ts
import type { XModel } from "./XModel";
export type CreateXModel = XModel

// UpdateXModel.ts
import type { XModel } from "./XModel";
export interface UpdateXModel extends XModel {
  id: string;
  isActive: boolean;
}

// ListXModel.ts / SearchXModel.ts
import type { GetXModel } from "./GetXModel";
export type ListXModel = GetXModel
export type SearchXModel = GetXModel

// SearchXFilterModel.ts — the shape of the search form
export interface SearchXFilterModel {
  query: string; // or whatever the Angular *-filter.model.ts declares
}
```

## 2. API (`api/<module>Api.ts`)

One axios client per resource, plain async functions, `ResponseDto<T>` / `ResponseBaseDto`
return types (`src/models/base/api`). Mirrors the Angular `BaseService`-derived service 1:1
— same relative paths.

```ts
import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";
import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";
// ... model imports

const baseUrl = `${environment.backend.apiUrl}/<resource>`;
const client = createAxiosClient(baseUrl);

export async function createX(body: CreateXModel): Promise<ResponseDto<GetXModel>> {
  const { data } = await client.post<ResponseDto<GetXModel>>("", body);
  return data;
}
export async function updateX(body: UpdateXModel): Promise<ResponseDto<GetXModel>> {
  const { data } = await client.put<ResponseDto<GetXModel>>("", body);
  return data;
}
export async function deleteX(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}
export async function getX(id: string): Promise<ResponseDto<GetXModel>> {
  const { data } = await client.get<ResponseDto<GetXModel>>(`/${id}`);
  return data;
}
export async function listX(): Promise<ResponseDto<ListXModel[]>> {
  const { data } = await client.get<ResponseDto<ListXModel[]>>("/list");
  return data;
}
export async function searchX(body: SearchParamsModel<SearchXFilterModel> | null): Promise<ResponseDto<QueryResultsModel<SearchXModel>>> {
  const { data } = await client.post<ResponseDto<QueryResultsModel<SearchXModel>>>("/search", body);
  return data;
}
```

## 3. Hooks (`hooks/<module>Hooks.ts`)

TanStack Query wrapper: a `<module>Keys` factory + one `use*` per API function. Mutations
invalidate `.all` on success and forward the caller's `onSuccess`/`onError`.

```ts
export const xKeys = {
  all: ["x"] as const,
  get: (id: string) => ["x", "get", id] as const,
  search: (body: SearchParamsModel<SearchXFilterModel> | null) => ["x", "search", body] as const,
};

export function useCreateX(options?: Omit<UseMutationOptions<ResponseDto<GetXModel>, Error, CreateXModel>, "mutationFn">) {
  const queryClient = useQueryClient();
  return useMutation<ResponseDto<GetXModel>, Error, CreateXModel>({
    mutationFn: createX,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: xKeys.all });
      options?.onSuccess?.(data, variables, () => {}, context as MutationFunctionContext);
    },
    ...options,
  });
}
// ...useUpdateX / useDeleteX (same shape) / useGetX / useSearchX (useQuery, enabled: Boolean(id | searchParams))
```

Reference: `src/features/users/hooks/usersHooks.ts`, `src/features/roles/hooks/rolesHooks.ts`.

## 4. Routes (`<module>Routes.tsx`) — only for independently-routable modules

```tsx
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import XList from "./components/XList";
import XForm from "./components/XForm";

export const xRoutes: RouteObject[] = [
  {
    path: '/x',
    element: <Outlet />,
    children: [
      { index: true, element: <XList /> },
      { path: 'list', element: <XList /> },
      { path: 'new', element: <XForm /> },
      { path: 'edit/:id', element: <XForm /> },
    ]
  },
];
```

Then spread `...xRoutes` into the authenticated/layout branch of `src/App.tsx`, alongside the
other `...moduleRoutes` spreads.

### Embedded modules (no route)

Some Angular modules have **no top-level route** — they're only reachable as a dialog opened
from another module's list page (e.g. `actions` from `modules`, `permissions`-assign from
`roles`). Check `Eleven.Security.Web/src/app/<module>/<module>-routing.module.ts` — if
`routes: Routes = []` there, **do not create a routes file or touch `App.tsx`**. Instead:

- Build a single `XForm.tsx` (or `AssignXDialog.tsx`) using `WindowDialog` /
  `AlertMessageDialog` (`src/components/shared/`) instead of `AppCard` + routing.
- It takes props like `{ id?, isOpen, setIsOpen, onSuccess, ...parentContextIds }` and is
  rendered conditionally from the parent list component's JSX, with local `useState` toggling
  `isOpen` (mirrors Angular's `@ViewChild` + `showDialog(params)` pattern).
- The dialog itself does **not** gate its own Save/Cancel buttons with `<HasPermissions>` —
  permission gating happens on the buttons in the *parent* page that open the dialog (this
  matches Angular, where the embedded dialog component's own permission lookup is unused;
  gating is on the caller).

## 5. List component (`components/<Singular>List.tsx`)

Copy `src/features/users/components/UserList.tsx` structure:

- `const { PERMISSIONS } = usePermissionsModule(MODULES.<NAME>);`
- `tableColumns: TableColumn<SearchXModel>[]` array, each entry `{ header, className?, exportFields?, render }`.
- Local `SearchParamsModel<SearchXFilterModel>` state seeded from `defaultPage`
  (`src/models/base/query/SearchParamsModel`), fed into `useSearchX`.
- Search form via `@tanstack/react-form` (`onSubmit`/`onReset` handlers calling `onSearch`).
- Render with `AppCard/AppCardHeader/AppCardBody`, raw `TableRoot/TableHeader/TableBody/TableRow/TableCell`
  from `@/components/tailgrids/core/table`, `TableLoader`/`TableEmpty` for loading/empty states,
  `TablePagination` for paging (all from `src/components/shared/`).
- New/Export buttons in the card header, Edit/Delete in a per-row actions column — every one
  of these wrapped in `<HasPermissions permissions={[PERMISSIONS.<ACTION>]}>`.
- Delete via `useDialogs().openConfirmationDialog({ data: item.id, title, description, onYes })`;
  success/error via `openToasts(response)` / `openErrorToast(...)`.
- Export via `exportToExcel({ items, columns: tableColumns, translate, fileName, sheetName, onSuccess })`
  after re-calling `searchX` directly with `pageSize: 1000`.
- If the Angular source used a Material tree (accordion of parent/child rows) instead of a flat
  table — e.g. `modules` (actions tree) or `menu-options` — use `AccordionRoot`/`AccordionItem`
  (`@/components/tailgrids/core/accordion`) per top-level group and the shared `NestedTree`
  component (`src/components/shared/NestedTree.tsx`) for the recursive parent/child rows instead
  of the table primitives.

## 6. Form component (`components/<Singular>Form.tsx`)

Copy `src/features/users/components/UserForm.tsx` structure:

- Single component for create **and** edit, keyed by `useParams().id` (falsy `id` = create).
- `useGetX(id ?? '')` to load the record when editing; any cross-feature dropdown data
  (e.g. roles needs applications, modules needs applications) loaded with its own `use*` hook.
- `zod` schema built **inside** the component (so messages can call `translate(...)`), passed
  to `useForm({ validators: { onMount, onChange, onSubmit } })`. Use
  `translate('VALIDATION.INPUT.REQUIRED_<n>', { field })`, `translate('VALIDATION.TEXT.MIN_LENGTH', { field, value })`,
  etc. — see `src/core/i18n/shared/validation.en.ts` for the exact keys available. Loosen/tighten
  fields conditionally on `id` exactly like Angular did (e.g. password only required on create).
- `useEffect` to `form.reset(record)` when the fetched entity arrives; a second `useEffect` on
  `i18n.language` to re-validate (for localized error messages) — copy verbatim from `UserForm`.
- Every field: `TextField` (`react-aria-components`) + `InputGroup`/`InputGroupInput` from
  `@/components/tailgrids/core/input-group`, with `<InputErrors form={form} field={field} />`
  underneath (`src/components/shared/InputErrors.tsx`).
- Dropdowns: `Select`/`SelectTrigger`/`SelectContent`/`SelectItem` from
  `@/components/tailgrids/core/select` (`selectionMode="multiple"` for multi-select, omit for
  single). Booleans: `Toggle` from `@/components/tailgrids/core/toggle`, shown edit-only when
  Angular only exposes it on edit (e.g. `isActive`).
- Save/Cancel buttons in `AppCardHeader`, gated the same way as the List page's create button;
  on success `openToasts(response)` then `navigate('/<module>')` after a `setTimeout(..., 1000)`.
- `AppCardBodyLoader` while any dependency query is loading.

## Verification checklist

- [ ] `MODULES.<NAME>` and `PERMISSIONS.<NAME>` exist (or were added) in `src/core/auth/permissions/`.
- [ ] i18n keys used actually exist in `src/core/i18n/modules/<module>.{en,es}.ts` and
      `src/core/i18n/shared/{common,validation}.{en,es}.ts` — add only what's genuinely missing,
      mirroring both languages.
- [ ] Routable modules: route file created/updated and spread into `src/App.tsx`'s authenticated
      layout branch. Embedded modules: **no** route file, **no** `App.tsx` change.
- [ ] `npm run lint` and `npm run build` pass (this project has `noUnusedLocals`/`noUnusedParameters`
      enabled — stub files left with unused imports will fail the build).
