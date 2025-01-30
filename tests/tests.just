# ------------------------------------------------------------------------------
# Common Commands
# ------------------------------------------------------------------------------

# Install python dependencies
install:
    poetry install -E dev

# Install playwright dependencies
playwright-install:
    poetry run playwright install

# Run ui playwright tests (headless)
ui-tests:
    poetry run pytest ui

# Run ui playwright tests in headed mode
ui-tests-headed:
    poetry run pytest ui --headed

# Validates Pyproject
pyproject-check:
    poetry check

# ------------------------------------------------------------------------------
# Ruff - Python Linting and Formating
# Set up ruff red-knot when it's ready
# ------------------------------------------------------------------------------

# Fix all Ruff issues
ruff-fix:
    just tests::ruff-format-fix
    just tests::ruff-lint-fix

# Check for Ruff issues
ruff-lint-check:
    poetry run ruff check .

# Fix Ruff lint issues
ruff-lint-fix:
    poetry run ruff check . --fix

# Check for Ruff format issues
ruff-format-check:
    poetry run ruff format --check .

# Fix Ruff format issues
ruff-format-fix:
    poetry run ruff format .
