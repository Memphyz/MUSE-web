import { Injectable, computed, signal } from '@angular/core';

import { compareVersions, parseChangelog } from './changelog-parser';
import { APP_SNAPSHOT, FIRMWARE_SNAPSHOT, RELEASES_API } from './release-snapshot';
import { AppRelease, FirmwareRelease } from './release.models';

interface GitHubAsset {
  name: string;
  size: number;
  updated_at: string;
  browser_download_url: string;
  download_count: number;
}

interface GitHubRelease {
  body: string | null;
  assets: GitHubAsset[];
}

/**
 * The latest published app and firmware, read from the fixed-tag releases of
 * the public MUSE-releases repository (the same place the app updates itself
 * from). The release download URLs have no CORS headers, so the manifest is
 * not readable from a browser; the GitHub API is, and it carries the asset
 * list and the changelog in the release body.
 */
@Injectable({ providedIn: 'root' })
export class ReleaseService {
  private readonly appState = signal<AppRelease>(APP_SNAPSHOT);
  private readonly firmwareState = signal<FirmwareRelease>(FIRMWARE_SNAPSHOT);
  private readonly loadingState = signal(true);

  readonly app = this.appState.asReadonly();
  readonly firmware = this.firmwareState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  readonly sizeLabel = computed(() => formatMegabytes(this.appState().sizeBytes));
  readonly publishedLabel = computed(() => formatDate(this.appState().publishedAt));

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.loadingState.set(true);
    await Promise.allSettled([this.loadApp(), this.loadFirmware()]);
    this.loadingState.set(false);
  }

  private async loadApp(): Promise<void> {
    const release = await this.fetchRelease('app');
    if (!release) return;

    const apks = release.assets
      .filter((asset) => /^muse-app-\d+\.\d+\.\d+\.apk$/.test(asset.name))
      .map((asset) => ({ asset, version: /(\d+\.\d+\.\d+)/.exec(asset.name)?.[1] ?? '0.0.0' }))
      .sort((a, b) => compareVersions(b.version, a.version));
    const latest = apks[0];
    if (!latest) return;

    const changelog = parseChangelog(release.body ?? '');
    this.appState.set({
      version: latest.version,
      file: latest.asset.name,
      url: latest.asset.browser_download_url,
      sizeBytes: latest.asset.size,
      publishedAt: latest.asset.updated_at,
      changelog: changelog.length > 0 ? changelog : APP_SNAPSHOT.changelog,
      totalDownloads: apks.reduce((sum, entry) => sum + entry.asset.download_count, 0),
      source: 'live',
    });
  }

  private async loadFirmware(): Promise<void> {
    const release = await this.fetchRelease('firmware');
    if (!release) return;

    const bins = release.assets
      .filter((asset) => /^muse-fw-\d+\.\d+\.\d+\.bin$/.test(asset.name))
      .map((asset) => ({ asset, version: /(\d+\.\d+\.\d+)/.exec(asset.name)?.[1] ?? '0.0.0' }))
      .sort((a, b) => compareVersions(b.version, a.version));
    const latest = bins[0];
    if (!latest) return;

    const changelog = parseChangelog(release.body ?? '');
    this.firmwareState.set({
      version: latest.version,
      file: latest.asset.name,
      sizeBytes: latest.asset.size,
      publishedAt: latest.asset.updated_at,
      changelog: changelog.length > 0 ? changelog : FIRMWARE_SNAPSHOT.changelog,
      source: 'live',
    });
  }

  private async fetchRelease(tag: 'app' | 'firmware'): Promise<GitHubRelease | null> {
    if (typeof fetch === 'undefined') return null;
    try {
      const response = await fetch(`${RELEASES_API}/${tag}`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) return null;
      const json: unknown = await response.json();
      return isRelease(json) ? json : null;
    } catch {
      return null;
    }
  }
}

function isRelease(value: unknown): value is GitHubRelease {
  return (
    typeof value === 'object' && value !== null && Array.isArray((value as GitHubRelease).assets)
  );
}

export function formatMegabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
