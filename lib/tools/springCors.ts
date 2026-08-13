// ============================================================
// Spring Boot CORS configuration generator
// ------------------------------------------------------------
// Generates correct, idiomatic CORS config for the three ways people actually
// wire it up in Spring Boot:
//   1. WebMvcConfigurer      — global CORS, no Spring Security
//   2. SecurityFilterChain   — the correct place when Spring Security is on
//   3. @CrossOrigin          — per-controller annotation
//
// The important bit of real knowledge encoded here: when allowCredentials is
// true, Spring FORBIDS the wildcard origin "*" and throws at startup
// ("When allowCredentials is true, allowedOrigins cannot contain the special
// value \"*\""). The fix is allowedOriginPatterns / originPatterns, which this
// generator switches to automatically whenever an origin contains "*".
// ============================================================

export type SpringCorsOptions = {
  origins: string[];
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  allowCredentials: boolean;
  maxAge: number;
  mapping: string;
};

export type SpringCorsVariant = {
  id: "webmvc" | "security" | "annotation";
  label: string;
  description: string;
  code: string;
};

export type SpringCorsResult = {
  variants: SpringCorsVariant[];
  warnings: string[];
  usesPatterns: boolean;
};

export const DEFAULT_SPRING_CORS_OPTIONS: SpringCorsOptions = {
  origins: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["*"],
  exposedHeaders: [],
  allowCredentials: true,
  maxAge: 3600,
  mapping: "/**",
};

const VALID_METHODS = new Set([
  "GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "TRACE",
]);

