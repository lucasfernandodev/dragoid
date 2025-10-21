import { ApplicationError } from '../errors/application-error.ts'

export const exitOnFetchError = async <T>(func: () => Promise<T>) => {
  try {
    const response = await func()
    return response
  } catch (error) {
    throw new ApplicationError(
      'An error occurred with the request: check if the url is correct or if the site is online',
      error
    )
  }
}
