export class CompilerError extends Error {
  constructor(message, { line = 0, column = 0, filename = "" } = {}) {
    super(message);
    this.name = "CompilerError";
    this.line = line;
    this.column = column;
    this.filename = filename;
  }

  toString() {
    const location = this.filename
      ? `${this.filename}:${this.line}:${this.column}`
      : `baris ${this.line}:${this.column}`;
    return `${this.name}: ${this.message} (${location})`;
  }
}
