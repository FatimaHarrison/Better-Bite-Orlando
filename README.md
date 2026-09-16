# Better Bite Orlando
## Bringing better health to Orlando

Better Bite Orlando is a Valencia College CEN 4910C capstone project focused on helping Orlando residents find healthier, more affordable food options.

The application is intended to help users search for healthy meals and food locations, apply budget and dietary filters, compare meal options using price and nutrition information, and locate nearby restaurants or grocery stores.

## Current Project Phase

The team is currently developing the project's web prototype while continuing work on UI/UX, frontend, backend, database, API research, QA, integration, and deployment planning.

## Planned Features

- Search for healthier meal options
- Search for restaurants and grocery stores
- Set a meal budget
- Filter by dietary preferences
- Compare meals by price, calories, and nutrition
- View nutrition information
- Search by distance
- View transportation options
- Save favorite meals or restaurants

## Technology

Current project planning identifies the following technologies:

- **Frontend:** Responsive web/mobile interface based on UI/UX prototypes
- **Backend:** Node.js and Express
- **Database:** MySQL
- **Version Control:** Git and GitHub
- **External Data:** Restaurant, location, menu, and nutrition APIs
- **Deployment:** Cloud-hosted environment

Potential external APIs currently under consideration include OpenMenu, Google Places, USDA FoodData Central, TripAdvisor, and Spoonacular. Final API selections may change as development progresses.

## Team Roles

| Area | Team Members |
|---|---|
| Project Management / Scrum | Alondra Reyes-Pagan, Fatima Harrison |
| UI/UX Design | Alondra Reyes-Pagan |
| Healthy Eating / Orlando Food Research | Marla Peraza Ravelo |
| Frontend Development | Gerald Allen Dinardo, Laura Savinon, Kenji Nakanishi |
| Backend Development | Zekia Beyene, Aram Valcourt |
| Database Development | Alaa Khan |
| QA / Integration / Testing / Deployment | Kelly Stinson |

> Team roles represent primary responsibilities. Team members are expected to communicate, collaborate, test, and document work across the project.

---

# GitHub Workflow Rules

These conventions are intended to keep the repository stable and make collaboration easier.

## 1. Start Every Coding Session by Updating Your Local Repository

Before making changes, make sure you are working with the most recent code.

```bash
git switch main
git pull origin main
```

Then switch to your working branch or create a new one:

```bash
git switch -c feature/short-description
```

If your branch already exists, update it with the latest changes from `main` before continuing.

## 2. Do Not Work Directly on `main`

Create a separate branch for each feature, fix, or task.

Suggested branch naming:

```text
feature/search-page
feature/budget-filter
fix/mobile-navigation
qa/test-search
docs/update-readme
```

Keep branches focused on one logical task whenever possible.

## 3. Do Not Commit Broken Code

Before committing:

- Make sure the application starts successfully.
- Test the feature or file you changed.
- Check for obvious console or server errors.
- Make sure your change does not break existing functionality.
- Remove temporary debugging code unless it is intentionally needed.

If a feature is incomplete, keep it on your branch until it is in a stable state.

## 4. Pull Before You Push

Before pushing changes, make sure your branch is current with the repository so conflicts are discovered before a pull request is created.

```bash
git pull
```

Resolve any merge conflicts carefully and retest after resolving them.

## 5. Make Small, Focused Commits

Avoid combining unrelated work into one large commit.

Good:

```text
Add budget filter dropdown
Fix restaurant card spacing on mobile
Add validation for missing nutrition data
Update QA test matrix
```

Avoid vague commit messages such as:

```text
changes
stuff
update
fixed things
```

## 6. Use Clear Commit Messages

A commit message should briefly explain what changed.

Suggested format:

```text
Add <feature>
Fix <problem>
Update <document/component>
Remove <obsolete item>
Refactor <component>
```

Examples:

```text
Add initial Express restaurant endpoint
Fix mobile navigation overflow
Update database ER diagram
Add Better Bite project logos
```

## 7. Do Not Commit Secrets or Private Credentials

Never commit:

- API keys
- Passwords
- Database credentials
- Access tokens
- Private certificates
- `.env` files containing secrets

Use environment variables for sensitive configuration.

If a secret is accidentally committed, notify the project managers immediately. Deleting the file in a later commit does not remove the secret from Git history.

## 8. Do Not Commit Generated or Unnecessary Files

Keep files such as the following out of Git unless the team specifically needs them:

```text
node_modules/
.env
.DS_Store
temporary files
local logs
IDE-specific files
```

Use `.gitignore` to keep these files out of the repository.

## 9. Test Before Creating a Pull Request

Before requesting that your work be merged:

- Pull the latest project changes.
- Resolve merge conflicts.
- Run the application.
- Test the feature you changed.
- Check related features for regressions.
- Review your own changed files.
- Remove unused or commented-out test code.

## 10. Use Pull Requests for Changes to `main`

When your branch is ready:

1. Push the branch to GitHub.
2. Create a pull request into `main`.
3. Describe what changed.
4. Mention any known limitations.
5. Include screenshots when the change affects the interface.
6. Link related GitHub Issues when applicable.
7. Wait for review or approval before merging when the team workflow requires it.

## 11. Do Not Force-Push to `main`

Avoid commands such as:

```bash
git push --force
```

on the shared `main` branch.

Force-pushing can overwrite teammates' work.

## 12. Use GitHub Issues for Bugs

When a bug is found, create a GitHub Issue with enough information for another team member to reproduce it.

Include:

- Short descriptive title
- Feature or requirement affected
- Environment/build tested
- Steps to reproduce
- Expected result
- Actual result
- Screenshot or error message when useful
- Assignee, if known

After a developer fixes the issue, QA should retest it before the issue is closed.

## 13. Communicate Changes That Affect Other Team Members

Post in Discord when your change:

- Changes API request or response formats
- Alters database tables or fields
- Changes shared configuration
- Adds a new dependency
- Changes setup or run instructions
- Affects another team's work
- Requires teammates to pull or reinstall packages

Do not assume everyone will notice a GitHub commit immediately.

## 14. Keep Documentation Current

When a technical decision changes, update the related documentation along with the code when possible.

Examples include:

- README
- API documentation
- Database diagrams
- Test plans
- Deployment instructions
- Configuration notes

## 15. When in Doubt, Protect `main`

The shared `main` branch should represent the most stable version of the project.

If you are unsure whether your work is ready, leave it on your branch and ask the team before merging.

---

## Basic Git Workflow Example

```bash
# Start with the latest main branch
git switch main
git pull origin main

# Create a branch for your task
git switch -c feature/example-feature

# Make and test your changes

# Review changed files
git status

# Stage and commit
git add.
git commit -m "Add example feature"

# Push your branch
git push -u origin feature/example-feature
```

Then create a pull request on GitHub.

---

## Project Documentation

The team maintains project planning, research, QA documentation, and supporting documents in the team's shared documentation area. GitHub is used for source code, technical changes, issues, and version history.

## Project Status

Better Bite Orlando is actively under development. Features, APIs, implementation details, and deployment architecture may change as the team completes the prototype and integrates the frontend, backend, database, and external data sources.
