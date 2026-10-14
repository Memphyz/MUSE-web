import { ChangelogEntry, ChangelogGroup, ChangelogGroupName } from './release.models';

const GROUP_NAMES: readonly ChangelogGroupName[] = ['Novidades', 'Melhorias', 'Correções'];

/**
 * Parses the changelog published in the release body: one `## X.Y.Z (date)`
 * section per version, `### Group` headings and `- **Title**: text` items.
 * Same format as `app/CHANGELOG.md` and `firmware/CHANGELOG.md` in MUSE.
 */
export function parseChangelog(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const sections = markdown.split(/\n(?=## )/);

  for (const section of sections) {
    const heading = /^## (\d+\.\d+\.\d+)\s*\((\d{4}-\d{2}-\d{2})\)/.exec(section.trim());
    if (!heading) continue;
    const [, version, date] = heading;
    entries.push({ version, date, groups: parseGroups(section) });
  }
  return entries;
}

function parseGroups(section: string): ChangelogGroup[] {
  const groups: ChangelogGroup[] = [];
  let current: ChangelogGroup | null = null;

  for (const rawLine of section.split('\n')) {
    const line = rawLine.trimEnd();
    const groupHeading = /^### (.+)$/.exec(line.trim());
    if (groupHeading) {
      const name = normalizeGroupName(groupHeading[1]);
      current = { name, items: [] };
      groups.push(current);
      continue;
    }
    const item = /^- \*\*(.+?)\*\*:?\s*(.*)$/.exec(line.trim());
    if (item && current) {
      current.items.push({ title: item[1].replace(/:$/, ''), text: item[2].trim() });
      continue;
    }
    // Continuation of the previous item (wrapped line).
    if (current && current.items.length > 0 && line.startsWith('  ') && line.trim() !== '') {
      const last = current.items[current.items.length - 1];
      last.text = `${last.text} ${line.trim()}`.trim();
    }
  }
  return groups.filter((group) => group.items.length > 0);
}

function normalizeGroupName(raw: string): ChangelogGroupName {
  const found = GROUP_NAMES.find((name) => name.toLowerCase() === raw.trim().toLowerCase());
  return found ?? 'Melhorias';
}

/** "1.14.2" -> [1, 14, 2], for numeric comparison. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
