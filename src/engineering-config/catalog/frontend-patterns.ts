import { defineOption } from "./helpers.js";
import type { EngineeringSection } from "../types.js";

export const engineeringFrontendPatternsSection: EngineeringSection = {
  id: "frontend-patterns",
  title: "Engineering Frontend Patterns",
  description:
    "Cross-cutting frontend implementation patterns that every feature must follow.",
  questions: [
    {
      id: "data-flow-layers",
      title: "Data Flow Layers",
      description:
        "Defines how data moves from the API surface to UI components.",
      question:
        "How should data flow from the backend endpoint to the UI?",
      options: [
        defineOption(
          "endpoint-service-hook-page-component",
          "Endpoint → Service → Hook → Page → Component",
          {
            whatIsIt:
              "Server actions or API clients live in services; hooks orchestrate loading and state; pages compose hooks; components stay presentational.",
            example:
              "taskService.list() called from useTaskList() in tasks/page.tsx; TaskTable receives rows as props.",
            bestFor:
              "App Router or page-based routing where route files own data orchestration.",
            considerations:
              "Pages can grow if they coordinate many hooks; keep page logic thin.",
            recommendation:
              "Choose this when pages are the natural boundary for route-level data and layout.",
            learnMore:
              "Separates transport, orchestration, and presentation so AI agents generate consistent file boundaries.",
          },
        ),
        defineOption(
          "endpoint-service-hook-component",
          "Endpoint → Service → Hook → Component",
          {
            whatIsIt:
              "Hooks call services directly; smart components or feature modules own the hook without an intermediate page layer.",
            example:
              "TaskListPanel calls useTaskList() internally; no page-level data wiring.",
            bestFor:
              "Feature folders, colocated smart components, or routes that only mount one feature module.",
            considerations:
              "Harder to see all data dependencies at the route level.",
            recommendation:
              "Choose this when features are self-contained modules mounted by thin route files.",
            learnMore:
              "Useful when the page is a shell and the feature component is the real entry point.",
          },
        ),
        defineOption(
          "endpoint-service-page-component",
          "Endpoint → Service → Page → Component",
          {
            whatIsIt:
              "Pages call services directly without a dedicated hook layer; components remain presentational.",
            example:
              "page.tsx awaits taskService.list() in a server component and passes data down.",
            bestFor:
              "Mostly server-rendered flows with minimal client state.",
            considerations:
              "Client interactivity may still need hooks for mutations and optimistic UI.",
            recommendation:
              "Choose this for server-first apps with limited client-side data orchestration.",
            learnMore:
              "Keep services as the only place that knows how to call the backend.",
          },
        ),
      ],
    },
    {
      id: "list-filters",
      title: "List Filters",
      description: "Defines how list and table filters are applied and stored.",
      question: "How should list filters behave?",
      options: [
        defineOption(
          "query-params-state-hook-api",
          "Query params → URL state → Hook → API",
          {
            whatIsIt:
              "Filters are encoded in the URL query string, synced to client state, passed to a data hook, and sent to the backend as request parameters.",
            example:
              "?status=open&assignee=42 synced to useTaskFilters(); hook calls listTasks({ status, assignee }).",
            bestFor:
              "Shareable URLs, back-button behavior, and server-side filtering.",
            considerations:
              "Requires parsing and serializing query params consistently across features.",
            recommendation:
              "Choose this when filters must be bookmarkable and the backend performs filtering.",
            learnMore:
              "URL is the source of filter truth; hooks translate URL state into API calls.",
          },
        ),
        defineOption("client-side-filters", "Client-side filters", {
          whatIsIt:
            "The client loads a dataset and filters in memory or via client-only state without URL sync.",
          example:
            "Fetch all tasks once; filter dropdown updates local state only.",
          bestFor: "Small datasets and prototypes.",
          considerations:
            "Does not scale; URLs are not shareable with filter state.",
          recommendation:
            "Choose only when lists are small and server filtering is unnecessary.",
          learnMore:
            "Avoid for production lists that grow beyond trivial size.",
        }),
        defineOption("hybrid-filters", "Hybrid (URL + client refinements)", {
          whatIsIt:
            "Primary filters sync to query params and hit the API; secondary refinements stay client-side.",
          example:
            "status and date range in URL and API; column sort or quick search client-side on the current page.",
          bestFor:
            "Heavy server filters plus lightweight UI-only refinements.",
          considerations:
            "Document which filters are server vs client to avoid inconsistent behavior.",
          recommendation:
            "Choose when only part of the filter set must be shareable or server-backed.",
          learnMore:
            "Be explicit in specs about which parameters are API-backed.",
        }),
      ],
    },
    {
      id: "search-behavior",
      title: "Search",
      description: "Defines how text search is executed in list and lookup UIs.",
      question: "How should search behave?",
      showWhen: { questionId: "target-platforms", includes: "web" },
      options: [
        defineOption("server-debounced", "Server-side with debounce", {
          whatIsIt:
            "Search input debounces before calling the backend with a query parameter.",
          example:
            "300ms debounce on q=; hook calls listTasks({ q }) after idle.",
          bestFor: "Large datasets and consistent server ranking.",
          considerations: "Define minimum characters and empty-query behavior.",
          recommendation:
            "Choose for production lists where search must scale.",
          learnMore:
            "Typical defaults: 300ms debounce, minimum 2 characters, clear resets q.",
        }),
        defineOption("client-search", "Client-side search", {
          whatIsIt:
            "Search filters the already-loaded collection without a round trip.",
          example: "Filter visible rows by title substring in memory.",
          bestFor: "Small static lists.",
          considerations: "Not suitable for paginated server data.",
          recommendation: "Choose only for small, fully-loaded lists.",
          learnMore: "Pair with client-side filters when data size is bounded.",
        }),
        defineOption("no-dedicated-search", "No dedicated search", {
          whatIsIt:
            "Lists rely on structured filters only; no free-text search field.",
          example: "Status and date filters without a search box.",
          bestFor: "Workflows where filters fully replace text search.",
          considerations:
            "Users may expect search; confirm product requirements.",
          recommendation:
            "Choose when the domain is filter-driven, not search-driven.",
          learnMore:
            "Document in UI specs when search is intentionally omitted.",
        }),
      ],
    },
    {
      id: "pagination-strategy",
      title: "Pagination",
      description: "Defines how paginated data is requested and reflected in the UI.",
      question: "How should pagination work?",
      options: [
        defineOption("offset-url", "Offset in URL query params", {
          whatIsIt:
            "page and pageSize (or limit) live in the URL; the hook passes them to the API.",
          example: "?page=2&pageSize=25 → listTasks({ page, pageSize }).",
          bestFor:
            "Classic admin tables, shareable pages, and offset-friendly APIs.",
          considerations:
            "Offset pagination can be inefficient on very large datasets.",
          recommendation:
            "Choose for standard B2B tables with moderate data size.",
          learnMore:
            "Sync pagination state to the URL when filters use query params too.",
        }),
        defineOption("cursor", "Cursor-based", {
          whatIsIt:
            "Next/previous pages use opaque cursors returned by the API.",
          example: "meta.pagination.nextCursor passed to the following request.",
          bestFor: "Large or rapidly changing datasets.",
          considerations:
            "Harder to jump to arbitrary page numbers in the UI.",
          recommendation:
            "Choose when stable deep paging matters more than page numbers.",
          learnMore:
            "Document cursor fields in backend patterns and API specs.",
        }),
        defineOption("infinite-scroll", "Infinite scroll", {
          whatIsIt:
            "Append pages as the user scrolls; no classic page controls.",
          example:
            "useInfiniteQuery loads the next cursor when the sentinel is visible.",
          bestFor: "Feeds, activity streams, and mobile-first lists.",
          considerations:
            "Harder to reach footer content; provide alternative navigation if needed.",
          recommendation:
            "Choose for feed-like experiences, not dense admin tables.",
          learnMore:
            "Pair with loading skeletons at the list tail.",
        }),
      ],
    },
    {
      id: "async-ui-states",
      title: "Async UI States",
      description:
        "Defines which states every data-driven UI must handle explicitly.",
      question: "Which async UI states are mandatory for data-driven components?",
      selectionMode: "multi",
      options: [
        defineOption("loading", "Loading", {
          whatIsIt: "Show a loading state while data is being fetched.",
          example: "Skeleton rows or spinner while the hook is pending.",
          bestFor: "Any async data surface.",
          considerations: "Never leave a blank area without feedback.",
          recommendation: "Always include Loading.",
          learnMore:
            "Pair with the Loading UX pattern for skeleton vs spinner.",
        }),
        defineOption("error", "Error", {
          whatIsIt: "Show a recoverable error state when the request fails.",
          example: "Inline alert with retry action.",
          bestFor: "All networked views.",
          considerations: "Map backend messages to user-safe copy.",
          recommendation: "Always include Error.",
          learnMore:
            "Follow backend error verbosity patterns for displayed text.",
        }),
        defineOption("success", "Success (data)", {
          whatIsIt: "Render the happy path when data is available.",
          example: "Table rows, card grid, or detail panel.",
          bestFor: "Default path after loading completes.",
          considerations: "Distinguish empty success from error.",
          recommendation: "Always include Success.",
          learnMore:
            "Success with zero items should use Empty, not Error.",
        }),
        defineOption("empty", "Empty", {
          whatIsIt:
            "Dedicated empty state when the request succeeded but returned no items.",
          example: "No tasks yet — create your first task.",
          bestFor: "Lists, dashboards, and first-use flows.",
          considerations: "Provide a clear next action when possible.",
          recommendation: "Include Empty for list and collection views.",
          learnMore:
            "Empty is a success state, not an error.",
        }),
      ],
    },
    {
      id: "loading-ux",
      title: "Loading UX",
      description: "Defines the default loading indicator style.",
      question: "What loading pattern should the UI use by default?",
      options: [
        defineOption("skeleton", "Skeleton placeholders", {
          whatIsIt:
            "Layout-shaped placeholders animate while content loads.",
          example: "Skeleton rows in a table; skeleton cards in a grid.",
          bestFor: "Lists, dashboards, and content-heavy layouts.",
          considerations: "Match skeleton shape to final layout to avoid jump.",
          recommendation:
            "Choose for professional apps where perceived performance matters.",
          learnMore:
            "Prefer skeletons for initial page and list loads.",
        }),
        defineOption("spinner", "Spinner / loader", {
          whatIsIt:
            "A compact spinner indicates activity without layout preview.",
          example: "Centered spinner on first load; button spinner on submit.",
          bestFor: "Small surfaces, modals, and button actions.",
          considerations: "Full-page spinners feel slower than skeletons.",
          recommendation:
            "Choose for simple apps or when skeleton layout is unknown.",
          learnMore:
            "Use spinners for discrete actions, not entire data tables.",
        }),
        defineOption("hybrid-loading", "Hybrid (skeleton + spinner)", {
          whatIsIt:
            "Skeletons for page and list loads; spinners for buttons and inline actions.",
          example:
            "Skeleton table on route load; spinner on Save in a modal.",
          bestFor: "Most production web apps.",
          considerations: "Document which surfaces use which pattern.",
          recommendation:
            "Choose when you want polish on lists and clarity on actions.",
          learnMore:
            "This is the most common professional default.",
        }),
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Defines how success and failure feedback is shown to users.",
      question: "How should the app surface action feedback?",
      selectionMode: "multi",
      options: [
        defineOption("toast-success", "Toast for success", {
          whatIsIt:
            "Transient toast confirms successful mutations and background actions.",
          example: "Task saved toast after form submit.",
          bestFor: "Non-blocking confirmation of successful actions.",
          considerations: "Do not overuse; one toast per meaningful action.",
          recommendation:
            "Include for mutation success when the UI does not already show inline confirmation.",
          learnMore:
            "Pick a toast library in engineering-stack.md.",
        }),
        defineOption("toast-error", "Toast for errors", {
          whatIsIt:
            "Transient toast shows user-safe error messages for failed actions.",
          example: "Could not save task — try again.",
          bestFor: "Global or action failures outside form fields.",
          considerations: "Map to backend error.message for display.",
          recommendation:
            "Include for API failures that are not field-level validation.",
          learnMore:
            "Never expose stack traces in toasts.",
        }),
        defineOption("inline-form-errors", "Inline errors on forms", {
          whatIsIt:
            "Validation and field errors render next to the relevant inputs.",
          example: "Email format invalid under the email field.",
          bestFor: "All form-based input.",
          considerations:
            "Use backend validation details when path maps to a field.",
          recommendation:
            "Always include for forms with user input.",
          learnMore:
            "Pair with backend validation error structure.",
        }),
        defineOption("modal-destructive", "Modal for destructive actions", {
          whatIsIt:
            "Destructive operations require an explicit confirmation modal.",
          example: "Delete project — this cannot be undone.",
          bestFor: "Irreversible or high-impact actions.",
          considerations: "Log or audit if compliance requires it.",
          recommendation:
            "Include when the product has delete or irreversible workflows.",
          learnMore:
            "Do not use modals for routine success messages.",
        }),
      ],
    },
  ],
};
