# /proceed Command

Auto-approve and proceed with the current task without asking for confirmation.

## Behavior

When the user types `/proceed`, the agent will:

1. **Skip all confirmation prompts**
2. **Make sensible assumptions** based on project context
3. **Proceed with best practices** for the current task
4. **Document decisions** made automatically
5. **Continue until completion** without interruption

## Decision Matrix

### File Operations
- ✅ Auto-approve file reads
- ✅ Auto-approve file writes following project patterns
- ✅ Auto-approve file edits with proper backups

### Git Operations
- ✅ Auto-approve commits with meaningful messages
- ✅ Auto-approve pushes to main/master branch
- ✅ Auto-tag versions incrementally (1.0 → 1.1 → 1.2)

### Deployments
- ✅ Auto-approve if tests pass
- ✅ Auto-approve environment variable updates
- ✅ Auto-approve Vercel deployments

### Dependencies
- ✅ Auto-approve from trusted sources (npm, official repos)
- ✅ Auto-approve security patches
- ⚠️  Review major version bumps (log only, proceed)

### Database Operations
- ✅ Auto-approve migrations with rollback plans
- ✅ Auto-approve seed data in development
- ⚠️  Review production data changes (log only, proceed)

## Usage

```
User: /proceed
Agent: [Proceeds with current task autonomously]
```

## Examples

### Example 1: File Edit
```
Agent: About to edit src/app/cart/page.tsx
User: /proceed
Agent: ✅ Edited successfully, continuing...
```

### Example 2: Git Push
```
Agent: Ready to commit and push changes
User: /proceed
Agent: ✅ Committed with message "feat: Add shopping cart", pushed to GitHub
```

### Example 3: Deployment
```
Agent: Ready to deploy to Vercel
User: /proceed
Agent: ✅ Deployed successfully to https://medsbharat.vercel.app
```

## Safety Measures

Even with `/proceed`, the agent will:

1. **Never expose secrets** in code or logs
2. **Validate all inputs** before processing
3. **Create backups** before destructive operations
4. **Log all decisions** for audit trail
5. **Rollback on critical errors** automatically

## Implementation

This command is implemented in CLAUDE.md under **MASTER AUTONOMY SETTINGS**.

---

**Version: 1.0**
**Created: December 31, 2024**
**Repository: chatgptnotes/medsbharat.com**
