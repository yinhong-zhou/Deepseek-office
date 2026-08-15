/**
 * DeepSeek-office host plugin.
 *
 * The feature is intentionally client-driven: the browser already owns live
 * Session snapshots, including running tool calls, pending interactions,
 * errors, titles and subagent metadata. Keeping the host half empty avoids
 * duplicating session state or adding another RPC surface.
 */
import type { Context } from '@deepseek-ai/cordis'

export const name = 'deepseek-office'

export function apply(_ctx: Context): void {
  // Client-only visualization plugin. The no-op host mount lets DSH's bundle
  // loader discover and load the package's browser client entry.
}
