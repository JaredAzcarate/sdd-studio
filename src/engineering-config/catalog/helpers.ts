import type { EngineeringOption, OptionDetail } from "../types.js";

export function defineOption(
  id: string,
  label: string,
  detail: OptionDetail,
): EngineeringOption {
  return { id, label, detail };
}
