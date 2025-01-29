mod dashboard 'dashboard/dashboard.just'

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

# Check for Just format issues
format-check:
    just --fmt --check --unstable
    just --fmt --check --unstable --justfile dashboard/dashboard.just

# ------------------------------------------------------------------------------
# Git Hooks
# ------------------------------------------------------------------------------

# Install pre commit hook to run on all commits
install-git-hooks:
    cp -f githooks/pre-commit .git/hooks/pre-commit
    cp -f githooks/post-commit .git/hooks/post-commit
    chmod ug+x .git/hooks/*
