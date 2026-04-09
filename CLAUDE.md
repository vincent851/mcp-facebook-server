# Project Guidelines

## Testing

- Always add unit tests for any new or modified functionality.
- Run `npx vitest run` before committing to ensure all tests pass.
- Maintain test coverage for both the `FacebookClient` methods and MCP server tools.

## Security

- Review all code changes for malicious or suspicious patterns before committing.
- Never commit secrets, tokens, or credentials (e.g. `.env`, access tokens).
- Validate and sanitize all external inputs at system boundaries.
- Do not introduce known vulnerabilities (injection, XSS, SSRF, etc.).
- Audit dependencies for known security issues when adding new packages.
