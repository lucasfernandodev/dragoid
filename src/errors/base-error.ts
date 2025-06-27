export class BaseError {
  public message: string;
  public name: string;
  public exitCode: number;
  public debugMessage: Error | null | unknown;

  constructor(name: string, message: string, debugMessage: Error | null | unknown, exitCode = 1) {
    this.name = name;
    this.message = message;
    this.debugMessage = debugMessage;
    this.exitCode = exitCode;
  }
}