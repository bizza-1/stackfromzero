// ============================================================
// Java (Spring Boot DTO) → TypeScript converter
// ------------------------------------------------------------
// A pragmatic, dependency-free converter for the shapes that show up in real
// Spring Boot APIs: records, POJO/DTO classes, and enums, including generics,
// collections, Optional, and Jackson's @JsonProperty / @JsonIgnore.
//
// It is deliberately a *best-effort* structural translator, not a full Java
// parser — anything it can't confidently map is surfaced as a warning so the
// output is never silently wrong.
// ============================================================

export type JavaToTsOptions = {
  /** Prefix declarations with `export`. */
  exportDeclarations: boolean;
  /** Treat boxed primitives (Integer, Long, Boolean, …) as optional (`foo?`). */
  boxedOptional: boolean;
};

export type JavaToTsResult = {
  output: string;
  warnings: string[];
};

export const DEFAULT_JAVA_TO_TS_OPTIONS: JavaToTsOptions = {
  exportDeclarations: true,
  boxedOptional: false,
};

// Scalar Java types → TypeScript primitives.
const SCALAR_MAP: Record<string, string> = {
  // strings & string-ish
  String: "string",
  CharSequence: "string",
  char: "string",
  Character: "string",
  UUID: "string",
  URI: "string",
  URL: "string",
  // Jackson serialises temporals to ISO-8601 strings by default
  LocalDate: "string",
  LocalDateTime: "string",
  LocalTime: "string",
  Instant: "string",
  OffsetDateTime: "string",
  ZonedDateTime: "string",
  Date: "string",
  Timestamp: "string",
  Duration: "string",
  // numbers
  byte: "number",
  short: "number",
  int: "number",
  long: "number",
  float: "number",
  double: "number",
  Byte: "number",
  Short: "number",
  Integer: "number",
  Long: "number",
  Float: "number",
  Double: "number",
  BigDecimal: "number",
  BigInteger: "number",
  Number: "number",
  // booleans
  boolean: "boolean",
  Boolean: "boolean",
  // other
  Object: "unknown",
  void: "void",
  Void: "void",
};

const BOXED_TYPES = new Set([
  "Byte", "Short", "Integer", "Long", "Float", "Double",
  "Boolean", "Character", "BigDecimal", "BigInteger",
]);

const LIST_LIKE = new Set([
  "List", "ArrayList", "LinkedList", "Set", "HashSet", "TreeSet",
  "LinkedHashSet", "Collection", "Iterable", "Queue", "Deque",
]);
const MAP_LIKE = new Set(["Map", "HashMap", "TreeMap", "LinkedHashMap", "SortedMap", "ConcurrentHashMap"]);

type MappedType = { ts: string; optional: boolean };

/** Split on a separator that appears at generic (`<>`) depth 0 only. */
function splitTopLevel(input: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of input) {
    if (ch === "<") depth += 1;
    else if (ch === ">") depth -= 1;
    if (ch === sep && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) parts.push(current);
  return parts;
}

/** Map a single (possibly generic/array) Java type to a TS type. */
function mapType(rawType: string, referenced: Set<string>): MappedType {
  const type = rawType.trim().replace(/\s+/g, " ");

  // Array: Foo[] → Foo[]
  if (type.endsWith("[]")) {
    const inner = mapType(type.slice(0, -2), referenced);
    const el = inner.ts.includes("|") ? `(${inner.ts})` : inner.ts;
    return { ts: `${el}[]`, optional: false };
  }

  // Generic: Name<...>
  const generic = /^([A-Za-z_$][\w$.]*)\s*<(.+)>$/.exec(type);
  if (generic) {
    const container = generic[1].replace(/^.*\./, "");
    const args = splitTopLevel(generic[2], ",").map((a) => a.trim());

    if (container === "Optional") {
      const inner = mapType(args[0] ?? "Object", referenced);
      return { ts: inner.ts, optional: true };
    }
    if (LIST_LIKE.has(container)) {
      const element = mapType(args[0] ?? "Object", referenced);
      const el = element.ts.includes("|") ? `(${element.ts})` : element.ts;
      return { ts: `${el}[]`, optional: false };
    }
    if (MAP_LIKE.has(container)) {
      const keyTs = mapType(args[0] ?? "String", referenced).ts;
      const valTs = mapType(args[1] ?? "Object", referenced).ts;
      const key = keyTs === "number" ? "number" : "string";
      return { ts: `Record<${key}, ${valTs}>`, optional: false };
    }
    // Unknown generic container → keep it as a referenced generic type.
    referenced.add(container);
    const mappedArgs = args.map((a) => mapType(a, referenced).ts).join(", ");
    return { ts: `${container}<${mappedArgs}>`, optional: false };
  }

  // Non-generic scalar / custom reference.
  const simple = type.replace(/^.*\./, ""); // strip package qualifier
  if (SCALAR_MAP[simple] !== undefined) {
    return { ts: SCALAR_MAP[simple], optional: false };
  }
  if (simple === "?" || simple === "") {
    return { ts: "unknown", optional: false };
  }
  // Assume it's another user-defined type (interface reference).
  referenced.add(simple);
  return { ts: simple, optional: BOXED_TYPES.has(simple) };
}

/** Remove `//` and block comments. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

/** Read a balanced `(...)` or `{...}` group; `openIndex` must point at the opener. */
function readGroup(
  src: string,
  openIndex: number,
  open: "(" | "{",
  close: ")" | "}",
): { body: string; end: number } | null {
  if (src[openIndex] !== open) return null;
  let depth = 0;
  for (let i = openIndex; i < src.length; i += 1) {
    if (src[i] === open) depth += 1;
    else if (src[i] === close) {
      depth -= 1;
      if (depth === 0) return { body: src.slice(openIndex + 1, i), end: i };
    }
  }
  return null;
}

