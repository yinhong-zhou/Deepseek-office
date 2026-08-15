import type { Species, AgentPose } from './Animal.tsx'

export type OfficeZone = 'desk' | 'search' | 'terminal' | 'collab' | 'break' | 'boss'

export interface WorkflowSummary {
  task: string
  reading: string
  editing: string
  tool: string
  next: string
}

export interface AgentModel {
  id: string
  name: string
  species: Species
  accent: string
  pose: AgentPose
  zone: OfficeZone
  statusLabel: string
  statusTone: 'green' | 'blue' | 'amber' | 'red' | 'gray'
  summary: WorkflowSummary
  running: boolean
  completed: boolean
  isSubagent: boolean
}

const ACCENTS = ['#4a6cf7', '#27a7a0', '#6f8f3d', '#f29a3f', '#8d6bd8', '#e26d7d', '#2e83c7']
const SPECIES: Species[] = ['cow', 'horse', 'sheep']

function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function identityFor(id: string): { species: Species; accent: string } {
  const h = hash(id)
  return {
    species: SPECIES[h % SPECIES.length] ?? 'cow',
    accent: ACCENTS[Math.floor(h / 7) % ACCENTS.length] ?? '#4a6cf7',
  }
}

function textFromContent(content: readonly unknown[] | undefined): string {
  if (!Array.isArray(content)) return ''
  const parts: string[] = []
  for (const raw of content) {
    if (typeof raw !== 'object' || raw === null) continue
    const block = raw as { type?: string; text?: string }
    if (block.type === 'text' && typeof block.text === 'string') parts.push(block.text)
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function short(value: string, max = 56): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1)}…`
}

function parseArgs(raw: string | undefined): Record<string, unknown> {
  if (raw === undefined || raw.trim() === '') return {}
  try {
    const value = JSON.parse(raw) as unknown
    return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

function fileFromArgs(args: Record<string, unknown>): string {
  const keys = ['path', 'file_path', 'filePath', 'filepath', 'filename', 'file', 'target']
  for (const key of keys) {
    const value = args[key]
    if (typeof value === 'string' && value !== '') return short(value, 42)
  }
  return ''
}

function queryFromArgs(args: Record<string, unknown>): string {
  const keys = ['query', 'q', 'url', 'command', 'cmd', 'pattern', 'prompt']
  for (const key of keys) {
    const value = args[key]
    if (typeof value === 'string' && value !== '') return short(value, 42)
  }
  return ''
}

function classifyTool(name: string): OfficeZone {
  const n = name.toLowerCase()
  if (/web[_-]?search|web[_-]?fetch|browser|search_web|internet/.test(n)) return 'search'
  if (/bash|pwsh|terminal|shell|command|pytest|test|build|npm|pnpm|yarn|git|python/.test(n)) return 'terminal'
  if (/subagent|spawn|fork|delegate|agent[_-]?teams.*member/.test(n)) return 'collab'
  if (/ask[_-]?user|approval|confirm|permission/.test(n)) return 'boss'
  return 'desk'
}

function latestTool(snapshot: any): { name: string; argsRaw: string; isError?: boolean } | null {
  const running = Array.isArray(snapshot?.runningCalls) ? snapshot.runningCalls : []
  if (running.length > 0) {
    const call = running[running.length - 1]
    return {
      name: typeof call?.name === 'string' ? call.name : 'tool',
      argsRaw: typeof call?.argsRaw === 'string' ? call.argsRaw : '',
    }
  }
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : []
  for (let i = nodes.length - 1; i >= Math.max(0, nodes.length - 18); i -= 1) {
    const node = nodes[i]
    if (node?.kind !== 'tool-result') continue
    const name = typeof node.call?.name === 'string' ? node.call.name : 'tool'
    const argsRaw = typeof node.call?.argsRaw === 'string' ? node.call.argsRaw : ''
    return { name, argsRaw, isError: Boolean(node.isError) }
  }
  return null
}

function latestFiles(snapshot: any): { reading: string; editing: string } {
  let reading = ''
  let editing = ''
  const calls: Array<{ name: string; argsRaw: string }> = []
  if (Array.isArray(snapshot?.runningCalls)) {
    for (const call of snapshot.runningCalls) {
      if (typeof call?.name === 'string') calls.push({ name: call.name, argsRaw: typeof call?.argsRaw === 'string' ? call.argsRaw : '' })
    }
  }
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : []
  for (let i = nodes.length - 1; i >= Math.max(0, nodes.length - 28); i -= 1) {
    const node = nodes[i]
    if (node?.kind === 'tool-result' && typeof node.call?.name === 'string') {
      calls.push({ name: node.call.name, argsRaw: typeof node.call.argsRaw === 'string' ? node.call.argsRaw : '' })
    }
  }
  for (const call of calls) {
    const n = call.name.toLowerCase()
    const file = fileFromArgs(parseArgs(call.argsRaw))
    if (file === '') continue
    if (editing === '' && /edit|write|patch|replace|create/.test(n)) editing = file
    if (reading === '' && /read|grep|glob|find|search|lsp|cat/.test(n)) reading = file
    if (reading !== '' && editing !== '') break
  }
  return { reading, editing }
}

function latestTask(snapshot: any, fallback: string): string {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : []
  for (let i = nodes.length - 1; i >= 0; i -= 1) {
    const node = nodes[i]
    if (node?.kind !== 'user' && node?.kind !== 'steering') continue
    const text = textFromContent(node.content)
    if (text !== '') return short(text, 64)
  }
  return short(fallback, 64)
}

function hasRecentError(snapshot: any): boolean {
  if (typeof snapshot?.lastAgentError === 'string' && snapshot.lastAgentError !== '') return true
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : []
  for (let i = nodes.length - 1; i >= Math.max(0, nodes.length - 5); i -= 1) {
    const node = nodes[i]
    if (node?.kind === 'turn-error') return true
    if (node?.kind === 'tool-result' && node.isError === true) return true
  }
  return false
}

export function deriveAgentModel(summary: any, snapshot: any, idleEpoch: number): AgentModel {
  const id = String(summary?.id ?? snapshot?.sessionId ?? 'unknown')
  const displayTitle = typeof summary?.displayTitle === 'string' ? summary.displayTitle : id
  const identity = identityFor(id)
  const tool = latestTool(snapshot)
  const files = latestFiles(snapshot)
  const pendingInteraction = summary?.pendingInteraction ?? (Array.isArray(snapshot?.pending) ? snapshot.pending[0] : undefined)
  const running = Boolean(summary?.running ?? snapshot?.running)
  const completed = Boolean(summary?.completed)
  const isSubagent = summary?.origin === 'subagent' || summary?.parentId !== undefined || snapshot?.subagent !== null
  let zone: OfficeZone = 'desk'
  let pose: AgentPose = 'idle'
  let statusLabel = 'Idle'
  let statusTone: AgentModel['statusTone'] = 'gray'
  if (hasRecentError(snapshot)) {
    pose = 'error'; statusLabel = 'Error'; statusTone = 'red'
  } else if (pendingInteraction !== undefined && pendingInteraction !== null) {
    zone = 'boss'; pose = 'approval'; statusLabel = 'Need you'; statusTone = 'amber'
  } else if (tool !== null && running) {
    zone = classifyTool(tool.name); pose = zone === 'desk' ? 'thinking' : 'walking'; statusLabel = zone === 'desk' ? 'Working' : `Using ${tool.name}`; statusTone = 'blue'
  } else if (running) {
    pose = 'thinking'; statusLabel = 'Thinking'; statusTone = 'green'
  } else if (completed) {
    pose = 'completed'; statusLabel = 'Done'; statusTone = 'green'
  } else if (hash(`${id}:${idleEpoch}`) % 5 === 0) {
    zone = 'break'; pose = 'walking'; statusLabel = 'Coffee break'; statusTone = 'gray'
  }
  if (tool !== null && classifyTool(tool.name) === 'collab' && running) {
    zone = 'collab'; pose = 'walking'; statusLabel = 'Calling a coworker'; statusTone = 'blue'
  }
  const args = tool === null ? {} : parseArgs(tool.argsRaw)
  const detail = queryFromArgs(args)
  const toolDetail = tool === null ? '—' : short(`${tool.name}${detail ? ` · ${detail}` : ''}`, 48)
  return {
    id, name: displayTitle, species: identity.species, accent: identity.accent, pose, zone,
    statusLabel, statusTone, running, completed, isSubagent,
    summary: {
      task: latestTask(snapshot, displayTitle), reading: files.reading || '—', editing: files.editing || '—', tool: toolDetail,
      next: pendingInteraction ? 'Waiting for your input' : running ? 'Continue current turn' : completed ? 'Ready for next task' : 'Waiting',
    },
  }
}
