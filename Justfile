mod dashboard 'dashboard/dashboard.just'
mod tests 'tests/tests.just'

# ------------------------------------------------------------------------------
# Prettier
# ------------------------------------------------------------------------------

# Check if code is formatted correctly
prettier-check:
    npx prettier . --check

# Format code with Prettier
prettier-format:
    npx prettier . --check --write

# ------------------------------------------------------------------------------
# Justfile
# ------------------------------------------------------------------------------

# Format the Just code
format:
    just --fmt --unstable
    just --fmt --unstable --justfile dashboard/dashboard.just
    just --fmt --unstable --justfile tests/tests.just

# Check for Just format issues
format-check:
    just --fmt --check --unstable
    just --fmt --check --unstable --justfile dashboard/dashboard.just
    just --fmt --check --unstable --justfile tests/tests.just

# ------------------------------------------------------------------------------
# gitleaks
# ------------------------------------------------------------------------------

gitleaks-detect:
    gitleaks detect --source . > /dev/null

# ------------------------------------------------------------------------------
# Zizmor
# ------------------------------------------------------------------------------

# Run zizmor checking
zizmor-check:
    uvx zizmor . --persona=pedantic

# Run zizmor checking with sarif output
zizmor-check-sarif:
    uvx zizmor . --persona=pedantic --format sarif > results.sarif

# ------------------------------------------------------------------------------
# Pinact
# ------------------------------------------------------------------------------

# Run pinact
pinact-run:
    pinact run

# Run pinact checking
pinact-check:
    pinact run --verify --check

# Run pinact update
pinact-update:
    pinact run --update

# ------------------------------------------------------------------------------
# Git Hooks
# ------------------------------------------------------------------------------

# Install pre commit hook to run on all commits
install-git-hooks:
    cp -f githooks/pre-commit .git/hooks/pre-commit
    cp -f githooks/post-commit .git/hooks/post-commit
    chmod ug+x .git/hooks/*