/** Parse a comma/newline/space separated list into trimmed, de-duped entries. */
export function parseList(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(/[\n,]+/)) {
    const item = raw.trim();
    if (item && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

const q = (s: string) => `"${s.replace(/"/g, '\\"')}"`;
const varargs = (items: string[]) => items.map(q).join(", ");
const listOf = (items: string[]) => `List.of(${varargs(items)})`;

function buildWarnings(o: SpringCorsOptions, usesPatterns: boolean): string[] {
  const warnings: string[] = [];
  const hasBareWildcard = o.origins.includes("*");

  if (o.origins.length === 0) {
    warnings.push("No origins set — add at least one, e.g. http://localhost:5173.");
  }
  if (o.allowCredentials && hasBareWildcard) {
    warnings.push(
      'allowCredentials(true) with a "*" origin means Spring reflects whatever Origin the browser sends — effectively letting ANY site make authenticated requests. List explicit origins instead of "*".',
    );
  }
  if (o.allowCredentials && o.allowedHeaders.includes("*")) {
    warnings.push(
      'With credentials enabled, some browsers treat allowedHeaders "*" literally rather than as a wildcard. List the headers you actually need (e.g. Authorization, Content-Type) if you hit preflight failures.',
    );
  }
  if (usesPatterns) {
    warnings.push(
      "A wildcard appears in your origins, so allowedOriginPatterns / originPatterns is used instead of allowedOrigins (required — Spring rejects wildcards there when credentials are on).",
    );
  }
  const badMethods = o.methods.filter((m) => m !== "*" && !VALID_METHODS.has(m.toUpperCase()));
  if (badMethods.length > 0) {
    warnings.push(`Unrecognised HTTP method(s): ${badMethods.join(", ")}.`);
  }
  return warnings;
}

function buildWebMvc(o: SpringCorsOptions, usesPatterns: boolean): string {
  const originsCall = usesPatterns
    ? `.allowedOriginPatterns(${varargs(o.origins)})`
    : `.allowedOrigins(${varargs(o.origins)})`;

  const chain: string[] = [
    originsCall,
    `.allowedMethods(${varargs(o.methods)})`,
    `.allowedHeaders(${varargs(o.allowedHeaders)})`,
  ];
  if (o.exposedHeaders.length > 0) {
    chain.push(`.exposedHeaders(${varargs(o.exposedHeaders)})`);
  }
  chain.push(`.allowCredentials(${o.allowCredentials})`);
  chain.push(`.maxAge(${o.maxAge});`);

  return `import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(${q(o.mapping)})
                ${chain.join("\n                ")}
    }
}`;
}

function buildSecurity(o: SpringCorsOptions, usesPatterns: boolean): string {
  const originsSetter = usesPatterns
    ? `config.setAllowedOriginPatterns(${listOf(o.origins)});`
    : `config.setAllowedOrigins(${listOf(o.origins)});`;

  const configLines: string[] = [
    originsSetter,
    `        config.setAllowedMethods(${listOf(o.methods)});`,
    `        config.setAllowedHeaders(${listOf(o.allowedHeaders)});`,
  ];
  if (o.exposedHeaders.length > 0) {
    configLines.push(`        config.setExposedHeaders(${listOf(o.exposedHeaders)});`);
  }
  configLines.push(`        config.setAllowCredentials(${o.allowCredentials});`);
  configLines.push(`        config.setMaxAge(${o.maxAge}L);`);

  return `import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enables CORS using the corsConfigurationSource bean below.
            .cors(Customizer.withDefaults());
            // ... your authorizeHttpRequests(), csrf(), etc. go here.
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        ${configLines.join("\n")}

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(${q(o.mapping)}, config);
        return source;
    }
}`;
}

function buildAnnotation(o: SpringCorsOptions, usesPatterns: boolean): string {
  const attrs: string[] = [];
  attrs.push(
    usesPatterns
      ? `    originPatterns = {${varargs(o.origins)}}`
      : `    origins = {${varargs(o.origins)}}`,
  );

  // @CrossOrigin uses the RequestMethod enum; "*" isn't expressible, so we omit
  // the attribute (which defaults to all methods the handler supports).
  const wildcardMethods = o.methods.includes("*");
  if (!wildcardMethods && o.methods.length > 0) {
    const enums = o.methods.map((m) => `RequestMethod.${m.toUpperCase()}`).join(", ");
    attrs.push(`    methods = {${enums}}`);
  }
  attrs.push(`    allowedHeaders = {${varargs(o.allowedHeaders)}}`);
  if (o.exposedHeaders.length > 0) {
    attrs.push(`    exposedHeaders = {${varargs(o.exposedHeaders)}}`);
  }
  // allowCredentials on @CrossOrigin is a String, not a boolean.
  attrs.push(`    allowCredentials = "${o.allowCredentials}"`);
  attrs.push(`    maxAge = ${o.maxAge}`);

  const needsMethodImport = !wildcardMethods && o.methods.length > 0;

  return `import org.springframework.web.bind.annotation.CrossOrigin;${
    needsMethodImport ? "\nimport org.springframework.web.bind.annotation.RequestMethod;" : ""
  }
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(
${attrs.join(",\n")}
)
@RestController
@RequestMapping("/api")
public class YourController {
    // ... your @GetMapping / @PostMapping handlers
}`;
}

export function generateSpringCors(
  options: SpringCorsOptions = DEFAULT_SPRING_CORS_OPTIONS,
): SpringCorsResult {
  const o: SpringCorsOptions = {
    ...options,
    origins: options.origins.length > 0 ? options.origins : ["*"],
    methods: options.methods.length > 0 ? options.methods : ["*"],
    allowedHeaders: options.allowedHeaders.length > 0 ? options.allowedHeaders : ["*"],
  };

  const usesPatterns = o.origins.some((origin) => origin.includes("*"));
  const warnings = buildWarnings(options, usesPatterns);

  const variants: SpringCorsVariant[] = [
    {
      id: "webmvc",
      label: "Global (WebMvcConfigurer)",
      description: "Application-wide CORS when you are NOT using Spring Security.",
      code: buildWebMvc(o, usesPatterns),
    },
    {
      id: "security",
      label: "Spring Security (SecurityFilterChain)",
      description: "The correct place to configure CORS once Spring Security is on the classpath.",
      code: buildSecurity(o, usesPatterns),
    },
    {
      id: "annotation",
      label: "@CrossOrigin (per controller)",
      description: "Quick, controller-scoped CORS for a single API.",
      code: buildAnnotation(o, usesPatterns),
    },
  ];

  return { variants, warnings, usesPatterns };
}
