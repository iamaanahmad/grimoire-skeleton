# Kiro Quick Start Guide for Grimoire

This guide helps you leverage Kiro effectively while building Grimoire.

## Getting Started with Kiro

### 1. Understanding the Setup

You now have:

- ✅ **4 Steering Documents** - Guide Kiro's behavior
- ✅ **4 Agent Hooks** - Automate workflows
- ✅ **6 Specs** - Structured implementation plans

### 2. How to Use Specs

Specs are in `.kiro/specs/`. To work with a spec:

**Option A: Execute the Entire Spec**

```
Open the spec file in Kiro and say:
"Execute this spec, starting with Task 1"
```

**Option B: Execute Specific Tasks**

```
"Implement Task 5 from the entity-system spec"
```

**Option C: Review Before Execution**

```
"Review the entity-system spec and explain the approach"
Then: "Looks good, implement tasks 1-5"
```

### 3. How to Use Hooks

Hooks are in `.kiro/hooks/`. They trigger automatically or manually:

**Automatic Hooks**:

- **Entity Generator**: Triggers when you save a file matching `**/config/entities/**/*.ts`
- **Theme Validator**: Triggers when you save `**/theme/**/*.{css,scss,ts,tsx}`
- **Component Documentation**: Triggers when you save `**/components/**/*.tsx`

**Manual Hook**:

- **Pre-commit Quality**: Run manually before commits
  ```
  In Kiro: "Run the pre-commit quality check hook"
  ```

### 4. How Steering Works

Steering docs guide Kiro automatically:

- **Always Included**:
  - `project-architecture.md` - Core decisions
  - `kiro-usage-strategy.md` - How we use Kiro

- **Conditionally Included**:
  - `entity-system-guide.md` - When working on entity files
  - `ui-design-system.md` - When working on .tsx or .css files

You don't need to reference them manually - Kiro loads them automatically!

## Recommended Workflow

### Starting a New Feature

1. **Check if there's a spec**
   - Look in `.kiro/specs/`
   - If yes, use spec-driven approach
   - If no, use vibe coding

2. **For Spec-Driven Work**:

   ```
   "Let's implement the entity system. Start with tasks 1-3 from entity-system.md"
   ```

3. **For Vibe Coding**:
   ```
   "Create a dark-themed card component with a glitch hover effect.
   It should display tournament info and use the nightmare_neon theme."
   ```

### Creating a New Entity

1. **Create the config file**:

   ```
   "Create a new entity config for 'tournament' in apps/cursed-arena/config/entities/tournament.ts
   with fields: name (string), game (enum), startDate (date), status (enum)"
   ```

2. **Save the file** - Entity Generator hook will trigger automatically!

3. **Review generated files**:
   - Types in `/src/modules/tournament/types.ts`
   - Components in `/src/modules/tournament/`
   - API routes in `/src/app/api/tournament/`

4. **Customize as needed**:
   ```
   "Add a custom validator to the tournament form that checks if the start date is in the future"
   ```

### Working on UI

1. **Describe the vibe**:

   ```
   "Create a tournament card that looks like a cursed arcade cabinet.
   Neon green borders, glitch effect on hover, shows name, game, date, prize pool.
   Make it responsive and accessible."
   ```

2. **Iterate quickly**:

   ```
   "Make the glitch effect more subtle"
   "Add a loading state with bone skeleton animation"
   "Ensure it works in all three themes"
   ```

3. **Component Documentation hook** will check your work when you save!

### Before Committing

1. **Run the pre-commit hook**:

   ```
   "Run the pre-commit quality check"
   ```

2. **Fix any issues**:

   ```
   "Fix the TypeScript errors in tournament.tsx"
   "Remove all console.logs from the codebase"
   ```

3. **Commit with confidence!**

## Kiro Best Practices

### DO:

- ✅ Use specs for complex, interconnected systems
- ✅ Use vibe coding for UI and creative work
- ✅ Let hooks automate repetitive tasks
- ✅ Trust steering docs to guide Kiro
- ✅ Iterate quickly with natural language
- ✅ Review generated code before committing

### DON'T:

- ❌ Micromanage every detail in specs
- ❌ Use vibe coding for security-critical code
- ❌ Ignore hook warnings
- ❌ Fight against steering guidelines
- ❌ Commit without running pre-commit hook

## Common Kiro Commands

### Spec Execution

```
"Execute entity-system spec tasks 1-5"
"Continue with the next task in the spec"
"Review the theme-engine spec and explain the approach"
```

### Vibe Coding

```
"Create a [component] that [does X] with [style Y]"
"Refactor this component to use hooks"
"Add JSDoc comments to this file"
"Fix the accessibility issues in this component"
```

### Hook Management

```
"Run the pre-commit quality check"
"Show me what the entity generator hook will create"
"Trigger the theme validator manually"
```

### Code Review

```
"Review this component for accessibility issues"
"Check if this code follows our architecture guidelines"
"Suggest improvements for this implementation"
```

### Testing

```
"Write tests for the entity generator"
"Add E2E tests for the tournament creation flow"
"Check test coverage for the theme system"
```

## Troubleshooting

### "Kiro isn't following the architecture"

- Check if steering docs are in `.kiro/steering/`
- Verify fileMatch patterns in conditional steering
- Explicitly reference: "Following project-architecture.md, create..."

### "Generated code doesn't match the spec"

- Break tasks into smaller chunks
- Be more specific in acceptance criteria
- Review and iterate: "This doesn't match Task 3's requirements, fix it"

### "Hook isn't triggering"

- Check file path matches the pattern
- Verify hook is enabled in `.kiro/hooks/[hook-name].json`
- Try manual trigger: "Run the [hook-name] hook on this file"

### "Too much context, Kiro is confused"

- Focus on one task at a time
- Use specs to break down complexity
- Clear context: "Forget previous context, let's focus on..."

## Next Steps

1. **Start with Project Setup**:

   ```
   "Let's set up the Next.js project following the project-setup spec"
   ```

2. **Build Core Systems**:

   ```
   "Implement the entity system spec, starting with tasks 1-3"
   ```

3. **Create First App**:

   ```
   "Let's build Cursed Arena following the cursed-arena-app spec"
   ```

4. **Polish and Deploy**:
   ```
   "Run pre-commit checks and prepare for deployment"
   ```

## Resources

- **Specs**: `.kiro/specs/` - Structured implementation plans
- **Hooks**: `.kiro/hooks/` - Automated workflows
- **Steering**: `.kiro/steering/` - Architectural guidelines
- **Checklist**: `PROJECT_CHECKLIST.md` - Track progress
- **Usage Write-up**: `KIRO_USAGE_WRITEUP.md` - For submission

---

**Remember**: Kiro is your development partner. Communicate clearly, trust the system, and iterate quickly. You've got this! 🎃✨
