---
description: Describe when these instructions should be loaded by the agent based on the task context
applyTo: "**"
---

<!-- Tip: Use /create-instructions in chat to generate content with the help of the agent -->

How to add new custom VS Code instructions to the project

1. Place instruction files in `.github/instructions/` when they are specific to an area, or in `.github/*.instructions.md` for global instructions:

   ```
   .github/
   ├── instructions/
   │   ├── instruction-name.instructions.md
   │   ├── another-instruction.instructions.md
   │   └── ...
   ├── rules.instructions.md
   └── ...
   ```

2. Follow the naming convention:
   - Use kebab-case for file names
   - Always use the `.instructions.md` extension
   - Keep names descriptive of the instruction's purpose

3. Directory structure:

   ```
   PROJECT_ROOT/
   ├── .github/
   │   ├── instructions/
   │   │   ├── instruction-name.instructions.md
   │   │   └── ...
   │   └── rules.instructions.md
   └── ...
   ```

4. Never place instruction files:
   - In the project root outside `.github`
   - In directories other than `.github/` or `.github/instructions/`
   - In any other location unrelated to VS Code

5. VS Code instructions follow this structure:

```yaml
---
description: Brief description of the instruction's purpose
applyTo: "**/*.{ts,tsx,js,md}"
---
# Instruction Title

Main content explaining the rule in Markdown.

1. Step-by-step instructions
2. Code examples
3. Guidelines
```

Example:

```typescript
// Correct example
function goodExample() {
  // Implementation following the guidelines
}

// Incorrect example
function badExample() {
  // Implementation not following the guidelines
}
```
