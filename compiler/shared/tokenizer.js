export function tokenize(source, { filename = "" } = {}) {
  const clean = source.replace(/^\uFEFF/, "");
  const lines = clean.replace(/\r\n/g, "\n").split("\n");
  const tokens = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (trimmed.startsWith("@")) {
      tokens.push({
        type: "directive",
        value: trimmed.slice(1).trim(),
        line: index + 1,
        column: line.indexOf("@") + 1,
        filename,
      });
    } else {
      tokens.push({
        type: "code",
        value: line,
        line: index + 1,
        column: 1,
        filename,
      });
    }
  }

  tokens.push({
    type: "eof",
    value: "",
    line: lines.length + 1,
    column: 1,
    filename,
  });

  return tokens;
}
