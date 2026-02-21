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
# Prek
# ------------------------------------------------------------------------------

# Run prek checking on all pre-commit config files
prek-check:
    find . -name "pre-commit-config.*" -exec prek validate-config -c {} \;

# ------------------------------------------------------------------------------
# Zizmor
# ------------------------------------------------------------------------------

# Run zizmor checking
zizmor-check:
    uvx zizmor . --persona=auditor

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

# Install git hooks using prek
install-git-hooks:
    prek install

# ------------------------------------------------------------------------------
# Prek
# ------------------------------------------------------------------------------

# Update prek hooks and additional dependencies
prek-update:
    just prek-update-hooks
    just prek-update-additional-dependencies

# Prek update hooks
prek-update-hooks:
    prek autoupdate

prek-update-additional-dependencies:
    uv run --script https://raw.githubusercontent.com/JackPlowman/update-prek-additional-dependencies/refs/heads/main/update_prek_additional_dependencies.py

# ------------------------------------------------------------------------------
# Update All Tools
# ------------------------------------------------------------------------------

# Update all tools
update:
    just pinact-update
    just prek-update
    just prek-update-additional-dependencies
