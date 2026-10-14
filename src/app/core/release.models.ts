export type ChangelogGroupName = 'Novidades' | 'Melhorias' | 'Correções';

export interface ChangelogItem {
  title: string;
  text: string;
}

export interface ChangelogGroup {
  name: ChangelogGroupName;
  items: ChangelogItem[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  groups: ChangelogGroup[];
}

export interface AppRelease {
  version: string;
  file: string;
  /** Direct link to the APK, as published on the public release. */
  url: string;
  sizeBytes: number;
  /** ISO 8601. */
  publishedAt: string;
  changelog: ChangelogEntry[];
  totalDownloads: number;
  /** Where the data came from: the live GitHub API or the build-time snapshot. */
  source: 'live' | 'snapshot';
}

export interface FirmwareRelease {
  version: string;
  file: string;
  sizeBytes: number;
  publishedAt: string;
  changelog: ChangelogEntry[];
  source: 'live' | 'snapshot';
}
