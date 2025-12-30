export function createProgram({ directives = [], body = [] } = {}) {
  return { type: "Program", directives, body };
}

export function createDirective(value, loc) {
  return { type: "Directive", value, loc };
}

export function createCodeLine(value, loc) {
  return { type: "CodeLine", value, loc };
}
