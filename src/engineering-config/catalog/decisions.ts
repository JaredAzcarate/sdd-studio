import { defineOption } from "./helpers.js";
import type { EngineeringSection } from "../types.js";

export const engineeringDecisionsSection: EngineeringSection = {
  id: "decisions",
  title: "Engineering Decisions",
  description:
    "Architectural decisions that begin shaping how the system will be structured and operated.",
  questions: [
    {
      id: "repository-organization",
      title: "Organización de repositorios",
      description:
        "Define cómo se organiza el código a nivel de repositorios, no la estructura interna de carpetas.",
      question: "¿Cómo quieres organizar el código?",
      options: [
        defineOption("single-monorepo", "Monorepo único", {
          whatIsIt:
            "Todo el código vive en un solo repositorio con una o varias aplicaciones o paquetes internos.",
          example:
            "Un único repo con apps web, API y librerías compartidas en carpetas o paquetes internos.",
          bestFor:
            "Equipos pequeños o medianos que priorizan cambios atómicos y visibilidad completa del sistema.",
          considerations:
            "El repo puede crecer; necesitas límites claros entre módulos y CI que escale con el tamaño.",
          recommendation:
            "Elige Monorepo único cuando la coordinación entre componentes es más crítica que el aislamiento por repo.",
          learnMore:
            "Un monorepo no prescribe la herramienta; solo define que el código comparte un mismo repositorio.",
        }),
        defineOption("independent-repos", "Repositorios independientes por app/servicio", {
          whatIsIt:
            "Cada aplicación o servicio mantiene su propio repositorio con ciclos de release independientes.",
          example:
            "Repos separados para la app web, la API, el worker y la app móvil.",
          bestFor:
            "Equipos autónomos, despliegues independientes y límites de propiedad claros por servicio.",
          considerations:
            "Contratos entre repos, versionado de APIs y coordinación cross-repo requieren disciplina explícita.",
          recommendation:
            "Elige repos independientes cuando cada superficie evoluciona con ritmos y equipos distintos.",
          learnMore:
            "Polyrepo facilita autonomía; compensa con contratos estables y documentación de integración.",
        }),
        defineOption("orchestrator-independent", "Repo orquestador + repos independientes", {
          whatIsIt:
            "Un repositorio orquestador coordina despliegue, documentación o tooling mientras el código vive en repos separados.",
          example:
            "Un repo platform con scripts de CI/CD y docs que referencia repos de web, API y mobile.",
          bestFor:
            "Organizaciones que necesitan autonomía por servicio pero un punto central de coordinación operativa.",
          considerations:
            "El orquestador debe tener dueño claro; evita convertirlo en un monorepo disfrazado sin código.",
          recommendation:
            "Elige orquestador + repos independientes cuando quieres autonomía con un hub de coordinación.",
          learnMore:
            "Este patrón separa topología de repos de layout interno dentro de cada repo.",
        }),
        defineOption("custom", "Otra — especifica", {
          whatIsIt:
            "Un esquema de organización distinto, definido por restricciones internas, legado o política de la organización.",
          example:
            "Repos por unidad de negocio con submódulos, o un modelo híbrido documentado en un RFC interno.",
          bestFor:
            "Organizaciones con restricciones regulatorias, legado o monorepos parciales ya establecidos.",
          considerations:
            "Sin documentación escrita, los esquemas personalizados se degradan rápido para nuevos contribuidores.",
          recommendation:
            "Elige Otra solo si puedes describir reglas claras de dónde debe vivir el código nuevo.",
          learnMore:
            "Los esquemas custom necesitan ejemplos y enforcement para mantenerse coherentes.",
        }),
      ],
    },
    {
      id: "project-organization",
      title: "Project Organization",
      description: "Defines how source code is grouped and navigated across the codebase.",
      question: "How should the project be organized?",
      options: [
        defineOption("feature-first", "Feature First", {
          whatIsIt:
            "Code is grouped by product features or user-facing capabilities, with shared utilities extracted only when duplication proves necessary.",
          example:
            "Folders for onboarding, billing, and settings each containing their UI, hooks, and local helpers together.",
          structureExample: `src/
├── features/
│   ├── onboarding/
│   ├── billing/
│   └── settings/
└── shared/`,
          bestFor:
            "Product teams optimizing for vertical delivery and engineers who think in user journeys.",
          considerations:
            "Shared infrastructure can sprawl without governance; establish clear rules for what may live inside a feature versus a shared layer.",
          recommendation:
            "Choose Feature First when shipping end-to-end slices quickly matters more than strict horizontal layering.",
          learnMore:
            "Feature-first layouts align folders with backlog items; pair with lightweight shared modules for cross-cutting concerns.",
        }),
        defineOption("feature-sliced-design", "Feature-Sliced Design", {
          whatIsIt:
            "A layered slice methodology separates app, pages, features, entities, and shared modules with explicit import rules between layers.",
          example:
            "An entities layer for user models consumed by feature modules, which pages compose without reaching across unrelated features.",
          structureExample: `src/
├── app/
├── pages/
├── features/
├── entities/
└── shared/`,
          bestFor:
            "Growing front-end codebases that need scalable boundaries and enforceable dependency direction.",
          considerations:
            "The methodology has a learning curve; teams must agree on slice definitions and lint rules to prevent ceremonial structure.",
          recommendation:
            "Choose Feature-Sliced Design when multiple squads touch the same client codebase and import chaos is a recurring risk.",
          learnMore:
            "Slice-based design trades folder count for predictability; document allowed imports so architecture stays self-enforcing.",
        }),
        defineOption("layer-first", "Layer First", {
          whatIsIt:
            "Code is organized by technical role—presentation, application, domain, infrastructure—regardless of which feature owns a change.",
          example:
            "Separate directories for all controllers, all services, and all repositories across the entire product.",
          structureExample: `src/
├── controllers/
├── services/
├── domain/
└── infrastructure/`,
          bestFor:
            "Backend-heavy systems, framework conventions, and teams accustomed to classic enterprise layering.",
          considerations:
            "Simple features may require touching many folders; feature ownership blurs unless complemented by module boundaries.",
          recommendation:
            "Choose Layer First when your runtime stack strongly conventionizes layers and the team values uniform technical separation.",
          learnMore:
            "Layer-first structures shine with clear module APIs; combine with feature tags or ownership metadata to preserve delivery focus.",
        }),
        defineOption("vertical-slice", "Vertical Slice", {
          whatIsIt:
            "Each increment is a thin end-to-end path through all layers for one capability, minimizing cross-cutting work in progress.",
          example:
            "Implementing 'export report' from UI through API to persistence in one cohesive change set.",
          structureExample: `src/
└── slices/
    ├── export-report/
    └── invite-user/`,
          bestFor:
            "Iterative delivery, training new contributors, and architectures that reward demonstrable working increments.",
          considerations:
            "Shared cross-feature refactors are harder to schedule; plan periodic horizontal consolidation passes.",
          recommendation:
            "Choose Vertical Slice when you want every milestone to prove a complete user outcome rather than a horizontal milestone.",
          learnMore:
            "Vertical slicing is as much a delivery pattern as a folder strategy; align PRs and reviews with user-visible slices.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "The team defines a bespoke folder and ownership model tailored to organizational constraints, monorepo tooling, or legacy boundaries.",
          example:
            "A monorepo with packages per business unit and an internal RFC describing where new code must land.",
          structureExample: `(your RFC defines layout)
packages/
├── billing/
├── shipping/
└── platform/`,
          bestFor:
            "Mature organizations merging codebases, regulated partitions, or unique monorepo constraints.",
          considerations:
            "Custom schemes fail without written standards and automated checks; undocumented layouts regress quickly.",
          recommendation:
            "Choose Custom when no catalog pattern fits but you can commit to documented rules and enforcement tooling.",
          learnMore:
            "Custom organization succeeds with an architecture decision record, examples for new code, and lint or codegen guardrails.",
        }),
      ],
    },
    {
      id: "business-modeling",
      title: "Business Modeling",
      description: "Defines how domain concepts and workflows are represented in software.",
      question: "How should the business be modeled?",
      options: [
        defineOption("domain-driven-design", "Domain-Driven Design", {
          whatIsIt:
            "The model centers on ubiquitous language, bounded contexts, aggregates, and explicit domain events reflecting how the business actually operates.",
          example:
            "Separate contexts for shipping and billing with an anti-corruption layer translating between their vocabularies.",
          structureExample: `contexts/
├── shipping/
│   ├── domain/
│   └── application/
├── billing/
└── shared-kernel/`,
          bestFor:
            "Complex domains with evolving rules, multiple stakeholders, and long-lived products where language drift causes defects.",
          considerations:
            "Requires facilitation, modeling workshops, and discipline to avoid ceremonial DDD folders without real boundaries.",
          recommendation:
            "Choose Domain-Driven Design when misunderstanding the business is a bigger risk than misunderstanding the infrastructure.",
          learnMore:
            "DDD emphasizes context boundaries and invariants; start with a glossary and map contexts before writing infrastructure code.",
        }),
        defineOption("crud-oriented", "CRUD-Oriented", {
          whatIsIt:
            "Entities map closely to database tables with create, read, update, and delete operations as the primary interaction model.",
          example:
            "An admin panel managing products, categories, and users with forms mirroring table columns.",
          structureExample: `modules/
├── products/
├── categories/
└── users/`,
          bestFor:
            "Data administration tools, simple internal apps, and domains where tables accurately capture business truth.",
          considerations:
            "Workflows spanning multiple entities may scatter across controllers unless you add explicit process layers.",
          recommendation:
            "Choose CRUD-Oriented when the product is primarily about managing records with straightforward lifecycles.",
          learnMore:
            "CRUD models are fast to build; introduce application services when operations no longer fit single-table semantics.",
        }),
        defineOption("event-driven", "Event-Driven", {
          whatIsIt:
            "State changes propagate as events that downstream handlers process asynchronously, enabling loose coupling and temporal decoupling.",
          example:
            "An order-placed event triggers inventory reservation, email notifications, and analytics without a single orchestrating transaction.",
          structureExample: `domain/
├── aggregates/
events/
└── handlers/`,
          bestFor:
            "Integrations, audit trails, scalable side effects, and systems where reactions to change matter as much as the change itself.",
          considerations:
            "Event ordering, idempotency, dead-letter handling, and debugging distributed flows require mature tooling.",
          recommendation:
            "Choose Event-Driven when multiple subsystems must react to the same facts without tight synchronous coupling.",
          learnMore:
            "Event-driven design documents schemas, versioning, and delivery semantics; treat events as contracts with consumers.",
        }),
        defineOption("traditional", "Traditional", {
          whatIsIt:
            "A pragmatic mix of layered services, transactional scripts, and incremental modeling without strict DDD or event-native patterns.",
          example:
            "Service classes coordinating repository calls with occasional background jobs for slow side effects.",
          structureExample: `services/
├── OrderService
└── UserService
repositories/
models/`,
          bestFor:
            "Teams delivering business value quickly with familiar patterns and moderate domain complexity.",
          considerations:
            "Without periodic refactoring, traditional layers can ossify into big-ball-of-mud services.",
          recommendation:
            "Choose Traditional when team familiarity and delivery speed outweigh investing in specialized modeling disciplines upfront.",
          learnMore:
            "Traditional modeling works with regular refactors; extract bounded modules when services exceed a coherent responsibility.",
        }),
      ],
    },
    {
      id: "software-architecture",
      title: "Software Architecture",
      description: "Defines the overarching structural style of the application.",
      question: "Which architectural style best fits the project?",
      options: [
        defineOption("clean-architecture", "Clean Architecture", {
          whatIsIt:
            "Dependencies point inward toward domain entities, with use cases orchestrating rules and outer layers handling UI and infrastructure.",
          example:
            "A use case that depends only on interfaces for persistence, tested without a database or HTTP server.",
          bestFor:
            "Long-lived products where testability and swap-friendly infrastructure matter more than minimal folder count.",
          considerations:
            "Boilerplate and interface proliferation can slow early MVPs if applied dogmatically to every feature.",
          recommendation:
            "Choose Clean Architecture when you expect multiple UIs or infrastructure changes over the product lifetime.",
          learnMore:
            "Clean architecture enforces dependency rule: inner circles know nothing of frameworks; adopt incrementally per bounded module.",
        }),
        defineOption("hexagonal", "Hexagonal", {
          whatIsIt:
            "Ports and adapters isolate the application core from external systems, making inbound and outbound integrations symmetric plug-in points.",
          example:
            "A payment port implemented by different adapters for sandbox and production gateways without touching domain code.",
          bestFor:
            "Products with many integrations, test doubles, and environments that must swap infrastructure frequently.",
          considerations:
            "Adapter mapping and port granularity require team agreement to avoid an explosion of thin interfaces.",
          recommendation:
            "Choose Hexagonal when integration variability is high and the core workflow must stay stable across vendors.",
          learnMore:
            "Hexagonal style treats everything external as an adapter; design ports around domain needs, not vendor SDK shapes.",
        }),
        defineOption("modular-monolith", "Modular Monolith", {
          whatIsIt:
            "A single deployable unit divided into well-bounded modules with explicit public APIs and enforced dependency rules between modules.",
          example:
            "Separate modules for catalog and checkout sharing only published interfaces within one runtime process.",
          bestFor:
            "Teams wanting operational simplicity today with a credible path to extract services later.",
          considerations:
            "Modules decay without compile-time or lint enforcement; shared databases can still couple modules silently.",
          recommendation:
            "Choose Modular Monolith when you need one deployment but want clearer boundaries than a flat layered codebase.",
          learnMore:
            "Modular monoliths succeed with module-owned data and published APIs; treat cross-module calls like remote contracts.",
        }),
        defineOption("layered", "Layered", {
          whatIsIt:
            "Classic stacked layers—presentation, business, persistence—where each tier calls primarily the layer directly beneath it.",
          example:
            "Controllers invoking services that call repositories without skipping intermediate layers.",
          bestFor:
            "Straightforward business applications, teams new to architecture patterns, and frameworks that scaffold layers by default.",
          considerations:
            "Feature changes cross many layers; skipping layers for shortcuts erodes the model unless guarded by reviews.",
          recommendation:
            "Choose Layered when complexity is moderate and the team benefits from widely understood structural conventions.",
          learnMore:
            "Layered architecture is a baseline; strengthen with modules or vertical slices when cross-layer churn becomes painful.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "A tailored combination of patterns or an organization-specific reference architecture documented for this product line.",
          example:
            "An internal template blending modular monolith boundaries with event notifications for side effects only.",
          bestFor:
            "Enterprises with mandated reference architectures or products inheriting unique legacy constraints.",
          considerations:
            "Custom styles need living documentation; new hires cannot rely on textbook patterns alone.",
          recommendation:
            "Choose Custom when compliance or legacy integration mandates a house style not captured by standard catalog options.",
          learnMore:
            "Document the custom style with diagrams, allowed dependencies, and exemplar modules reviewed in architecture guilds.",
        }),
      ],
    },
    {
      id: "routing",
      title: "Routing",
      description: "Defines how users navigate between views and how URLs map to application state.",
      question: "How should application routing work?",
      options: [
        defineOption("app-router", "App Router", {
          whatIsIt:
            "Routing is colocated with the application tree using nested layouts, shared shells, and file- or config-driven route segments as the primary navigation model.",
          example:
            "A dashboard layout wrapping child routes for settings and billing with shared navigation and loading boundaries.",
          bestFor:
            "Products needing nested layouts, parallel routes, or server-aware navigation patterns in modern full-stack apps.",
          considerations:
            "Mental models differ from classic page-per-file routing; teams must align on layout composition and data loading boundaries.",
          recommendation:
            "Choose App Router when nested layouts, shared UI chrome, and colocated route handlers are central to the UX architecture.",
          learnMore:
            "App-router models treat routes as a component tree; define layout ownership and loading/error boundaries per segment.",
        }),
        defineOption("pages-router", "Pages Router", {
          whatIsIt:
            "Each URL maps to a discrete page module with a flatter routing model and explicit separation between page entry points.",
          example:
            "Distinct page files for /login, /dashboard, and /settings without nested layout files driving structure.",
          bestFor:
            "Simpler navigation graphs, incremental migrations, and teams preferring one entry file per route.",
          considerations:
            "Deeply nested UIs may duplicate layout wiring unless you introduce higher-order layout components manually.",
          recommendation:
            "Choose Pages Router when routes are mostly flat and predictable layout composition is handled in application code.",
          learnMore:
            "Pages-router patterns emphasize clear page ownership; centralize shared chrome via layout components rather than implicit file nesting.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "Navigation is implemented with a bespoke router, manual history management, or a domain-specific routing abstraction.",
          example:
            "A multi-step wizard or embedded micro-frontend orchestrator that does not map 1:1 to public URLs.",
          bestFor:
            "Embedded apps, non-URL-driven flows, legacy shells, or products with routing requirements outside conventional web patterns.",
          considerations:
            "You own deep linking, back-button semantics, analytics page names, and accessibility focus management.",
          recommendation:
            "Choose Custom when standard routing models fight your UX or hosting environment and you can invest in router maintenance.",
          learnMore:
            "Custom routing demands explicit specs for URL sync, browser history, and guard redirects tested across entry paths.",
        }),
      ],
    },
    {
      id: "server-state",
      title: "Server State",
      description: "Defines how remote data is fetched, cached, synchronized, and presented to users.",
      question: "How should server data behave?",
      options: [
        defineOption("simple", "Simple", {
          whatIsIt:
            "Data is fetched on demand with minimal caching; each navigation or action triggers straightforward requests without a global sync layer.",
          example:
            "Loading a profile on page mount and refetching after a successful save.",
          bestFor:
            "Small apps, rarely changing data, and teams prioritizing the simplest mental model over optimistic UX.",
          considerations:
            "Perceived performance and duplicate requests may suffer as screens multiply without deduplication.",
          recommendation:
            "Choose Simple when data volume is low and users tolerate loading indicators on most transitions.",
          learnMore:
            "Simple server state is easy to reason about; add targeted caching when profiling shows redundant network work.",
        }),
        defineOption("cached", "Cached", {
          whatIsIt:
            "Responses are stored in a client cache with staleness rules, background refresh, and deduplicated in-flight requests.",
          example:
            "A list view showing cached results instantly while revalidating in the background for freshness.",
          bestFor:
            "Interactive apps with repeated reads, dashboards, and patterns where snappy navigation improves satisfaction.",
          considerations:
            "Invalidation bugs cause subtle UI lies; define cache keys, TTLs, and mutation updates explicitly.",
          recommendation:
            "Choose Cached when read-heavy flows dominate and you can invest in invalidation policies per entity.",
          learnMore:
            "Cached server state separates staleness from correctness; document when UI must block on fresh data versus show stale-while-revalidate.",
        }),
        defineOption("realtime", "Realtime", {
          whatIsIt:
            "Server state updates propagate to clients through subscriptions or push channels, keeping views synchronized without manual refresh.",
          example:
            "A task board where assignment changes appear on all open clients within seconds.",
          bestFor:
            "Collaborative interfaces, live metrics, and domains where stale server state creates operational risk.",
          considerations:
            "Connection lifecycle, authorization per channel, and reconciling push events with local edits need explicit design.",
          recommendation:
            "Choose Realtime when multiple users depend on the same live dataset and polling would be too slow or expensive.",
          learnMore:
            "Realtime server state pairs push delivery with optimistic local updates and conflict policies for editable fields.",
        }),
        defineOption("offline-first", "Offline First", {
          whatIsIt:
            "Remote data is mirrored or queued locally so reads and writes proceed offline, synchronizing when connectivity returns.",
          example:
            "Draft messages stored locally and sent when the device reconnects, with conflict UI if versions diverge.",
          bestFor:
            "Field apps, travel modes, and workflows where connectivity interruption is expected during core tasks.",
          considerations:
            "Storage limits, encryption, merge strategies, and test matrices for sync edge cases add substantial complexity.",
          recommendation:
            "Choose Offline First when users must keep working with server-backed data without continuous network access.",
          learnMore:
            "Offline-first server state models explicit sync statuses and user-visible recovery for conflicts and failed uploads.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "A tailored combination of caching, sync, and transport patterns defined by product-specific consistency requirements.",
          example:
            "Read-only analytics cached aggressively while financial balances always fetch authoritatively with no client cache.",
          bestFor:
            "Products mixing public content, personalized data, and regulated records with different freshness rules.",
          considerations:
            "Custom policies are easy to get wrong without documentation; engineers need a decision matrix per entity type.",
          recommendation:
            "Choose Custom when no single server-state posture fits all entities and you can maintain a written consistency catalog.",
          learnMore:
            "Custom server-state design starts with a table of entities, freshness SLAs, offline behavior, and invalidation triggers.",
        }),
      ],
    },
    {
      id: "forms",
      title: "Forms",
      description: "Defines how users input, edit, and submit structured data.",
      question: "How should forms behave?",
      options: [
        defineOption("simple", "Simple", {
          whatIsIt:
            "Forms use basic controlled inputs with local state and submit-on-save semantics without multi-step orchestration.",
          example:
            "A contact form with name, email, and message validated on submit.",
          bestFor:
            "Low-field-count screens, admin tweaks, and flows where users complete entry in one sitting.",
          considerations:
            "Growing field count increases rerenders and error handling scatter unless you introduce form libraries later.",
          recommendation:
            "Choose Simple when forms are short, infrequent, and do not require draft persistence or branching logic.",
          learnMore:
            "Simple forms favor explicit submit handlers; extract reusable field components when the same inputs repeat across screens.",
        }),
        defineOption("advanced", "Advanced", {
          whatIsIt:
            "Forms support field-level validation, dependent fields, dynamic arrays, autosave or dirty tracking, and accessible error summaries.",
          example:
            "An employee editor where department selection filters role options and validates uniqueness on blur.",
          bestFor:
            "Business applications with medium complexity, frequent edits, and power users who expect keyboard-efficient entry.",
          considerations:
            "State management and validation timing (blur vs change vs submit) must be consistent to avoid frustrating UX.",
          recommendation:
            "Choose Advanced when most screens collect structured data with interdependent fields and recovery from errors matters.",
          learnMore:
            "Advanced forms benefit from a standard pattern for defaults, dirty state, async validation, and accessible error announcement.",
        }),
        defineOption("wizard", "Wizard", {
          whatIsIt:
            "Long processes split into guided steps with progress indication, per-step validation, and optional save-and-resume.",
          example:
            "An onboarding flow collecting account, team, and billing details across three validated steps.",
          bestFor:
            "High cognitive load tasks, compliance checkpoints, and users who need contextual help per stage.",
          considerations:
            "Back-navigation state, partial saves, and abandonment analytics require explicit product design.",
          recommendation:
            "Choose Wizard when breaking a long form into steps measurably improves completion and error rates.",
          learnMore:
            "Wizard flows should persist progress safely and show clear recovery if users leave mid-process.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Forms support approvals, audit trails, role-based field visibility, bulk import/export, and integration with workflow engines.",
          example:
            "A purchase request form routing through manager approval with immutable history of field changes.",
          bestFor:
            "Regulated industries, B2B procurement, and organizations requiring segregation of duties on data entry.",
          considerations:
            "Implementation and testing costs rise sharply; every field may need ownership, masking, and retention rules.",
          recommendation:
            "Choose Enterprise when submissions trigger workflows, legal record-keeping, or field-level authorization requirements.",
          learnMore:
            "Enterprise forms treat each submission as a record with provenance; design for review queues and non-repudiation.",
        }),
      ],
    },
    {
      id: "validation",
      title: "Validation",
      description: "Defines how incoming and outgoing data is checked for correctness.",
      question: "How should data be validated?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "Validation covers required fields, simple formats, and length checks, often duplicated lightly at client and server boundaries.",
          example:
            "Ensuring email contains @ and password meets minimum length before accepting registration.",
          bestFor:
            "MVPs, internal tools, and domains with few cross-field rules.",
          considerations:
            "Business rules scattered as ad hoc if checks proliferate without a shared validation vocabulary.",
          recommendation:
            "Choose Basic when invalid data has low blast radius and rules rarely span multiple fields or services.",
          learnMore:
            "Basic validation should still run on the server; client checks are for UX, not security boundaries.",
        }),
        defineOption("schema-based", "Schema Based", {
          whatIsIt:
            "Structured schemas define shapes, types, and constraints shared or mirrored across client and server validation paths.",
          example:
            "A single schema describing address fields used to validate API payloads and form input consistently.",
          bestFor:
            "API-driven products, typed codebases, and teams reducing drift between frontend and backend contracts.",
          considerations:
            "Schemas express structure well but may need complementary logic for contextual or stateful business rules.",
          recommendation:
            "Choose Schema Based when shape validation is substantial and consistency across layers prevents defect classes.",
          learnMore:
            "Schema validation composes with business rules; keep schemas focused on structure and formats, not workflow policy.",
        }),
        defineOption("business-rules", "Business Rules", {
          whatIsIt:
            "Validation encodes domain policies—eligibility, quotas, temporal rules—that require context beyond static shape checking.",
          example:
            "Rejecting a discount when cart total and customer tier combine in ways schemas alone cannot express.",
          bestFor:
            "Financial, healthcare, and operational domains where correctness depends on live domain state.",
          considerations:
            "Rules need centralized expression and tests; duplicating policy in UI and services causes expensive inconsistencies.",
          recommendation:
            "Choose Business Rules when invalid operations have financial, legal, or safety consequences beyond malformed input.",
          learnMore:
            "Business-rule validation belongs in domain modules with executable examples; UI mirrors outcomes, not reimplemented logic.",
        }),
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      description: "Defines how users prove identity to access the application.",
      question: "What authentication strategy should the application support?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "Email and password or similar credential-based login with standard session or token issuance and password recovery flows.",
          example:
            "Users register with email, verify via link, and sign in with password to receive a session cookie.",
          bestFor:
            "B2B and B2C products without social login requirements and teams wanting full control of the auth UX.",
          considerations:
            "You must implement secure storage, rate limiting, MFA roadmap, and compliance for credential breaches.",
          recommendation:
            "Choose Basic when a straightforward owned identity model fits users and regulatory constraints allow password auth.",
          learnMore:
            "Basic authentication still demands modern security hygiene: hashing, rotation, breach detection, and clear session expiration.",
        }),
        defineOption("social", "Social", {
          whatIsIt:
            "Users sign in through third-party identity providers, delegating primary authentication to external OAuth or OpenID flows.",
          example:
            "Continue with Google or Apple buttons creating or linking a local user profile on first login.",
          bestFor:
            "Consumer apps optimizing signup friction and audiences already comfortable with major identity providers.",
          considerations:
            "Provider outages, account linking edge cases, and enterprise customers blocking social login must be planned for.",
          recommendation:
            "Choose Social when reducing signup steps materially improves conversion and your audience expects federated login.",
          learnMore:
            "Social auth requires robust account linking, email verification fallbacks, and clear data usage disclosures.",
        }),
        defineOption("passwordless", "Passwordless", {
          whatIsIt:
            "Authentication relies on magic links, one-time codes, passkeys, or WebAuthn without users maintaining passwords.",
          example:
            "Users enter email, receive a time-limited code, and gain a session without ever setting a password.",
          bestFor:
            "Mobile-first products, security-conscious teams reducing credential reuse risk, and simplified support burdens.",
          considerations:
            "Email/SMS deliverability, device binding, and recovery when users lose access to factors need clear playbooks.",
          recommendation:
            "Choose Passwordless when eliminating password management improves security posture and user experience together.",
          learnMore:
            "Passwordless flows should rate-limit attempts, expire tokens quickly, and offer supervised recovery for account lockout.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Authentication integrates with corporate identity via SSO, SAML, OIDC, SCIM provisioning, and mandatory MFA policies.",
          example:
            "Customers log in through their Okta tenant with enforced MFA and automatic deprovisioning when HR offboards staff.",
          bestFor:
            "Selling to enterprises, regulated industries, and products where IT departments mandate centralized identity.",
          considerations:
            "Per-tenant configuration, metadata trust, certificate rotation, and support for multiple IdPs increase implementation scope.",
          recommendation:
            "Choose Enterprise when contracts require customer-controlled identity, audit logs, and automated user lifecycle management.",
          learnMore:
            "Enterprise authentication is a product feature: document onboarding runbooks, attribute mapping, and failure diagnostics per tenant.",
        }),
      ],
    },
    {
      id: "authorization",
      title: "Authorization",
      description: "Defines how access to resources and actions is granted or denied.",
      question: "How should permissions be managed?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "A small fixed set of roles or boolean flags determines access, checked at route or handler boundaries.",
          example:
            "Admin users can access settings; standard users cannot.",
          bestFor:
            "Early products, two-tier access models, and internal tools with simple ownership rules.",
          considerations:
            "Role explosion begins as soon as customers request custom permissions; plan migration before selling B2B broadly.",
          recommendation:
            "Choose Basic when only a handful of access levels exist and custom per-customer policy is out of scope.",
          learnMore:
            "Basic authorization should still centralize checks; avoid scattering string role comparisons throughout the codebase.",
        }),
        defineOption("role-based", "Role Based", {
          whatIsIt:
            "Permissions attach to named roles assigned to users, often scoped by organization or workspace membership.",
          example:
            "Editor, viewer, and billing-admin roles within a team workspace with predefined capability bundles.",
          bestFor:
            "SaaS teamwork products, admin consoles, and models where customers understand job-function roles.",
          considerations:
            "Coarse roles may not fit fine-grained needs; combining roles with resource scopes becomes necessary at scale.",
          recommendation:
            "Choose Role Based when customers reason about access in terms of job functions rather than individual grants.",
          learnMore:
            "RBAC succeeds with a published permission matrix and tooling for admins to assign roles without developer intervention.",
        }),
        defineOption("policy-based", "Policy Based", {
          whatIsIt:
            "Authorization decisions evaluate policies against user attributes, resource metadata, and context at runtime.",
          example:
            "Allow edit only if user owns the document or belongs to the workspace with an editor attribute and document is not locked.",
          bestFor:
            "Fine-grained sharing, dynamic conditions, and products where static roles cannot capture real access needs.",
          considerations:
            "Policy authoring UX, testability, and performance of evaluation engines require deliberate investment.",
          recommendation:
            "Choose Policy Based when access depends on resource state and relationships, not just global role membership.",
          learnMore:
            "Policy-based systems document decision logs and provide simulation tools so admins understand why access was denied.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Authorization supports custom roles, segregation of duties, approval workflows, attribute sync from identity providers, and compliance reporting.",
          example:
            "Customers define custom roles mapped from IdP groups with quarterly access review exports for auditors.",
          bestFor:
            "Large B2B contracts, regulated environments, and multi-tenant products with per-tenant policy customization.",
          considerations:
            "Implementation, support, and security review surfaces expand; misconfiguration by customers becomes your incident risk.",
          recommendation:
            "Choose Enterprise when buyers require customizable governance, audit exports, and integration with their GRC processes.",
          learnMore:
            "Enterprise authorization pairs technical enforcement with admin UX for role design, simulation, and periodic recertification.",
        }),
      ],
    },
    {
      id: "database",
      title: "Database",
      description: "Defines the persistence strategy for structured application data.",
      question: "What database strategy best fits the project?",
      options: [
        defineOption("relational", "Relational", {
          whatIsIt:
            "Normalized tables with ACID transactions, constraints, and SQL-oriented querying as the primary persistence approach.",
          example:
            "Ledger entries and accounts stored with foreign keys ensuring balances reconcile across related rows.",
          bestFor:
            "Financial data, reporting, and domains requiring joins, aggregations, and strict integrity.",
          considerations:
            "Schema migrations and connection pooling must be operationalized; very high write shards may need later partitioning.",
          recommendation:
            "Choose Relational when transactional correctness and relational queries are non-negotiable for core entities.",
          learnMore:
            "Relational strategy emphasizes migrations, indexing discipline, and clear transactional boundaries per use case.",
        }),
        defineOption("document", "Document", {
          whatIsIt:
            "Flexible document records store nested structures optimized for aggregate reads and iterative schema evolution.",
          example:
            "Product catalogs with variant attributes that differ by category stored in nested documents.",
          bestFor:
            "Content platforms, configuration-heavy entities, and read patterns that fetch whole documents at once.",
          considerations:
            "Multi-document transactions and relational reporting may require secondary pipelines or denormalization.",
          recommendation:
            "Choose Document when entity shapes evolve quickly and access aligns with document boundaries.",
          learnMore:
            "Document databases reward aggregate-oriented design; plan indexing for query paths, not hypothetical relational reports.",
        }),
        defineOption("hybrid", "Hybrid", {
          whatIsIt:
            "Multiple persistence engines serve different subdomains—relational for money, document for content, cache for sessions.",
          example:
            "Transactional orders in a relational store with search indexes fed asynchronously from document snapshots.",
          bestFor:
            "Products whose read/write patterns genuinely differ across subsystems.",
          considerations:
            "Data synchronization, operational runbooks, and developer cognitive load increase with each additional store.",
          recommendation:
            "Choose Hybrid when a single engine forces painful compromises proven by workload characterization.",
          learnMore:
            "Hybrid persistence requires a source-of-truth map and integration patterns for each cross-store workflow.",
        }),
        defineOption("distributed", "Distributed", {
          whatIsIt:
            "Data is partitioned across nodes or regions with distributed consensus, replication, and partition tolerance as first-class concerns.",
          example:
            "Globally replicated user sessions with regional reads and cross-region failover objectives.",
          bestFor:
            "High availability mandates, geographic latency targets, and scale beyond single-node limits.",
          considerations:
            "CAP tradeoffs, operational expertise, and consistency models must be understood by the whole engineering team.",
          recommendation:
            "Choose Distributed when uptime, scale, or geographic distribution requirements exceed single-cluster relational limits.",
          learnMore:
            "Distributed database strategy documents RPO/RTO, consistency per operation, and failure drills before production traffic.",
        }),
      ],
    },
    {
      id: "storage",
      title: "Storage",
      description: "Defines how files, media, and unstructured content are stored and accessed.",
      question: "How should files be managed?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "User uploads land in object storage with simple URLs or signed links and minimal metadata beyond filename and size.",
          example:
            "Profile avatars uploaded to a bucket and referenced by HTTPS URL in the user record.",
          bestFor:
            "Products with low file volume, few compliance constraints, and no versioning requirements.",
          considerations:
            "Virus scanning, access expiration, and MIME validation are still advisable even in basic mode.",
          recommendation:
            "Choose Basic when files are ancillary to core workflows and lifecycle needs are upload-and-serve.",
          learnMore:
            "Basic file storage should use private buckets with signed access rather than permanently public URLs for user content.",
        }),
        defineOption("media", "Media", {
          whatIsIt:
            "Storage pipelines handle images, audio, or video with transcoding, thumbnails, adaptive delivery, and metadata extraction.",
          example:
            "Uploaded videos generate multiple bitrate renditions and poster images for streaming playback.",
          bestFor:
            "Content platforms, education products, and marketing tools where rich media is central to the experience.",
          considerations:
            "Processing queues, CDN configuration, copyright moderation, and storage costs scale with usage quickly.",
          recommendation:
            "Choose Media when delivery performance and format variety materially affect user engagement.",
          learnMore:
            "Media storage architectures separate hot delivery via CDN from cold archival and track processing job status visibly.",
        }),
        defineOption("document-management", "Document Management", {
          whatIsIt:
            "Files support versioning, folders, metadata tags, full-text search, and collaborative editing or commenting workflows.",
          example:
            "Contract repository with version history, approval status, and full-text search across PDF content.",
          bestFor:
            "Legal, HR, and operations products where documents are primary business artifacts.",
          considerations:
            "Retention policies, legal hold, OCR quality, and permission inheritance across folders add complexity.",
          recommendation:
            "Choose Document Management when files are regulated records requiring lifecycle governance, not just static blobs.",
          learnMore:
            "Document systems model immutable versions, audit who viewed or changed files, and integrate search with authorization.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Storage integrates with DLP scanning, customer-managed keys, geo residency, legal export, and enterprise content connectors.",
          example:
            "Tenant-isolated storage with BYOK encryption and e-discovery export for compliance investigations.",
          bestFor:
            "Large B2B deals, highly regulated data, and customers mandating control over encryption and region.",
          considerations:
            "Per-tenant configuration, key rotation incidents, and support for legacy ECM integrations expand operational burden.",
          recommendation:
            "Choose Enterprise when contracts specify encryption ownership, data residency, or forensic export capabilities.",
          learnMore:
            "Enterprise storage treats blobs as governed assets with classification labels, retention schedules, and provable access logs.",
        }),
      ],
    },
    {
      id: "tables",
      title: "Tables",
      description: "Defines how tabular data is presented, sorted, filtered, and acted upon in the UI.",
      question: "How should data tables behave?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "Tables display paginated rows with simple sorting and row actions without advanced filtering or personalization.",
          example:
            "A user list with name, email, role, and an edit button on each row.",
          bestFor:
            "Small datasets, admin screens with infrequent use, and MVPs validating domain workflows.",
          considerations:
            "Performance and usability degrade as row counts grow without server-side pagination and column controls.",
          recommendation:
            "Choose Basic when datasets stay small and users do not need saved views or bulk operations.",
          learnMore:
            "Basic tables should still support accessible headers, keyboard navigation, and server pagination when rows exceed a few dozen.",
        }),
        defineOption("advanced", "Advanced", {
          whatIsIt:
            "Tables offer column sorting, filtering, search, density controls, row selection, and export for power users.",
          example:
            "An orders table filterable by date range and status with multi-select for bulk status updates.",
          bestFor:
            "Operations teams, analytics-lite workflows, and products where users live in list views daily.",
          considerations:
            "Filter state in URLs, performance of wide tables, and consistent empty states need intentional design.",
          recommendation:
            "Choose Advanced when list views are primary workspaces and users expect spreadsheet-like productivity.",
          learnMore:
            "Advanced tables separate UI state from server query parameters; document which filters are server-driven versus client-side.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Tables support saved views, column-level permissions, audit of exports, inline editing with validation, and very large dataset virtualization.",
          example:
            "A compliance queue where analysts save filtered views, export with watermarking, and edit status inline with approvals.",
          bestFor:
            "Regulated operations, call centers, and B2B apps where tabular work is mission-critical.",
          considerations:
            "Export governance, PII masking per role, and virtualization bugs are high-impact; testing load is substantial.",
          recommendation:
            "Choose Enterprise when tabular interfaces are production floors requiring governance, scale, and personalization.",
          learnMore:
            "Enterprise tables combine performance engineering with security: every column and export path respects authorization policy.",
        }),
      ],
    },
    {
      id: "testing",
      title: "Testing",
      description: "Defines the depth and breadth of automated quality checks.",
      question: "What testing strategy should the project adopt?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "Automated coverage focuses on a handful of critical paths with mostly manual QA for regressions.",
          example:
            "Smoke tests for login and checkout plus manual release checklists.",
          bestFor:
            "Early MVPs, throwaway prototypes, and teams with very small QA bandwidth.",
          considerations:
            "Regression risk grows quickly; refactors become scary without broader safety nets.",
          recommendation:
            "Choose Basic only as a temporary posture with a dated plan to expand coverage on revenue-critical flows.",
          learnMore:
            "Basic testing should still automate the few flows that would halt business if broken; document manual checklist ownership.",
        }),
        defineOption("balanced", "Balanced", {
          whatIsIt:
            "A pyramid mix of unit tests for domain logic, integration tests for APIs, and targeted end-to-end tests for core journeys.",
          example:
            "Unit tests for pricing rules, API tests for order creation, and E2E for signup-to-purchase.",
          bestFor:
            "Most production SaaS products balancing confidence, speed, and maintenance cost.",
          considerations:
            "Flaky E2E tests erode trust; invest in test data factories and stable selectors.",
          recommendation:
            "Choose Balanced when you need reliable releases without enterprise audit overhead on test traceability.",
          learnMore:
            "Balanced testing prioritizes fast feedback on domain rules and reserves E2E for irreplaceable user journeys.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Testing includes contract tests, performance baselines, security scans, mutation testing, and traceability from requirements to cases.",
          example:
            "Release gates requiring performance regression thresholds, penetration scan clearance, and signed test evidence for auditors.",
          bestFor:
            "Regulated industries, safety-critical systems, and large teams with formal quality engineering functions.",
          considerations:
            "Pipeline time, fixture complexity, and tooling licenses increase; teams need dedicated QA platform support.",
          recommendation:
            "Choose Enterprise when compliance or incident blast radius mandates demonstrable, traceable test evidence per release.",
          learnMore:
            "Enterprise testing treats CI as a quality system with ownership, SLAs on flaky tests, and metrics on escaped defects.",
        }),
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring",
      description: "Defines how runtime health, errors, and performance are observed in production.",
      question: "How should the application be monitored?",
      options: [
        defineOption("basic", "Basic", {
          whatIsIt:
            "Uptime checks, error logging, and simple alerts on fatal failures provide minimal production visibility.",
          example:
            "Health endpoint pings plus email alerts when error rate spikes above a threshold.",
          bestFor:
            "Early launches, internal tools, and products with forgiving uptime requirements.",
          considerations:
            "Diagnosing subtle performance degradation or user-specific failures is slow without richer telemetry.",
          recommendation:
            "Choose Basic when operational staff can tolerate manual investigation and traffic is low.",
          learnMore:
            "Basic monitoring still needs structured logs and alert runbooks; avoid alert channels that everyone ignores.",
        }),
        defineOption("observability", "Observability", {
          whatIsIt:
            "Metrics, distributed traces, and structured logs correlate to explain behavior across services and user sessions.",
          example:
            "Tracing a slow checkout across API, payment adapter, and database with exemplar logs tied to trace IDs.",
          bestFor:
            "Multi-service systems, performance-sensitive UX, and teams practicing SRE-style incident response.",
          considerations:
            "Cardinality costs, PII in logs, and instrumentation consistency require platform guidelines.",
          recommendation:
            "Choose Observability when mean time to resolution depends on correlating signals across components.",
          learnMore:
            "Observability adopts consistent trace context propagation and dashboards tied to user-impacting SLIs, not only CPU graphs.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Monitoring integrates SIEM, anomaly detection, SLO error budgets, on-call rotations, and compliance retention for audit.",
          example:
            "Tier-1 services with quarterly SLO reviews, paging policies, and immutable audit logs retained per contract.",
          bestFor:
            "Mission-critical products, regulated data, and organizations with formal incident management programs.",
          considerations:
            "Tooling cost, on-call burnout risk, and data residency for telemetry must be managed proactively.",
          recommendation:
            "Choose Enterprise when contracts define uptime targets, audit access to logs, or mandated incident reporting timelines.",
          learnMore:
            "Enterprise monitoring links technical SLIs to business impact reviews and post-incident learning across departments.",
        }),
      ],
    },
    {
      id: "deployment",
      title: "Deployment",
      description: "Defines how builds are promoted to production and managed over time.",
      question: "How should deployments be managed?",
      options: [
        defineOption("simple", "Simple", {
          whatIsIt:
            "Deployments are manual or semi-automated with a single production environment and straightforward rollback by redeploying prior artifacts.",
          example:
            "Merge to main triggers a script that ships the latest build to one production server.",
          bestFor:
            "Solo developers, internal pilots, and products with low release frequency.",
          considerations:
            "Downtime during deploys and risky rollbacks increase as traffic and schema migrations grow.",
          recommendation:
            "Choose Simple when release cadence is weekly or slower and downtime windows are acceptable.",
          learnMore:
            "Simple deployment still benefits from immutable artifacts and tagged releases so rollbacks are reproducible.",
        }),
        defineOption("professional", "Professional", {
          whatIsIt:
            "CI/CD pipelines run tests, build artifacts, promote through staging, and deploy with blue-green or rolling strategies.",
          example:
            "Automated pipeline deploying to staging on merge, manual approval, then rolling update to production.",
          bestFor:
            "Growing teams shipping multiple times per week who need predictable, low-drama releases.",
          considerations:
            "Database migrations, feature flags, and configuration drift between environments need pipeline discipline.",
          recommendation:
            "Choose Professional when frequent releases and staged validation are expected but multi-region orchestration is not yet required.",
          learnMore:
            "Professional deployment pairs automated gates with environment parity and documented rollback for schema and application changes.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Deployments span regions with canary analysis, automated rollback, change advisory integration, and segregation of duties on production access.",
          example:
            "Canary release to 5% traffic with automatic rollback on error budget burn plus CAB-approved maintenance windows.",
          bestFor:
            "High-traffic products, strict change management, and organizations with zero-downtime mandates.",
          considerations:
            "Pipeline complexity, approval latency, and per-region configuration multiply operational responsibilities.",
          recommendation:
            "Choose Enterprise when downtime costs, compliance change controls, or global traffic require advanced release engineering.",
          learnMore:
            "Enterprise deployment treats releases as risk-managed events with measurable canary criteria and audited promotion actions.",
        }),
      ],
    },
  ],
};
