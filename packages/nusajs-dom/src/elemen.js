function isNode(value) {
  return value instanceof Node;
}

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key === "class" || key === "className") {
      el.className = value ?? "";
      continue;
    }
    if (key === "style" && value && typeof value === "object") {
      Object.assign(el.style, value);
      continue;
    }
    if (key === "ref" && typeof value === "function") {
      value(el);
      continue;
    }
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
      continue;
    }
    if (typeof value === "boolean") {
      if (value) {
        el.setAttribute(key, "");
      } else {
        el.removeAttribute(key);
      }
      continue;
    }
    if (value != null) {
      el.setAttribute(key, String(value));
    }
  }
}

export function normalizeChild(child, list = []) {
  if (child == null || child === false) {
    return list;
  }
  if (Array.isArray(child)) {
    for (const item of child) {
      normalizeChild(item, list);
    }
    return list;
  }
  if (isNode(child)) {
    list.push(child);
    return list;
  }
  list.push(document.createTextNode(String(child)));
  return list;
}

export function elemen(type, props, ...children) {
  let resolvedProps = props;
  let resolvedChildren = children;
  if (props == null || typeof props !== "object" || Array.isArray(props) || isNode(props)) {
    resolvedProps = {};
    resolvedChildren = [props, ...children];
  }

  if (typeof type === "function") {
    return type({ ...resolvedProps, children: resolvedChildren });
  }

  const el = document.createElement(type);
  applyProps(el, resolvedProps);
  const nodes = normalizeChild(resolvedChildren);
  for (const node of nodes) {
    el.appendChild(node);
  }
  return el;
}

export function fragment(...children) {
  const frag = document.createDocumentFragment();
  const nodes = normalizeChild(children);
  for (const node of nodes) {
    frag.appendChild(node);
  }
  return frag;
}
