# Git Workflow Guide

This document explains two Git workflow approaches: **Solo Development** (recommended for this project) and **Collaborative Development** (for team projects).

---

## Solo Development Workflow (Recommended for Recipe App)

For **solo contributors**, use branches without pull requests. This keeps your work organized while maintaining a clean commit history.

### Why Use This?

- ✅ Keeps features isolated on separate branches
- ✅ No PR overhead for a single developer
- ✅ Still maintains meaningful commit history
- ✅ Easy to revert if something breaks
- ✅ Clean main branch with only tested features

### When to Use

- **Solo projects** (you're the only contributor)
- **Personal learning projects**
- **Rapid prototyping** with frequent releases
- **Internal/private projects**

### Workflow Steps

#### 1. Create a Feature Branch

```bash
git checkout -b feat/meal-planner
# or for bug fixes:
# git checkout -b fix/auth-bug
# or for refactoring:
# git checkout -b refactor/service-layer
```

#### 2. Work on Your Feature

Make commits as you progress through different components:

```bash
# Commit service layer changes
git add services/mealPlanService.js services/pantryService.js
git commit -m "feat: add meal plan and pantry services"

# Commit UI screens
git add app/meal-planner.tsx app/pantry.tsx app/grocery-list.tsx
git commit -m "feat: add UI screens for meal planning feature"

# Commit routing updates
git add app/_layout.tsx app/home.tsx
git commit -m "feat: add navigation routes for meal planner"
```

#### 3. Push Your Branch to Remote

```bash
git push origin feat/meal-planner
```

#### 4. Test Locally

Before merging to main, thoroughly test your changes:

- Run the app: `npm start` or `expo start`
- Test all new features manually
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify no console errors

#### 5. Merge to Main

```bash
# Switch to main branch
git checkout main

# Update main with latest remote changes
git pull origin main

# Merge your feature branch
git merge feat/meal-planner
```

#### 6. Push Merged Changes

```bash
git push origin main
```

#### 7. Cleanup (Optional)

Delete the local and remote branches:

```bash
# Delete local branch
git branch -d feat/meal-planner

# Delete remote branch
git push origin --delete feat/meal-planner
```

### Example: Full Feature Implementation

```bash
# Start new feature
git checkout -b feat/meal-planner

# Work on services
# ... edit files ...
git add services/
git commit -m "feat: implement mealPlanService with CRUD operations"
git commit -m "feat: implement pantryService for inventory tracking"

# Work on UI
# ... edit files ...
git add app/
git commit -m "feat: create meal-planner screen with week navigation"
git commit -m "feat: create pantry screen with add/edit/delete modals"
git commit -m "feat: create grocery-list screen with checkboxes"

# Work on integration
# ... edit files ...
git add app/recipe/
git commit -m "feat: add 'Add to Plan' button to recipe detail"

# Push to remote
git push origin feat/meal-planner

# Test everything locally...

# Merge to main
git checkout main
git pull origin main
git merge feat/meal-planner
git push origin main

# Cleanup
git branch -d feat/meal-planner
git push origin --delete feat/meal-planner
```

### Branch Naming Conventions

Follow semantic prefixes for clarity:

| Prefix      | Purpose                           | Example                                               |
| ----------- | --------------------------------- | ----------------------------------------------------- |
| `feat/`     | New feature                       | `feat/meal-planner`, `feat/ratings-system`            |
| `fix/`      | Bug fix                           | `fix/auth-crash`, `fix/recipe-delete-error`           |
| `refactor/` | Code cleanup (no behavior change) | `refactor/service-layer`, `refactor/styling`          |
| `perf/`     | Performance improvement           | `perf/list-virtualization`, `perf/image-optimization` |
| `docs/`     | Documentation only                | `docs/readme-update`, `docs/api-guide`                |
| `test/`     | Test additions                    | `test/recipe-service-tests`                           |

---

## Collaborative Workflow (For Team Projects)

Use this when working with other developers. Pull Requests allow code review before merging.

### Why Use This?

- ✅ Code review before merging (catches bugs)
- ✅ Discussion about implementation
- ✅ Audit trail of changes
- ✅ Prevents accidental commits to main
- ✅ Required by most companies

### When to Use

- **Team projects**
- **Open source contributions**
- **Professional/production code**
- **When code review is required**

### Workflow Steps

#### 1. Create a Feature Branch

```bash
git checkout -b feat/meal-planner
```

#### 2. Commit Your Changes

```bash
git add .
git commit -m "feat: add meal planner feature"
```

#### 3. Push to Remote

```bash
git push origin feat/meal-planner
```

#### 4. Create a Pull Request (PR)

On GitHub:

1. Navigate to your repository
2. Click "New Pull Request" or "Compare & pull request"
3. Base: `main`, Compare: `feat/meal-planner`
4. Fill in PR title and description:

```markdown
## Description

Adds a complete meal planning system with pantry tracking and grocery list generation.

## Changes

- New services: mealPlanService, pantryService
- New screens: meal-planner, pantry, grocery-list
- Updated recipe detail screen with "Add to Plan" button
- Updated navigation in home screen and root layout

## Type of Change

- [ ] Bug fix
- [x] New feature
- [ ] Breaking change

## Testing

- [x] Tested meal plan creation and navigation
- [x] Tested pantry item add/edit/delete
- [x] Tested grocery list generation
- [x] Verified Appwrite collections created successfully

## Checklist

- [x] Code follows project conventions
- [x] No TypeScript errors
- [x] All new functions documented
- [x] Tested on Expo Go
```

#### 5. Wait for Review

- Team members review your code
- Respond to feedback
- Make requested changes:

```bash
git add .
git commit -m "refactor: address code review feedback"
git push origin feat/meal-planner
```

#### 6. Merge PR

Once approved:

1. Click "Merge pull request" on GitHub
2. Choose merge strategy (Squash, Rebase, or Merge)
3. Delete the branch after merging

#### 7. Pull Latest Changes

```bash
git checkout main
git pull origin main
```

### PR Description Template

```markdown
## 📋 Description

Brief overview of what this PR accomplishes.

## 🎯 Related Issue

Closes #123 (if applicable)

## 🔄 Type of Change

- [ ] Bug fix (fixes existing issue)
- [ ] New feature (adds new functionality)
- [ ] Breaking change (may affect existing functionality)
- [ ] Documentation update

## 📝 Changes Made

- Change 1
- Change 2
- Change 3

## ✅ Testing

- [ ] Tested locally
- [ ] Tested on different devices/screen sizes
- [ ] All tests passing

## 🚀 Performance Impact

- [ ] No performance impact
- [ ] Performance improved (describe)
- [ ] Performance degraded (describe why)

## ♿ Accessibility

- [ ] No accessibility impact
- [ ] Improvements made (describe)

## 📚 Documentation

- [ ] No docs needed
- [ ] Documentation updated
- [ ] New documentation added (describe)

## 🧹 Checklist

- [ ] Code follows style guidelines
- [ ] No console errors/warnings
- [ ] Self-reviewed my own code
- [ ] Commented complex logic
- [ ] Removed debugging code
- [ ] No new warnings generated
```

---

## Quick Reference: Side-by-Side Comparison

| Aspect              | Solo Workflow                | Collaborative Workflow             |
| ------------------- | ---------------------------- | ---------------------------------- |
| **Branch Creation** | `git checkout -b feat/...`   | `git checkout -b feat/...`         |
| **Commits**         | Frequent, focused commits    | Frequent, focused commits          |
| **Push**            | `git push origin feat/...`   | `git push origin feat/...`         |
| **Review**          | ❌ Skip                      | ✅ Create PR on GitHub             |
| **Merging**         | `git merge feat/...` locally | PR merge on GitHub                 |
| **Best For**        | Personal projects            | Team/production code               |
| **Time to Merge**   | Immediate (you decide)       | Hours to days (waiting for review) |

---

## Common Git Commands Cheat Sheet

### Branch Management

```bash
# List all branches
git branch -a

# Create and switch to new branch
git checkout -b feat/my-feature

# Switch to existing branch
git checkout main

# Delete local branch
git branch -d feat/my-feature

# Delete remote branch
git push origin --delete feat/my-feature

# Rename branch
git branch -m old-name new-name
```

### Commits & History

```bash
# See commit history
git log --oneline

# See commits on this branch
git log main..HEAD

# See what changed
git diff main

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Merging & Rebasing

```bash
# Merge feature branch into main
git checkout main
git merge feat/my-feature

# Rebase onto main (cleaner history)
git checkout feat/my-feature
git rebase main

# Abort merge/rebase if conflicts arise
git merge --abort
git rebase --abort
```

### Stashing (Save work temporarily)

```bash
# Save current work
git stash

# List stashed changes
git stash list

# Apply stashed changes
git stash apply
git stash apply stash@{0}

# Delete stashed changes
git stash drop
```

---

## For the Recipe App: Recommended Approach

✅ **Use Solo Workflow** because:

- You're the only contributor
- No need for PR overhead
- Faster iteration cycle
- Perfect for learning/building

**Your typical flow:**

```bash
git checkout -b feat/your-feature
# ... code ...
git add .
git commit -m "feat: description"
git push origin feat/your-feature
# ... test locally ...
git checkout main
git merge feat/your-feature
git push origin main
```

---

## Additional Resources

- [GitHub Guides - GitHub Flow](https://guides.github.com/introduction/flow/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
