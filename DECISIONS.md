# DECISIONS.md   Architecture & Design Walkthrough

## Preface

This document walks through the architectural decisions made during this
implementation. The guiding principle throughout was to avoid over-engineering
for the current scope (a self-contained assignment) while keeping the door open
for scaling when needed.

---

## Project Structure

### `/public`

SVG icons live in `public/assets` and are referenced via direct URL instead of
being imported into components. This keeps them out of the compiled bundle,
makes them easy to swap without a rebuild, and SVG was chosen specifically
because UI icons benefit from small file size and easy CSS styling.

### `/src/app/components`

All components live in a flat components folder rather than a dedicated
sub-components folder. The reasoning is that components like the cell renderer,
sort header, pagination, and search input are not strictly private to the data
table   another feature could reuse them without duplication.

In a larger project the approach would shift: the data table would get its own
dedicated folder containing everything it needs to work in isolation, and any
component with legitimate reuse potential would move to a shared folder to
prevent duplication across features.

### `/src/app/data`

Mock data used for development and testing while no API is available. In a
production codebase this folder would be added to `.gitignore` and replaced by
real API responses.

### `/src/app/interfaces`

All interfaces live in a dedicated folder with one file per interface. Placing
interfaces inside components guarantees duplication the moment a second
component needs the same type. The flat structure works for this scope.

In a larger project interfaces would be co-located with their domain   a user
management feature would own `User`, `UserSummary`, `UserDetail` and so on,
keeping related types close to where they are used.

### `/src/app/services`

Services provide a shared utility layer that prevents logic from being
duplicated across components and stores. `TableUtilsService` specifically owns
three responsibilities: extracting searchable values from cells, comparing
values for sorting, and identifying the shape of a rendered cell value.

In a larger project services would be scoped to their feature module, with a
separate shared folder for truly global utilities like logging, error handling,
parsing, sanitization, and storage wrappers.

### `/src/app/stores`

Extracting sort, search, and pagination logic into plain class stores rather
than keeping everything inside the data table component was a deliberate
decision. A component that owns its own data pipeline, sorting, filtering, and
pagination simultaneously becomes hard to read, hard to debug, and impossible
to test in isolation.

The stores are plain classes instantiated per component rather than injectable
singletons, which means each table instance gets its own isolated state with no
risk of bleed between multiple tables on the same page. They also become the
natural integration point if API calls are introduced later the data pipeline
stays the same, only the source of truth changes.

---

## Conscious Trade-offs

**No test files included.**
Testing frameworks and patterns vary significantly between teams. Including
tests without knowing the team's preferred tooling risks introducing an
unfamiliar setup. This would be the first clarification requested before
writing any test.

**Search is string-based only.**
The current implementation converts all values to strings before comparing.
In a production environment search would need type-aware comparison date
ranges, numeric ranges, boolean flags   and would likely run across a
configurable subset of columns rather than all of them.

**No debounce on the search input.**
For the dataset size in this assignment it is not necessary. At scale with
either a large local dataset or an API-backed one, a debounce of 300ms would
be the first addition to prevent unnecessary computation or network calls on
every keystroke.

**No caching.**
For a local dataset caching adds complexity with no real benefit. Once a
backend enters the picture and record counts grow, caching frequently accessed
pages or search results becomes a meaningful performance lever.

**Responsive layout is a first pass.**
The mobile card layout works well for short cell values. Columns with long
content, many columns, or both would need a revisit   possibly a horizontal
scroll per card or a collapsible detail view rather than stacking every field
vertically.

---

## Where This Breaks at Scale

**Backend data fetching.**
The entire pipeline assumes all data is available client-side. Fetching tens of
thousands of records at once to filter and sort locally is not viable. A
backend-driven implementation would invert the flow   search term, sort field,
sort direction, page, and page size would become query parameters sent to the
API, and the component would display whatever comes back.

**Memory with large datasets.**
The computed chain runs filter, sort, and slice on every signal change.
With 10,000+ records and multiple `computed()` calls this becomes
exponentially expensive. The sort also creates a full array copy on every
click. Virtual scrolling and moving heavy computation off the main thread
would be the path forward.

**Pagination page size on mobile.**
The options of 10, 25, and 50 make sense on desktop. Showing 25 or 50 stacked
mobile cards in a single scroll is a poor user experience and would need either
reduced options on mobile or a different layout strategy.

**No nested field support.**
`column.field` is typed as `keyof T` which only reaches top-level properties.
This was an intentional constraint for the flat data scope of this assignment.
Supporting `"user.name"` style access would require a path resolver utility and
a change to the column interface.

**Null and undefined from API responses.**
The implementation controls its own mock data so unexpected shapes are not a
concern here. Once a real API is involved, every field needs a defined fallback
and the cell renderer needs to handle missing values gracefully without
crashing.

---

## What Would Change for Angular + React Support

The amount of Angular-specific code significantly outweighs the code that could
be shared as-is. The honest summary is that this would be closer to a rewrite
than a refactor.

What could be shared directly: the store logic methods, all interfaces, and the
utility service logic (minus the Angular decorator).

What would need to be rewritten per framework: all reactive state using
`signal()` and `computed()` would become `useState()` and `useMemo()` in React,
`effect()` would become `useEffect()`, `input()` would become props, and every
Angular template would be rewritten as JSX.

The practical approach would be a monorepo with a shared core package
containing the pure logic, and separate framework packages that wrap it in
their own reactivity and rendering.

---

## Bug Encountered During Development

**Search without pagination caused visible slowdown.**

When search was implemented first without pairing it to pagination, filtering
the full dataset on every keystroke became noticeably slow even at moderate
record counts. The fix was ensuring the computed chain always flows in order:
filter first, then sort the filtered result, then paginate the sorted result.
This means pagination always operates on the smallest possible slice of data
and search never processes more rows than necessary for the current view.

---

## Known Future Risks

**Store instances need explicit cleanup if they grow.**
The stores are plain classes with no Angular lifecycle awareness. Currently they
hold only signals with no side effects, so garbage collection handles cleanup
naturally when the component is destroyed. The moment any store adds an
`effect()` internally or subscribes to something external, an `ngOnDestroy`
hook with explicit teardown becomes necessary.

**Data format is controlled by the implementation.**
The sort and search logic makes assumptions about value types based on the
mock data. Introducing a new data format that was not anticipated a custom
date string format, a currency string with symbols, a percentage may produce
silent wrong behavior rather than an error, making it important to define and
validate the expected field types before extending the column definitions.