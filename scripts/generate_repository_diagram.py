import argparse
import html
import os
from pathlib import Path


EXCLUDED_NAMES = {
    ".astro",
    ".git",
    "dist",
    "node_modules",
    "playwright-report",
    "test-results",
}
MAX_DEPTH = 9
ROW_HEIGHT = 24
WIDTH = 1600


def collect_entries(root: Path, output: Path) -> list[tuple[int, str, bool]]:
    entries: list[tuple[int, str, bool]] = []
    output = output.resolve()

    def visit(directory: Path, depth: int) -> None:
        with os.scandir(directory) as children:
            ordered_children = sorted(
                children,
                key=lambda child: (not child.is_dir(follow_symlinks=False), child.name.casefold()),
            )

        for child in ordered_children:
            path = Path(child.path)
            if child.name in EXCLUDED_NAMES or path.resolve() == output:
                continue

            is_directory = child.is_dir(follow_symlinks=False)
            label = child.name + "/" if is_directory else child.name
            entries.append((depth, label, is_directory))
            if is_directory and depth < MAX_DEPTH:
                visit(path, depth + 1)

    visit(root, 0)
    return entries


def create_svg(root: Path, entries: list[tuple[int, str, bool]]) -> str:
    directory_count = sum(is_directory for _, _, is_directory in entries)
    file_count = len(entries) - directory_count
    height = 112 + max(1, len(entries)) * ROW_HEIGHT

    rows = []
    for index, (depth, label, is_directory) in enumerate(entries):
        y = 104 + index * ROW_HEIGHT
        x = 36 + depth * 26
        marker_color = "#7dd3fc" if is_directory else "#94a3b8"
        text_color = "#e0f2fe" if is_directory else "#cbd5e1"
        escaped_label = html.escape(label, quote=True)
        rows.append(
            f'<circle cx="{x}" cy="{y - 5}" r="4" fill="{marker_color}"/>'
            f'<text x="{x + 14}" y="{y}" fill="{text_color}">{escaped_label}</text>'
        )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{height}" viewBox="0 0 {WIDTH} {height}" role="img" aria-labelledby="title description">
  <title id="title">Repository structure</title>
  <desc id="description">{file_count} files and {directory_count} directories in {html.escape(root.name, quote=True)}</desc>
  <rect width="100%" height="100%" fill="#0b1020"/>
  <text x="36" y="42" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="24" font-weight="700">Repository structure</text>
  <text x="36" y="70" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">{file_count} files · {directory_count} directories</text>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="13">
    {''.join(rows)}
  </g>
</svg>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate an SVG diagram of the repository tree.")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()

    root = args.root.resolve()
    if not root.is_dir():
        parser.error(f"repository root is not a directory: {root}")

    output = args.output.resolve() if args.output else root / "repository-diagram.svg"
    entries = collect_entries(root, output)
    output.write_text(create_svg(root, entries), encoding="utf-8")
    print(f"Generated {output} ({len(entries)} entries)")


if __name__ == "__main__":
    main()
