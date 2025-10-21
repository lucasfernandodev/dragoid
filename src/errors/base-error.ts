export class BaseError {
  public message: string
  public name: string
  public exitCode: number
  public debugMessage: string | object

  constructor(
    name: string,
    message: string,
    debugMessage: string | object,
    exitCode = 1
  ) {
    this.name = name
    this.message = message
    this.debugMessage = debugMessage
    this.exitCode = exitCode
  }
}
