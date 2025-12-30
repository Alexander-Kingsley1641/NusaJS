import { createProgram, createDirective, createCodeLine } from "./ast.js";

export function parse(tokens) {
  const directives = [];
  const body = [];

  for (const token of tokens) {
    if (token.type === "directive") {
      directives.push(
        createDirective(token.value, {
          line: token.line,
          column: token.column,
          filename: token.filename,
        })
      );
      continue;
    }
    if (token.type === "code") {
      body.push(
        createCodeLine(token.value, {
          line: token.line,
          column: token.column,
          filename: token.filename,
        })
      );
    }
  }

  return createProgram({ directives, body });
}
