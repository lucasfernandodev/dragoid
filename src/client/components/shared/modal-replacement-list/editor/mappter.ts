import type { TextReplacementRulesList } from "./submit.ts";

export const TextReplacementMapper = {
  toList: (list?: Record<string, string> | null): TextReplacementRulesList => {
    if (!list) {
      return []
    }

    return Object.entries(list).map(item => {
      const [source, target] = item;
      return {
        source: {
          value: source,
        },
        target: {
          value: target
        },
      }
    })
  }
}