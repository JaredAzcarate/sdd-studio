import { defineCustomOption } from "./catalog-custom.js";
import { defineOption } from "./helpers.js";
import type { EngineeringSection } from "../types.js";

export const engineeringBackendPatternsSection: EngineeringSection = {
  id: "backend-patterns",
  title: "Engineering Backend Patterns",
  description:
    "Cross-cutting backend response, error, and list metadata patterns every API must follow.",
  questions: [
    {
      id: "response-envelope",
      title: "Response Envelope",
      description: "Defines the top-level shape of successful API responses.",
      question: "How should successful API responses be structured?",
      options: [
        defineOption("strapi-like", "Strapi-like { data, meta }", {
          whatIsIt:
            "Success payloads wrap the resource in data; list metadata lives in meta.",
          example:
            '{ "data": { "id": 1, "title": "Task" }, "meta": {} }',
          structureExample:
            '{\n  "data": [{ "id": 1, "title": "Task A" }],\n  "meta": { "pagination": { "page": 1, "pageSize": 25, "pageCount": 4, "total": 87 } }\n}',
          bestFor:
            "REST and action-based APIs that need consistent list metadata.",
          considerations:
            "Single resources still use data as object or array consistently.",
          recommendation:
            "Choose when you want predictable JSON across domains.",
          learnMore:
            "Strapi-like is an example shape, not a requirement to use Strapi.",
        }),
        defineOption("rfc7807", "RFC 7807 for errors; plain data for success", {
          whatIsIt:
            "Success returns the resource directly or in a thin wrapper; errors use Problem Details.",
          example:
            'Success: { "id": 1, "title": "Task" }. Error: application/problem+json body.',
          bestFor: "HTTP-first APIs and public integrations.",
          considerations:
            "Success envelope is less uniform across endpoints unless documented.",
          recommendation:
            "Choose when HTTP semantics and standards compliance matter most.",
          learnMore:
            "Document success shape per resource in domain API specs.",
        }),
        defineOption("flat", "Flat (resource at root)", {
          whatIsIt:
            "The response body is the resource or list without a wrapper.",
          example: '[{ "id": 1 }, { "id": 2 }]',
          bestFor: "Minimal internal APIs and simple CRUD.",
          considerations:
            "Pagination and metadata need another channel (headers or query).",
          recommendation:
            "Choose only when simplicity outweighs uniform envelopes.",
          learnMore:
            "Pair with list-meta-shape if lists need pagination metadata.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "list-meta-shape",
      title: "List Metadata",
      description: "Defines where pagination and list metadata appear.",
      question: "Where should list pagination metadata live?",
      showWhen: {
        questionId: "response-envelope",
        includesAny: ["strapi-like", "rfc7807", "flat", "custom"],
      },
      options: [
        defineOption("meta-pagination", "meta.pagination object", {
          whatIsIt:
            "Lists return data plus meta.pagination with page, pageSize, pageCount, and total.",
          example:
            'meta.pagination: { page: 1, pageSize: 25, pageCount: 4, total: 87 }',
          structureExample:
            '{\n  "data": [],\n  "meta": {\n    "pagination": {\n      "page": 1,\n      "pageSize": 25,\n      "pageCount": 4,\n      "total": 87\n    }\n  }\n}',
          bestFor: "Strapi-like envelopes and offset pagination.",
          considerations: "Align field names with frontend pagination-strategy.",
          recommendation:
            "Choose with strapi-like response-envelope and offset URL pagination.",
          learnMore:
            "Use the same field names in every domain list endpoint.",
        }),
        defineOption("headers-pagination", "HTTP headers", {
          whatIsIt:
            "Pagination totals and cursors are returned in response headers.",
          example: "X-Total-Count, Link rel=next headers.",
          bestFor: "Flat response bodies and HTTP-native clients.",
          considerations: "Frontend must read headers consistently.",
          recommendation:
            "Choose when the body must stay a raw array.",
          learnMore:
            "Document header names in engineering-backend-patterns and API specs.",
        }),
        defineOption("embedded-cursor", "Embedded cursor fields", {
          whatIsIt:
            "Cursor pagination fields are siblings of data in the payload.",
          example:
            '{ "data": [], "nextCursor": "abc", "hasMore": true }',
          bestFor: "Cursor and infinite-scroll frontends.",
          considerations: "Less standard than meta.pagination.",
          recommendation:
            "Choose with cursor or infinite-scroll pagination on the frontend.",
          learnMore:
            "Keep cursor field names stable across domains.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "list-sort",
      title: "List Sort",
      description:
        "Defines how sort and order parameters are passed for list endpoints.",
      question: "How should list sort and order be expressed in API requests?",
      options: [
        defineOption(
          "sort-order-params",
          "sort + order query params",
          {
            whatIsIt:
              "Clients send sort field and order direction as separate query parameters.",
            example:
              "?sort=createdAt&order=desc — aligns with URL-synced frontend filters.",
            bestFor:
              "REST list endpoints paired with query-param frontend filters.",
            considerations:
              "Validate allowed sort fields server-side to prevent SQL injection.",
            recommendation:
              "Choose when frontend syncs sort to the URL alongside filters.",
            learnMore:
              "Whitelist sort fields per domain in API specs.",
          },
        ),
        defineOption("signed-sort-token", "Signed sort token (sort=-createdAt)", {
          whatIsIt:
            "A single sort parameter encodes field and direction with a prefix.",
          example: "?sort=-createdAt or ?sort=title.",
          bestFor:
            "Compact URLs and libraries expecting one sort string.",
          considerations:
            "Document allowed fields and direction syntax.",
          recommendation:
            "Choose when frontend prefers a single sort query key.",
          learnMore:
            "Map to database ORDER BY in the repository layer.",
        }),
        defineOption("post-body-sort", "Sort in POST list body", {
          whatIsIt:
            "Complex list queries use POST with sort in the JSON body.",
          example:
            'POST /tasks/search { "filter": {}, "sort": { "field": "createdAt", "order": "desc" } }.',
          bestFor:
            "Heavy filter payloads that do not fit query strings.",
          considerations:
            "Less cacheable than GET; document when POST is allowed for reads.",
          recommendation:
            "Choose for advanced enterprise filters only.",
          learnMore:
            "Pair with frontend hybrid filter strategy if used.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "id-normalization",
      title: "ID Normalization",
      description: "Defines how entity identifiers appear in API JSON payloads.",
      question: "How should entity IDs be represented in API responses?",
      options: [
        defineOption("string-ids", "String IDs everywhere", {
          whatIsIt:
            "All id fields serialize as strings in JSON even when numeric in the database.",
          example: '{ "id": "42", "assigneeId": "7" }',
          bestFor:
            "JavaScript clients avoiding bigint/number precision issues.",
          considerations:
            "Clients must not assume numeric ids in types without parsing.",
          recommendation:
            "Choose for most TypeScript web and mobile clients.",
          learnMore:
            "Consistent string ids simplify TanStack Query keys.",
        }),
        defineOption("numeric-ids", "Numeric IDs as JSON numbers", {
          whatIsIt:
            "Integer primary keys serialize as numbers in JSON.",
          example: '{ "id": 42, "assigneeId": 7 }',
          bestFor:
            "Internal APIs with int32/int64 ranges and typed clients.",
          considerations:
            "Very large ids may exceed JS safe integer range.",
          recommendation:
            "Choose when all ids stay within safe integer bounds.",
          learnMore:
            "Document bigint handling if snowflake ids are introduced.",
        }),
        defineOption("uuid-strings", "UUID strings only", {
          whatIsIt:
            "Identifiers are UUID strings in API and database.",
          example: '{ "id": "550e8400-e29b-41d4-a716-446655440000" }',
          bestFor:
            "Distributed systems and public APIs without enumerable ids.",
          considerations:
            "Slightly larger payloads; index tuning matters at scale.",
          recommendation:
            "Choose when exposing public APIs or merging distributed writers.",
          learnMore:
            "Never expose sequential integer ids externally if enumeration is a risk.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "error-verbosity",
      title: "Error Verbosity",
      description: "Defines how much error detail is exposed to clients.",
      question: "How verbose should API error responses be?",
      options: [
        defineOption("ux-friendly", "UX-friendly (safe user messages)", {
          whatIsIt:
            "Clients receive stable codes and human-readable messages safe to show in the UI.",
          example:
            'message: "Could not save task. Try again." without internal stack traces.',
          bestFor: "Production user-facing applications.",
          considerations:
            "Log technical detail server-side; do not leak internals.",
          recommendation:
            "Choose for most customer-facing products.",
          learnMore:
            "Frontend toasts and inline errors use message; developers use logs.",
        }),
        defineOption("detailed", "Detailed (include diagnostic fields)", {
          whatIsIt:
            "Errors include explicit codes, messages, and structured details for clients and developers.",
          example:
            'details: [{ "path": "email", "message": "Invalid format" }]',
          bestFor: "Internal tools, B2B APIs, and integrators.",
          considerations:
            "Sanitize sensitive data before returning details.",
          recommendation:
            "Choose when API consumers need field-level diagnostics.",
          learnMore:
            "Still avoid stack traces in production responses.",
        }),
        defineOption("environment-based", "Environment-based", {
          whatIsIt:
            "Production returns UX-friendly errors; development returns extended diagnostic detail.",
          example:
            "DEV adds stack and query hints; PROD returns message and code only.",
          bestFor: "Teams that want safe production UX and rich local debugging.",
          considerations:
            "Ensure production never leaks debug fields.",
          recommendation:
            "Choose when you need both safety and developer speed.",
          learnMore:
            "Gate extra fields behind NODE_ENV or an explicit debug flag.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "error-structure",
      title: "Error Structure",
      description: "Defines the JSON shape of error responses.",
      question: "How should error responses be structured?",
      options: [
        defineOption(
          "status-name-message-details",
          "{ status, name, message, details? }",
          {
            whatIsIt:
              "Errors use a single error object with HTTP status, machine name, user message, and optional details.",
            example:
              '{ "error": { "status": 400, "name": "ValidationError", "message": "Check the highlighted fields", "details": [] } }',
            structureExample:
              '{\n  "error": {\n    "status": 400,\n    "name": "ValidationError",\n    "message": "Check the highlighted fields",\n    "details": [{ "path": "email", "message": "Invalid format" }]\n  }\n}',
            bestFor: "Strapi-like ecosystems and consistent client parsing.",
            considerations:
              "Map domain failures to stable name values.",
            recommendation:
              "Choose with strapi-like success envelopes for a cohesive API style.",
            learnMore:
              "name is machine-readable; message is user-facing.",
          },
        ),
        defineOption("code-message", "code + message", {
          whatIsIt:
            "Compact errors with a stable code string and a message.",
          example: '{ "error": { "code": "USER_NOT_FOUND", "message": "User not found" } }',
          bestFor: "Simple APIs and mobile clients.",
          considerations:
            "Field-level validation may need an extra details array.",
          recommendation:
            "Choose when errors are mostly global, not field-scoped.",
          learnMore:
            "Document all codes in domain API specs.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "validation-errors",
      title: "Validation Errors",
      description: "Defines how field-level validation failures are returned.",
      question: "How should validation errors be represented?",
      options: [
        defineOption("field-path-details", "details[{ path, message }]", {
          whatIsIt:
            "Each invalid field gets a path and message entry in error.details.",
          example:
            'details: [{ "path": "email", "message": "Invalid format" }]',
          bestFor: "Forms mapped to inline field errors on the frontend.",
          considerations:
            "path must match frontend field names or a documented mapping.",
          recommendation:
            "Choose with inline-form-errors on the frontend.",
          learnMore:
            "Supports multiple errors per request.",
        }),
        defineOption("single-message", "Single message only", {
          whatIsIt:
            "Validation failures return one message without per-field breakdown.",
          example: 'message: "Invalid input"',
          bestFor: "Simple APIs and non-form clients.",
          considerations:
            "Frontend cannot highlight individual fields without parsing message text.",
          recommendation:
            "Choose only when UI does not need per-field errors.",
          learnMore:
            "Prefer field-path-details when forms are in scope.",
        }),
        defineCustomOption(),
      ],
    },
    {
      id: "http-status-mapping",
      title: "HTTP Status Mapping",
      description:
        "Defines how error categories map to HTTP status codes for API clients.",
      question: "How should HTTP status codes be used for API errors?",
      options: [
        defineOption("rest-conventional", "REST conventional mapping", {
          whatIsIt:
            "400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 semantic validation, 500 internal.",
          example:
            "ValidationError → 400; missing session → 401; wrong role → 403.",
          bestFor:
            "HTTP clients, mobile apps, and public APIs.",
          considerations:
            "Align error.name and body shape with status consistently.",
          recommendation:
            "Choose for most web and mobile products.",
          learnMore:
            "Document domain-specific 409 cases in API specs.",
        }),
        defineOption("minimal-status", "Minimal (400 client / 500 server)", {
          whatIsIt:
            "Only distinguish bad input (400) from server faults (500).",
          example:
            "All auth failures return 400 with error codes in the body.",
          bestFor:
            "Very simple internal APIs hiding HTTP nuance.",
          considerations:
            "Harder for generic HTTP clients to branch on status.",
          recommendation:
            "Choose only for tightly coupled internal clients.",
          learnMore:
            "Prefer REST conventional mapping for multi-client APIs.",
        }),
        defineCustomOption(),
      ],
    },
  ],
};
