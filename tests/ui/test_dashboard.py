# Copyright (c) 2026 Jack Plowman
"""Browser regressions for the dashboard's status tracker."""

import os

import pytest
from playwright.sync_api import Page, expect


@pytest.mark.parametrize("width", [375, 1280])
def test_tracker_styles_and_tooltip(page: Page, width: int) -> None:
    """Keep status colours, layout, and hover cards working after upgrades."""
    page.set_viewport_size({"width": width, "height": 800})
    page.goto(os.environ["PROJECT_URL"])
    tracker = page.locator("#root .group")
    expect(tracker).to_be_visible()
    expect(tracker).to_have_css("display", "flex")
    expect(tracker).to_have_css("height", "32px")
    for colour in ["emerald", "red", "yellow"]:
        block = tracker.locator(f".bg-{colour}-600").first
        expect(block).to_be_visible()
        assert block.evaluate("el => getComputedStyle(el).backgroundColor") not in {
            "rgba(0, 0, 0, 0)",
            "transparent",
        }
    tracker.locator(".bg-red-600").first.hover()
    expect(page.get_by_text("Error", exact=True)).to_be_visible()
