# URL Routing Adoption Proposal

## Background

YamangDesign currently switches pages through React state in `App.tsx`.
This approach is simple, but it becomes harder to maintain as Playground, Labs, Build, Context, Layouts, Art, and Settings continue to grow.

## Problems with the current approach

- Pages do not have shareable URLs.
- Browser Back and Forward navigation does not reflect page changes.
- Refreshing the browser resets the selected page.
- Page registration and rendering logic are concentrated in `App.tsx`.
- Route-level lazy loading and future nested layouts are difficult to organize.

## Proposal

Introduce React Router and map the existing page groups to URL paths without changing the page components themselves.

```text
/
/playground
/labs/:labName
/build/:componentLevel
/context/:contextName
/layouts/:layoutName
/art/:artworkName
/settings/:settingsPage
```

A centralized route registry should define each route's path, label, group, and lazy-loaded component. Header and card navigation should use router links instead of updating a page state directly.

## Migration plan

1. Add React Router and wrap the application with a browser router.
2. Create a route registry for the existing pages.
3. Replace the central page switch with route definitions.
4. Update Header and landing-page navigation to use URL links.
5. Add redirects for the default page and unknown paths.
6. Remove the legacy `PageName` state after all navigation paths are migrated.

## Non-goals

This change does not redesign the pages or modify design settings, theme handling, the component inspector, or import/export behavior.

## Expected result

The application gains shareable and refresh-safe URLs, browser history support, clearer page registration, and a scalable foundation for nested layouts and route-level code splitting.
