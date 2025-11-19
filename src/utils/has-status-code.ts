export const hasStatusCode = (e: unknown): e is { statusCode: number } =>
  typeof (e as Record<string, unknown>)?.statusCode === 'number'
