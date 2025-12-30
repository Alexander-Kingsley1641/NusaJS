export function transform(ast, options = {}) {
  const lines = [];
  if (options.banner) {
    lines.push(options.banner);
  }

  if (ast.directives.length > 0) {
    const summary = ast.directives.map((dir) => dir.value).join(", ");
    lines.push(`// directives: ${summary}`);
  }

  for (const node of ast.body) {
    lines.push(node.value);
  }

  if (options.hmr) {
    lines.push(
      "",
      "if (typeof EventSource !== \"undefined\") {",
      "  const source = new EventSource(\"/__hmr\");",
      "  source.onmessage = (event) => {",
      "    if (event.data === \"reload\") {",
      "      window.location.reload();",
      "    }",
      "  };",
      "}"
    );
  }

  return lines.join("\n");
}
