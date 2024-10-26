export abstract class AppError extends Error {
  protected constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }

  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      ...(this.metadata && { metadata: this.metadata }),
    };
  }
}
