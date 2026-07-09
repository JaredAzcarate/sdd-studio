import { defineOption } from "./helpers.js";
import type { EngineeringOption } from "../types.js";

export function defineCustomOption(
  learnMore = "Document the approach in CONTRIBUTING.md or the Engineering Brief.",
): EngineeringOption {
  return defineOption("custom", "Custom", {
    whatIsIt:
      "A bespoke approach defined by your team and documented in your own words.",
    example: "Describe the pattern when prompted in the configure wizard.",
    bestFor: "Organizations with existing standards not listed here.",
    considerations:
      "Without written rules, custom choices drift across contributors and AI agents.",
    recommendation:
      "Choose Custom only if you can describe clear rules with examples.",
    learnMore,
  });
}
