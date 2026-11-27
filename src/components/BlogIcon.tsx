import { createElement, type ReactNode, type SVGProps } from 'react';

const ALLOWED_TAGS = new Set(['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line']);

const ALLOWED_ATTRS = new Set([
  'd',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'width',
  'height',
  'points',
]);

const SAFE_VALUE = /^[#\w\s.,+\-()%"'=:/]*$/;
const UNSAFE_VALUE = /javascript:|url\s*\(|expression\s*\(/i;

function parseIcon(icon: string): ReactNode[] | null {
  const tokens = icon.match(/<\/?[a-zA-Z][^<>]*>|[^<>]+/g);
  if (!tokens) return null;

  const nodes: ReactNode[] = [];
  for (const token of tokens) {
    if (!token.startsWith('<')) {
      if (token.trim()) return null;
      continue;
    }
    if (token.startsWith('</')) continue;

    const inner = token.slice(1, token.endsWith('/>') ? -2 : -1).trim();
    const space = inner.search(/[\s/]/);
    const tag = (space === -1 ? inner : inner.slice(0, space)).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return null;

    const attrSource = space === -1 ? '' : inner.slice(space);
    const attrs: Record<string, string> = {};
    const attrPattern = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
    let match: RegExpExecArray | null;
    while ((match = attrPattern.exec(attrSource)) !== null) {
      const name = match[1].toLowerCase();
      if (!ALLOWED_ATTRS.has(name)) return null;
      const raw = match[2];
      const value = raw === undefined ? '' : raw.replace(/^['"]|['"]$/g, '');
      if ((raw !== undefined && !SAFE_VALUE.test(value)) || UNSAFE_VALUE.test(value)) {
        return null;
      }
      attrs[name] = value;
    }
    if (attrSource.replace(attrPattern, '').trim()) return null;

    nodes.push(createElement(tag, { key: nodes.length, ...attrs }));
  }
  return nodes.length > 0 ? nodes : null;
}

interface BlogIconProps extends SVGProps<SVGSVGElement> {
  icon: string;
}

/** Renders a frontmatter SVG icon string as whitelisted React elements (no raw HTML). */
export default function BlogIcon({ icon, ...svgProps }: BlogIconProps) {
  const nodes = parseIcon(icon);
  if (!nodes) return null;
  return <svg {...svgProps}>{nodes}</svg>;
}
