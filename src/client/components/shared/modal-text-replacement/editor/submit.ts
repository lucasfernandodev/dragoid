import { replacementListScheme } from '../../../../schema/replacement-list.ts'

interface TextReplacementRulesListItem {
  source: {
    value?: string
    error?: string
  }
  target: {
    value?: string
    error?: string
  }
  error?: string
}

export type TextReplacementRulesList = TextReplacementRulesListItem[]

export type RuleListErrorType = 'source' | 'target' | 'item'

interface ITextReplacementRulesListSubmitProps {
  rules: TextReplacementRulesList
  clearErrors: () => void
  updateError: (
    type: RuleListErrorType,
    position: number,
    message: string
  ) => void
  onSaveRulesList: (rules: Record<string, string>) => void
}

export const TextReplacementRulesListSubmit = ({
  clearErrors,
  rules,
  updateError,
  onSaveRulesList,
}: ITextReplacementRulesListSubmitProps) => {
  const rulesList = {} as Record<string, string>
  clearErrors()
  let isError = false
  for (const [i, rule] of rules.entries()) {
    isError = false

    const result = replacementListScheme.shape.list.safeParse({
      [rule.source.value as string]: rule.target.value,
    })

    if (!result.success) {
      const errorMessage = result.error.issues[0].message
      if (errorMessage.startsWith('Source')) {
        updateError('source', i, errorMessage)
        isError = true
        break
      }

      updateError('target', i, errorMessage)
      isError = true
      break
    }

    const [[source, target]] = Object.entries(result.data)

    if (typeof rulesList[source] !== 'undefined') {
      updateError('item', i, 'Duplicated source')
      isError = true
      break
    }

    rulesList[source] = target
  }

  if (!isError) {
    onSaveRulesList(rulesList)
  }
}