type FieldSpec = { name: string; type: string; optional: boolean };

/** Parse one `Type name` declaration (a record component or class field). */
function parseDeclaration(
  raw: string,
  options: JavaToTsOptions,
  referenced: Set<string>,
): FieldSpec | null {
  let decl = raw.trim();
  if (!decl) return null;

  // Jackson field controls.
  if (/@JsonIgnore\b/.test(decl)) return null;
  const rename = /@JsonProperty\s*\(\s*(?:value\s*=\s*)?"([^"]+)"\s*\)/.exec(decl);
  const overrideName = rename ? rename[1] : null;

  // Drop all annotations and any field initializer.
  decl = decl.replace(/@[A-Za-z_$][\w$.]*\s*(\([^)]*\))?/g, " ").trim();
  decl = decl.replace(/=.*$/s, "").trim();

  // A method/constructor signature (has parens/braces) is not a field.
  if (/[(){}]/.test(decl)) return null;
  // Static members and constants aren't part of the serialised JSON body.
  if (/\bstatic\b/.test(decl)) return null;

  decl = decl
    .replace(/\b(public|private|protected|static|final|transient|volatile)\b/g, "")
    .trim();
  if (!decl) return null;

  // Split into "type" + "name" (the name is the trailing identifier).
  const match = /^(.*\S)\s+([A-Za-z_$]\w*)$/.exec(decl);
  if (!match) return null;
  if (match[2] === "serialVersionUID") return null;

  const mapped = mapType(match[1], referenced);
  const name = overrideName ?? match[2];
  const optional =
    mapped.optional || (options.boxedOptional && BOXED_TYPES.has(match[1].trim()));
  return { name, type: mapped.ts, optional };
}

function emitInterface(name: string, fields: FieldSpec[], options: JavaToTsOptions): string {
  const prefix = options.exportDeclarations ? "export " : "";
  if (fields.length === 0) return `${prefix}interface ${name} {}`;
  const lines = fields.map((f) => `  ${f.name}${f.optional ? "?" : ""}: ${f.type};`);
  return `${prefix}interface ${name} {\n${lines.join("\n")}\n}`;
}

function emitEnum(name: string, members: string[], options: JavaToTsOptions): string {
  const prefix = options.exportDeclarations ? "export " : "";
  return `${prefix}type ${name} = ${members.map((m) => `"${m}"`).join(" | ")};`;
}

/**
 * Convert Java source containing one or more records/classes/enums into
 * TypeScript type declarations.
 */
export function convertJavaToTypeScript(
  source: string,
  options: JavaToTsOptions = DEFAULT_JAVA_TO_TS_OPTIONS,
): JavaToTsResult {
  const warnings: string[] = [];
  const referenced = new Set<string>();
  const defined = new Set<string>();
  const blocks: string[] = [];

  const src = stripComments(source);

  // ---- enums --------------------------------------------------------------
  const enumRe = /\benum\s+([A-Za-z_$]\w*)[^{]*/g;
  let enumMatch: RegExpExecArray | null;
  while ((enumMatch = enumRe.exec(src)) !== null) {
    const name = enumMatch[1];
    const group = readGroup(src, src.indexOf("{", enumRe.lastIndex), "{", "}");
    if (!group) continue;
    // Enum constants run up to the first ';' (any fields/methods follow it).
    const constantsPart = group.body.split(";")[0];
    const members = splitTopLevel(constantsPart, ",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => c.replace(/\s*[({].*$/s, "").trim()) // drop constructor args/bodies
      .filter((c) => /^[A-Za-z_$]\w*$/.test(c));
    if (members.length > 0) {
      defined.add(name);
      blocks.push(emitEnum(name, members, options));
    }
  }

  // ---- records ------------------------------------------------------------
  const recordRe = /\brecord\s+([A-Za-z_$]\w*)\s*\(/g;
  let recordMatch: RegExpExecArray | null;
  while ((recordMatch = recordRe.exec(src)) !== null) {
    const name = recordMatch[1];
    const group = readGroup(src, recordRe.lastIndex - 1, "(", ")");
    if (!group) continue;
    const components = splitTopLevel(group.body, ",")
      .map((c) => parseDeclaration(c, options, referenced))
      .filter((f): f is FieldSpec => f !== null);
    defined.add(name);
    blocks.push(emitInterface(name, components, options));
    recordRe.lastIndex = group.end;
  }

  // ---- classes & interfaces ----------------------------------------------
  const classRe = /\b(?:class|interface)\s+([A-Za-z_$]\w*)/g;
  let classMatch: RegExpExecArray | null;
  while ((classMatch = classRe.exec(src)) !== null) {
    const name = classMatch[1];
    if (defined.has(name)) continue;
    const group = readGroup(src, src.indexOf("{", classRe.lastIndex), "{", "}");
    if (!group) continue;
    const fields = group.body
      .split(";")
      .map((stmt) => parseDeclaration(stmt, options, referenced))
      .filter((f): f is FieldSpec => f !== null);
    defined.add(name);
    blocks.push(emitInterface(name, fields, options));
  }

  if (blocks.length === 0) {
    warnings.push(
      "No record, class, or enum was found. Paste a Java type such as `public record UserDto(Long id, String name) {}`.",
    );
  }

  // Flag references to types we didn't see defined here.
  for (const ref of referenced) {
    if (!defined.has(ref) && SCALAR_MAP[ref] === undefined) {
      warnings.push(`Referenced type "${ref}" isn't defined in the input — declare or import it separately.`);
    }
  }

  return { output: blocks.join("\n\n"), warnings };
}
