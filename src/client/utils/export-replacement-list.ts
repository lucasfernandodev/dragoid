import { replacementListScheme } from '../schema/replacement-list.ts'

export const exportReplacementList = (
  id: string,
  list: Record<string, string>
) => {
  const isValidList = replacementListScheme.safeParse({ id, list })
  if (!isValidList.success) {
    throw new Error(
      `Export list failed: ${isValidList.error.issues[0].message}`
    )
  }

  const { id: _id, list: _list } = isValidList.data

  const file = JSON.stringify({ id: _id, list: _list }, null, 2)
  const blob = new Blob([file], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${id}.json`
  document.body.appendChild(a) // Append to body to make it clickable in some browsers
  a.click()
  document.body.removeChild(a) // Clean up
  URL.revokeObjectURL(url)
}
