---
description: Describe when these instructions should be loaded by the agent based on the task context
applyTo: "**"
---

<!-- Tip: Use /create-instructions in chat to generate content with the help of the agent -->

How to continuously improve VS Code instructions and project guidance

1. Review new code patterns and detect recurring implementations across files.
2. Identify repeated problems, missing guidance, or opportunities to standardize behavior.
3. Update existing instructions when a better example, a new edge case, or a changed implementation appears.
4. Add new instructions when a pattern is used in 3+ files or when a repeated issue could be prevented.
5. Keep instructions specific, actionable, and grounded in real code examples.

## Improvement triggers

- New code patterns not covered by current instructions
- Repeated similar implementations across files
- Common error patterns that could be prevented
- New libraries or tools used consistently
- Emerging best practices in the codebase

# Analysis process

- Compare new code with existing instructions
- Identify patterns that should be standardized
- Check references to external documentation
- Review consistency of error handling and validation
- Monitor testing patterns and coverage

# Instruction updates

- **Add new instructions when:**
  - A new technology or pattern is used in 3+ files
  - Common bugs could be prevented by an instruction
  - Code reviews repeatedly mention the same feedback
  - New security or performance best practices appear

- **Modify existing instructions when:**
  - Better examples exist in the codebase
  - Additional edge cases are discovered
  - Related instructions have been updated
  - Implementation details have changed

- **Example pattern recognition:**

  ```typescript
  // If repeated patterns like this appear:
  const data = await prisma.user.findMany({
    select: { id: true, email: true },
    where: { status: "ACTIVE" },
  });

  // Consider documenting a dedicated Prisma instruction covering:
  // - standard select fields
  // - common where conditions
  // - performance optimization patterns
  ```

- **Instruction quality checks:**
- Instructions should be actionable and specific
- Examples should come from real code
- References should be current
- Patterns should be enforced consistently

## Continuous improvement

- Monitor code review comments
- Track recurring development questions
- Update instructions after major refactors
- Add links to relevant documentation
- Cross-reference related instructions

## Deprecation

- Mark outdated patterns as deprecated
- Remove instructions that no longer apply
- Update references to deprecated instructions
- Document migration paths for legacy patterns

## Documentation updates

- Keep examples synchronized with the code
- Update references to external documentation
- Maintain links between related instructions
- Document breaking changes

Follow the format and structure defined in the global project instruction file to keep the guidance consistent across the repository.
