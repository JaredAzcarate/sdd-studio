import { defineOption } from "./helpers.js";
import type { EngineeringSection } from "../types.js";

export const engineeringPrinciplesSection: EngineeringSection = {
  id: "principles",
  title: "Engineering Principles",
  description:
    "Technology-agnostic principles that describe what the system should become, not how it will be implemented.",
  questions: [
    {
      id: "product-type",
      title: "Product Type",
      description: "Defines the nature of the software being built.",
      question: "What type of product are you building?",
      options: [
        defineOption("application", "Application", {
          whatIsIt:
            "A focused software product that solves a specific problem for a defined audience. It delivers end-user value through a cohesive set of features rather than hosting other products.",
          example:
            "A project management tool for small teams, a personal finance tracker, or an internal approval workflow for a department.",
          bestFor:
            "Products with a clear scope, a primary user journey, and a single business outcome to optimize.",
          considerations:
            "Growth into a platform later may require refactoring boundaries, APIs, and tenancy models that were not needed at launch.",
          recommendation:
            "Choose Application when the goal is to ship a complete product experience without exposing extensibility or multi-tenant infrastructure from day one.",
          learnMore:
            "Product thinking distinguishes a single-purpose offering from a foundation others build on; start with the smallest definition of success for your users.",
        }),
        defineOption("platform", "Platform", {
          whatIsIt:
            "A foundation that other products, teams, or third parties build upon or integrate with. It emphasizes extensibility, shared capabilities, and governance across multiple consumers.",
          example:
            "A marketplace that hosts vendor apps, an internal developer platform, or an API ecosystem where partners create integrations.",
          bestFor:
            "Organizations that need reuse, standardization, or external extensibility as a core business model.",
          considerations:
            "Platforms demand stronger contracts, versioning, documentation, and operational maturity before the first external consumer depends on you.",
          recommendation:
            "Choose Platform when extensibility, multi-tenant boundaries, or third-party integration is central to the business—not an afterthought.",
          learnMore:
            "Platform design focuses on stable interfaces, lifecycle management, and clear ownership between core capabilities and consumer experiences.",
        }),
      ],
    },
    {
      id: "primary-platform",
      title: "Primary Platform",
      description: "Defines where the product will primarily run.",
      question: "What is the primary platform?",
      options: [
        defineOption("web", "Web", {
          whatIsIt:
            "The product is delivered through browsers and reachable via URLs without installation. Distribution and updates happen centrally on the server side.",
          example:
            "A SaaS dashboard accessed from Chrome, a customer portal, or a marketing site with authenticated areas.",
          bestFor:
            "Broad reach, fast iteration, and teams that want a single deployable surface for most users.",
          considerations:
            "Browser capabilities, performance on low-end devices, and offline needs must be evaluated explicitly rather than assumed.",
          recommendation:
            "Choose Web when instant access, centralized updates, and cross-device reach matter more than deep OS integration.",
          learnMore:
            "Web-first products benefit from linkable flows, progressive enhancement, and a deployment model that does not require store approvals.",
        }),
        defineOption("desktop", "Desktop", {
          whatIsIt:
            "The product runs as a native or hybrid desktop application installed on the user's machine. It can leverage local resources, filesystem access, and OS-level integrations.",
          example:
            "A code editor, a design tool, or an offline-capable data analysis client for power users.",
          bestFor:
            "Workflows that need persistent local performance, large files, or tight integration with the operating system.",
          considerations:
            "You inherit packaging, auto-update, code signing, and per-OS testing responsibilities that web-only products avoid.",
          recommendation:
            "Choose Desktop when local compute, filesystem access, or long-running sessions are essential to the core experience.",
          learnMore:
            "Desktop delivery trades universal URL access for deeper device integration; plan release channels and update mechanics early.",
        }),
        defineOption("mobile", "Mobile", {
          whatIsIt:
            "The product is optimized for phones and tablets, using mobile interaction patterns, notifications, and device sensors as first-class concerns.",
          example:
            "A field-service app for technicians, a consumer loyalty app, or a on-the-go expense capture tool.",
          bestFor:
            "Use cases where mobility, push alerts, camera, GPS, or short frequent sessions define the user experience.",
          considerations:
            "Store policies, fragmented device sizes, background execution limits, and connectivity variability shape architecture decisions.",
          recommendation:
            "Choose Mobile when the primary user context is away from a desk and device-native affordances drive the value proposition.",
          learnMore:
            "Mobile-first design prioritizes touch targets, intermittent connectivity, and lifecycle events like backgrounding and permissions.",
        }),
        defineOption("multi-platform", "Multi-platform", {
          whatIsIt:
            "The product must deliver a consistent experience across web, desktop, and/or mobile from a shared product vision. Platform differences are managed deliberately rather than accidentally.",
          example:
            "A note-taking product with web, desktop, and mobile clients that share accounts and synchronized content.",
          bestFor:
            "Products whose users expect continuity across devices and contexts without sacrificing platform-appropriate UX.",
          considerations:
            "Shared abstractions can speed delivery but may force compromises unless you budget for platform-specific polish.",
          recommendation:
            "Choose Multi-platform when user journeys legitimately span devices and parity—or thoughtful divergence—is a product requirement.",
          learnMore:
            "Multi-platform strategy requires explicit decisions about shared domain logic, design systems, and release coordination across surfaces.",
        }),
      ],
    },
    {
      id: "code-sharing",
      title: "Code Sharing",
      description: "Defines how much code should be shared across platforms.",
      question: "How much code should be shared between platforms?",
      options: [
        defineOption("low", "Low", {
          whatIsIt:
            "Each platform maintains largely independent codebases with minimal shared modules. Shared pieces are limited to small utilities or contracts.",
          example:
            "Separate web and mobile apps that only share API client types and branding tokens.",
          bestFor:
            "Teams optimizing for platform-native UX or when platforms diverge significantly in capabilities and release cadence.",
          considerations:
            "Business rules duplicated across codebases can drift unless you invest in contract tests or a shared specification layer.",
          recommendation:
            "Choose Low when platform-specific quality outweighs unified delivery speed and the teams can own surfaces independently.",
          learnMore:
            "Low sharing maximizes local control; compensate with strong API contracts and documented domain rules to prevent silent divergence.",
        }),
        defineOption("medium", "Medium", {
          whatIsIt:
            "Core domain logic, validation rules, and data models are shared while presentation and platform integrations remain separate.",
          example:
            "A shared package for pricing calculations and entitlement checks consumed by web and mobile front ends.",
          bestFor:
            "Products that need consistent business behavior across surfaces without forcing a single UI toolkit everywhere.",
          considerations:
            "Shared packages become internal products—they need versioning, testing, and clear ownership to avoid becoming a bottleneck.",
          recommendation:
            "Choose Medium when behavioral consistency matters more than UI uniformity and you can govern shared libraries well.",
          learnMore:
            "A medium-sharing model draws a boundary: share what must not diverge (rules, models), isolate what should differ (UI, OS APIs).",
        }),
        defineOption("maximum", "Maximum", {
          whatIsIt:
            "A single codebase targets multiple platforms with shared UI and logic layers, accepting trade-offs for uniformity and delivery speed.",
          example:
            "One repository producing web and mobile builds from shared screens and navigation patterns.",
          bestFor:
            "Small teams, MVPs, and products where speed to multiple platforms beats pixel-perfect native feel.",
          considerations:
            "Performance tuning, accessibility nuances, and store guidelines may require escape hatches or platform branches over time.",
          recommendation:
            "Choose Maximum when time-to-market across platforms is critical and users tolerate some platform-generic patterns.",
          learnMore:
            "Maximum sharing treats the codebase as the product; invest early in modular boundaries so platform-specific overrides stay possible.",
        }),
      ],
    },
    {
      id: "backend-strategy",
      title: "Backend Strategy",
      description: "Defines the role of the backend.",
      question: "How should the backend be structured?",
      options: [
        defineOption("integrated", "Integrated", {
          whatIsIt:
            "Server and client logic ship together in a unified application boundary. Data fetching, rendering, and APIs evolve as one deployable unit.",
          example:
            "A product where pages and server endpoints live in the same project and deploy atomically.",
          bestFor:
            "Early-stage products, small teams, and workflows where simplicity of deployment beats independent scaling.",
          considerations:
            "Scaling frontend and backend independently becomes harder; long-running jobs may compete with request handling unless separated later.",
          recommendation:
            "Choose Integrated when team size and operational complexity should stay minimal while you validate the product.",
          learnMore:
            "Integrated backends reduce network boundaries and operational surfaces; document seams clearly so extraction remains feasible later.",
        }),
        defineOption("independent-api", "Independent API", {
          whatIsIt:
            "A dedicated backend exposes stable APIs consumed by one or more clients. Frontend and backend teams can deploy and scale on different schedules.",
          example:
            "A REST or GraphQL service powering a web app, mobile app, and partner integrations from the same contract.",
          bestFor:
            "Multiple clients, partner integrations, or teams that need clear ownership between user experience and domain services.",
          considerations:
            "You must invest in API versioning, authentication, observability, and contract testing across consumer teams.",
          recommendation:
            "Choose Independent API when more than one client or team will depend on the same backend capabilities long term.",
          learnMore:
            "An API-first boundary turns the backend into a product; treat schemas, error models, and deprecation policies as first-class artifacts.",
        }),
        defineOption("microservices", "Microservices", {
          whatIsIt:
            "The system decomposes into independently deployable services, each owning a bounded capability and communicating over the network.",
          example:
            "Separate services for billing, notifications, and catalog search orchestrated behind an API gateway.",
          bestFor:
            "Large organizations with distinct scaling profiles, autonomous teams, and mature platform engineering practices.",
          considerations:
            "Distributed systems introduce latency, partial failures, data consistency challenges, and significant operational overhead.",
          recommendation:
            "Choose Microservices only when organizational scale or technical constraints clearly outweigh the cost of distribution.",
          learnMore:
            "Microservices succeed with strong platform tooling, observability, and clear domain boundaries—not as a default starting point.",
        }),
      ],
    },
    {
      id: "source-of-truth",
      title: "Source of Truth",
      description: "Defines where application state originates.",
      question: "Where should the source of truth live?",
      options: [
        defineOption("client", "Client", {
          whatIsIt:
            "The authoritative state for key user interactions lives on the client, with the server acting as a sync or persistence layer when needed.",
          example:
            "A collaborative document editor where local edits are canonical until explicitly saved or merged.",
          bestFor:
            "Highly interactive experiences, optimistic UIs, and products that must remain responsive under variable latency.",
          considerations:
            "Conflict resolution, audit trails, and multi-device consistency become explicit design problems rather than server defaults.",
          recommendation:
            "Choose Client when perceived performance and offline-capable interaction models are central to the product promise.",
          learnMore:
            "Client-authoritative designs require clear merge strategies and user-visible sync semantics to maintain trust.",
        }),
        defineOption("backend", "Backend", {
          whatIsIt:
            "The server holds canonical state; clients fetch, display, and submit changes through validated commands or mutations.",
          example:
            "An inventory system where stock levels are only committed after server confirmation.",
          bestFor:
            "Regulated data, financial transactions, multi-user consistency, and systems where auditability is mandatory.",
          considerations:
            "Perceived latency increases unless you layer caching, optimistic UI, or regional replicas thoughtfully.",
          recommendation:
            "Choose Backend when correctness, security, and a single reconciled view of data outweigh local-first responsiveness.",
          learnMore:
            "Server-authoritative models simplify reasoning about consistency; pair them with clear client state machines for good UX.",
        }),
      ],
    },
    {
      id: "realtime",
      title: "Realtime",
      description: "Defines whether the system requires live synchronization.",
      question: "Does the application require realtime updates?",
      options: [
        defineOption("no", "No", {
          whatIsIt:
            "Users receive updates through manual refresh, navigation, or scheduled polling. The system does not push live changes by default.",
          example:
            "A monthly reporting dashboard or a catalog that updates a few times per day.",
          bestFor:
            "Content that changes infrequently, batch workflows, and products where simplicity reduces infrastructure cost.",
          considerations:
            "Stale data may confuse users in collaborative contexts; set expectations in the UI when freshness matters.",
          recommendation:
            "Choose No when live synchronization does not materially improve outcomes and would add operational complexity.",
          learnMore:
            "Request-response and periodic refresh remain valid architectures; document data freshness so users understand limitations.",
        }),
        defineOption("yes", "Yes", {
          whatIsIt:
            "Changes propagate to connected clients near-instantly through push channels, subscriptions, or event streams.",
          example:
            "A live chat, a shared kanban board, or operational monitoring where multiple viewers see the same state.",
          bestFor:
            "Collaboration, notifications, live operations, and any domain where delay erodes trust or safety.",
          considerations:
            "You must handle connection drops, authorization per channel, backpressure, and ordering semantics explicitly.",
          recommendation:
            "Choose Yes when simultaneous users depend on seeing the same state within seconds, not minutes.",
          learnMore:
            "Realtime systems combine delivery guarantees with UX fallbacks; design for reconnect, replay, and degraded modes from the start.",
        }),
      ],
    },
    {
      id: "offline-strategy",
      title: "Offline Strategy",
      description: "Defines offline capabilities.",
      question: "How should offline support be handled?",
      options: [
        defineOption("none", "None", {
          whatIsIt:
            "The application assumes continuous connectivity. Offline periods surface errors or blocking states without local persistence of business actions.",
          example:
            "An admin console used only on corporate networks with reliable connectivity.",
          bestFor:
            "Internal tools, always-online contexts, and products where offline work provides little user value.",
          considerations:
            "Mobile users and field workers may hit frustrating dead ends; validate that your audience truly operates online.",
          recommendation:
            "Choose None when connectivity is a safe assumption and offline investment would not change adoption or safety.",
          learnMore:
            "Online-only simplifies sync and security models; communicate connectivity requirements clearly in onboarding and error states.",
        }),
        defineOption("future-ready", "Future Ready", {
          whatIsIt:
            "The architecture avoids hard online dependencies today but does not ship full offline workflows yet. Boundaries allow adding local persistence later.",
          example:
            "A product that queues failed writes with retry today and plans true offline drafts in a later release.",
          bestFor:
            "Teams that expect offline needs but must ship an online MVP first without painting themselves into a corner.",
          considerations:
            "Without concrete offline features, teams may defer hard decisions on conflict resolution and local storage limits.",
          recommendation:
            "Choose Future Ready when offline is on the roadmap within a few quarters and you want to limit rework.",
          learnMore:
            "Future-ready design isolates network access, models idempotent operations, and avoids assuming immediate server confirmation in core flows.",
        }),
        defineOption("offline-first", "Offline First", {
          whatIsIt:
            "Local storage is the default interaction path; synchronization reconciles with the server when connectivity returns.",
          example:
            "A field inspection app that captures photos and forms without signal and uploads when back in range.",
          bestFor:
            "Unreliable networks, safety-critical capture, and domains where work cannot pause for connectivity.",
          considerations:
            "Storage quotas, merge conflicts, security of data at rest, and test matrices for sync scenarios increase significantly.",
          recommendation:
            "Choose Offline First when users must complete core tasks with zero connectivity as a normal condition, not an edge case.",
          learnMore:
            "Offline-first architecture treats sync as a feature with explicit states: local-only, pending, synced, and conflicted.",
        }),
      ],
    },
    {
      id: "database-model",
      title: "Domain Relationships",
      description:
        "Defines how business concepts connect and where consistency boundaries lie in the domain.",
      question: "How do business entities relate in your domain?",
      options: [
        defineOption("interconnected-entities", "Interconnected Entities", {
          whatIsIt:
            "Many entities participate in explicit relationships, and business rules often span multiple entities at once.",
          example:
            "An order must reference a valid customer, line items, tax rules, and inventory reservations before it can be confirmed.",
          bestFor:
            "Domains where correctness depends on cross-entity invariants and reporting across relationships.",
          considerations:
            "Changes ripple across models; teams need clear ownership when rules touch several entities.",
          recommendation:
            "Choose Interconnected Entities when the business story is inherently relational and rules rarely fit a single record.",
          learnMore:
            "Document entity relationships and invariants early; persistence choices come later in Engineering Decisions.",
        }),
        defineOption("aggregate-boundaries", "Aggregate Boundaries", {
          whatIsIt:
            "The domain is grouped into consistency boundaries with a clear root entity and explicit rules about what may change together.",
          example:
            "A shopping cart aggregate owns its line items; external code references the cart by id instead of mutating items directly.",
          bestFor:
            "Workflow-heavy domains, transactional commands, and teams modeling around business operations rather than tables.",
          considerations:
            "Boundary design takes facilitation; poorly drawn aggregates create either oversized blobs or fragmented rules.",
          recommendation:
            "Choose Aggregate Boundaries when each business action should commit as one coherent unit of change.",
          learnMore:
            "Aggregates express domain language; name roots after business operations, not storage shapes.",
        }),
        defineOption("independent-records", "Independent Records", {
          whatIsIt:
            "Business truth is captured as largely independent records with loose coupling and few cross-entity invariants.",
          example:
            "User profiles, settings, and audit logs evolve separately with minimal coupling between lifecycles.",
          bestFor:
            "Administrative tools, content catalogs, and products where entities are managed on their own.",
          considerations:
            "Cross-record workflows may need explicit orchestration layers as complexity grows.",
          recommendation:
            "Choose Independent Records when most operations affect a single concept and relationships are informational, not rule-bearing.",
          learnMore:
            "Start simple; introduce stronger boundaries only when multi-entity rules become a recurring source of defects.",
        }),
        defineOption("mixed-by-subdomain", "Mixed by Subdomain", {
          whatIsIt:
            "Different areas of the business use different relationship styles depending on complexity and change rate.",
          example:
            "Billing uses strict aggregates while marketing content stays record-oriented with flexible metadata.",
          bestFor:
            "Products combining mature transactional cores with fast-moving peripheral domains.",
          considerations:
            "Teams must document which style applies where to avoid inconsistent modeling within the same context.",
          recommendation:
            "Choose Mixed by Subdomain when no single relationship style fits every part of the business equally well.",
          learnMore:
            "Split by bounded context first, then pick relationship style per context instead of one global rule.",
        }),
      ],
    },
    {
      id: "business-logic",
      title: "Business Logic",
      description: "Defines where business rules should live.",
      question: "Where should business logic reside?",
      options: [
        defineOption("components", "Components", {
          whatIsIt:
            "Rules and workflows are implemented close to the user interface layer, often colocated with screens and interaction handlers.",
          example:
            "A checkout screen that calculates discounts and eligibility directly before submitting an order.",
          bestFor:
            "Prototypes, very small codebases, and UI-heavy logic that changes with every design iteration.",
          considerations:
            "Duplication across clients and difficulty testing complex rules make this hard to sustain as the product grows.",
          recommendation:
            "Choose Components only for early exploration or purely presentational rules tightly coupled to a single screen.",
          learnMore:
            "UI-colocated logic is fast to write but costly to reuse; extract rules upward as soon as a second consumer appears.",
        }),
        defineOption("controllers", "Controllers", {
          whatIsIt:
            "Request handlers orchestrate validation, authorization checks, and calls to data layers, owning workflow coordination at the application boundary.",
          example:
            "An endpoint handler that validates input, loads entities, applies a pricing rule, and persists the result.",
          bestFor:
            "CRUD-centric applications with moderate rule complexity and a single primary delivery channel.",
          considerations:
            "Controllers can accumulate fat over time unless discipline keeps domain rules from leaking into transport concerns.",
          recommendation:
            "Choose Controllers when workflows map cleanly to request/response cycles and team conventions favor thin domain layers initially.",
          learnMore:
            "Controller-centric logic works with clear layering; refactor toward dedicated domain modules when handlers grow past orchestration.",
        }),
        defineOption("services-domain-layer", "Services / Domain Layer", {
          whatIsIt:
            "Business rules live in explicit domain services or modules independent of UI and transport. Application layers delegate to this core.",
          example:
            "A pricing service used by web checkout, batch invoicing, and an internal admin tool with identical outcomes.",
          bestFor:
            "Complex domains, multiple entry points, and products where rule correctness is a competitive advantage.",
          considerations:
            "Requires upfront modeling investment and team fluency in separating domain language from infrastructure details.",
          recommendation:
            "Choose Services / Domain Layer when the same rules must execute consistently across channels and over years of change.",
          learnMore:
            "A dedicated domain layer encodes ubiquitous language, invariants, and policies testable without UI or HTTP scaffolding.",
        }),
      ],
    },
    {
      id: "ai-strategy",
      title: "AI Strategy",
      description: "Defines how AI participates in the architecture.",
      question: "How should AI be treated within the system?",
      options: [
        defineOption("no-ai", "No AI", {
          whatIsIt:
            "The product does not incorporate machine learning or generative capabilities in its core workflows or architecture.",
          example:
            "A traditional CRUD business application with deterministic rules and no model inference paths.",
          bestFor:
            "Regulated domains with strict determinism, teams without ML operations maturity, and problems solved reliably by rules.",
          considerations:
            "Competitors may ship assistive features; revisit this decision when user expectations or cost structures shift.",
          recommendation:
            "Choose No AI when outcomes must be fully explainable and deterministic behavior is a contractual or safety requirement.",
          learnMore:
            "Non-AI architectures simplify auditing and testing; document decision criteria so future AI adoption is intentional, not reactive.",
        }),
        defineOption("feature", "Feature", {
          whatIsIt:
            "AI augments specific features—summarization, recommendations, classification—while the core system remains traditionally architected.",
          example:
            "A support ticket system that suggests reply drafts but requires human approval before sending.",
          bestFor:
            "Products adding productivity gains without betting the entire domain model on probabilistic outputs.",
          considerations:
            "Fallbacks, human review, cost controls, and evaluation of model quality per feature become ongoing responsibilities.",
          recommendation:
            "Choose Feature when AI clearly improves particular workflows but must not own critical invariants or authoritative state.",
          learnMore:
            "Feature-level AI isolates inference behind boundaries with timeouts, guardrails, and graceful degradation to non-AI paths.",
        }),
        defineOption("first-class-architecture", "First-Class Architecture", {
          whatIsIt:
            "AI capabilities are foundational: retrieval, agents, embeddings, or inference pipelines shape data models, APIs, and user journeys centrally.",
          example:
            "A research assistant where search, synthesis, and citation traceability are the primary product loop.",
          bestFor:
            "AI-native products whose value proposition depends on models, context assembly, and continuous learning loops.",
          considerations:
            "Observability, safety, latency, cost governance, and evaluation harnesses must be designed as core platform concerns.",
          recommendation:
            "Choose First-Class Architecture when the product cannot deliver its promise without AI in the critical path of most journeys.",
          learnMore:
            "AI-first systems treat prompts, context, feedback, and evaluation as production assets with lifecycle management equal to code.",
        }),
      ],
    },
  ],
};
