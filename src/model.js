export const SPECIES = ['cow', 'horse', 'sheep']

export const ACCENTS = [
  '#4f73e8',
  '#25a27b',
  '#f09b39',
  '#8b67d6',
  '#e86d83',
  '#2f9fb6',
  '#6e7c91',
  '#c47c52',
]

export const DESKS = [
  { id: 'desk-1', x: 35, y: 45 },
  { id: 'desk-2', x: 50, y: 45 },
  { id: 'desk-3', x: 65, y: 45 },
  { id: 'desk-4', x: 35, y: 68 },
  { id: 'desk-5', x: 50, y: 68 },
  { id: 'desk-6', x: 65, y: 68 },
]

export const ZONES = {
  search: { id: 'search', x: 15, y: 24, label: 'Search Station' },
  terminal: { id: 'terminal', x: 50, y: 20, label: 'Terminal Blackboard' },
  collaboration: { id: 'collaboration', x: 83, y: 25, label: 'Collaboration' },
  break: { id: 'break', x: 15, y: 72, label: 'Break Zone' },
  boss: { id: 'boss', x: 50, y: 91, label: 'Boss / Approval' },
}

const FILE_TOOLS = new Set([
  'read', 'edit', 'write', 'glob', 'grep', 'lsp', 'ls', 'find', 'patch',
  'read_file', 'write_file', 'edit_file', 'apply_patch',
])

const SEARCH_TOOLS = new Set([
  'web_search', 'web_fetch', 'search_web', 'browser_search', 'browser_fetch',
])

const TERMINAL_TOOLS = new Set([
  'bash', 'pwsh', 'shell', 'terminal', 'terminal_open', 'terminal_send',
  'run_command', 'execute_command', 'test', 'build', 'deploy',
])

const COLLAB_TOOLS = new Set([
  'subagent', 'subagent_fork', 'spawn_subagent', 'delegate',
])

const BOSS_TOOLS = new Set([
  'ask_user_question', 'ask_user', 'request_approval', 'approval',
])

export function stableHash(value = '') {
  let hash = 2166136261
  const input = String(value)
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash >>> 0)
}

export function createIdentity(sessionId, index = 0) {
  const seed = stableHash(sessionId || `agent-${index + 1}`)
  return {
    species: SPECIES[seed % SPECIES.length],
    accent: ACCENTS[(seed + index * 3) % ACCENTS.length],
  }
}

export function normalizeToolName(name = '') {
  return String(name).trim().toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
}

export function zoneForTool(toolName = '') {
  const name = normalizeToolName(toolName)
  if (SEARCH_TOOLS.has(name) || name.startsWith('web_') || name.includes('search')) return 'search'
  if (TERMINAL_TOOLS.has(name) || name.startsWith('terminal_') || name.includes('shell')) return 'terminal'
  if (COLLAB_TOOLS.has(name) || name.includes('subagent')) return 'collaboration'
  if (BOSS_TOOLS.has(name) || name.includes('approval') || name.includes('ask_user')) return 'boss'
  if (FILE_TOOLS.has(name) || name.includes('file') || name.includes('grep') || name.includes('glob')) return 'desk'
  return 'desk'
}

export function basename(path = '') {
  const clean = String(path).replaceAll('\\', '/')
  const parts = clean.split('/')
  return parts.at(-1) || clean || '—'
}

export function pathFromToolInput(input = {}) {
  if (!input || typeof input !== 'object') return ''
  return input.path || input.file || input.filePath || input.filename || input.target || ''
}

export function makeAgent({ id, name, deskIndex, task, reading, editing, tool, status = 'thinking', location = 'desk' }) {
  const identity = createIdentity(id, deskIndex)
  return {
    id,
    name,
    deskIndex,
    ...identity,
    task: task || 'Waiting for work',
    status,
    location,
    reading: reading || '',
    editing: editing || '',
    tool: tool || '',
    next: '',
    question: '',
    error: '',
    timeline: [],
    lastUpdated: Date.now(),
  }
}

export function createDemoAgents() {
  return [
    makeAgent({
      id: 'session-marvis',
      name: 'Marvis',
      deskIndex: 0,
      task: 'Connect Harness events to the office',
      reading: 'src/events/tool.ts',
      editing: 'src/office/store.ts',
      status: 'thinking',
    }),
    makeAgent({
      id: 'session-app',
      name: 'App Agent',
      deskIndex: 1,
      task: 'Refine office interaction states',
      reading: 'src/App.tsx',
      editing: 'src/styles.css',
      status: 'thinking',
    }),
    makeAgent({
      id: 'session-data',
      name: 'Data Agent',
      deskIndex: 2,
      task: 'Inspect plugin API docs',
      reading: 'docs/plugin-api.md',
      status: 'thinking',
    }),
    makeAgent({
      id: 'session-code',
      name: 'Code Agent',
      deskIndex: 3,
      task: 'Run integration tests',
      reading: 'tests/office.test.ts',
      editing: 'src/harnessAdapter.ts',
      status: 'thinking',
    }),
    makeAgent({
      id: 'session-file',
      name: 'File Agent',
      deskIndex: 4,
      task: 'Index workspace files',
      reading: 'src/model.ts',
      status: 'thinking',
    }),
    makeAgent({
      id: 'session-test',
      name: 'Test Agent',
      deskIndex: 5,
      task: 'Validate UI transitions',
      reading: 'src/office.css',
      editing: 'tests/state.test.ts',
      status: 'thinking',
    }),
  ]
}

function timelineEntry(label, detail = '') {
  return { at: Date.now(), label, detail }
}

function appendTimeline(agent, entry) {
  return [entry, ...(agent.timeline || [])].slice(0, 8)
}

export function applyOfficeEvent(agent, event = {}) {
  if (!agent) return agent
  const type = String(event.type || event.event || '').toLowerCase()
  const toolName = event.toolName || event.tool || event.name || ''
  const toolZone = zoneForTool(toolName)
  const filePath = pathFromToolInput(event.input || event.args || event)
  const next = { ...agent, lastUpdated: Date.now() }

  if (type.includes('thinking') || type === 'assistant/start' || type === 'agent/start') {
    next.status = 'thinking'
    next.location = 'desk'
    next.error = ''
    next.question = ''
    next.timeline = appendTimeline(next, timelineEntry('Back at desk', 'Thinking'))
    return next
  }

  if (type.includes('tool') && (type.includes('call') || type.includes('start') || type.includes('use'))) {
    next.status = 'tool'
    next.tool = toolName || 'tool'
    next.location = toolZone
    next.error = ''
    if (filePath) {
      const normalized = normalizeToolName(toolName)
      if (normalized.includes('edit') || normalized.includes('write') || normalized.includes('patch')) next.editing = filePath
      else next.reading = filePath
    }
    const locationLabel = toolZone === 'desk' ? 'at desk' : ZONES[toolZone]?.label || toolZone
    next.timeline = appendTimeline(next, timelineEntry(`Using ${next.tool}`, locationLabel))
    return next
  }

  if (type.includes('tool') && (type.includes('result') || type.includes('end') || type.includes('done') || type.includes('finish'))) {
    next.status = 'thinking'
    next.location = 'desk'
    next.tool = ''
    next.timeline = appendTimeline(next, timelineEntry('Tool finished', toolName || 'Back to work'))
    return next
  }

  if (type.includes('subagent') || normalizeToolName(toolName).includes('subagent')) {
    next.status = 'subagent'
    next.location = 'collaboration'
    next.tool = toolName || 'subagent'
    next.timeline = appendTimeline(next, timelineEntry('New teammate', event.childName || 'Subagent joined'))
    return next
  }

  if (type.includes('approval') || type.includes('ask_user') || type.includes('question')) {
    next.status = 'approval'
    next.location = 'boss'
    next.question = event.question || event.prompt || event.message || 'Need your input'
    next.timeline = appendTimeline(next, timelineEntry('Needs you', next.question))
    return next
  }

  if (type.includes('idle')) {
    next.status = 'idle'
    next.location = event.break === false ? 'desk' : 'break'
    next.timeline = appendTimeline(next, timelineEntry('Idle', next.location === 'break' ? 'Coffee break' : 'At desk'))
    return next
  }

  if (type.includes('error') || event.error) {
    next.status = 'error'
    next.location = 'desk'
    next.error = typeof event.error === 'string' ? event.error : event.message || 'Something went wrong'
    next.timeline = appendTimeline(next, timelineEntry('Error', next.error))
    return next
  }

  if (type.includes('complete') || type.includes('completed') || type.includes('finish')) {
    next.status = 'completed'
    next.location = 'desk'
    next.tool = ''
    next.timeline = appendTimeline(next, timelineEntry('Done', event.message || 'Task completed'))
    return next
  }

  if (type.includes('read') && filePath) {
    next.reading = filePath
    next.status = 'thinking'
    next.location = 'desk'
    next.timeline = appendTimeline(next, timelineEntry('Reading', filePath))
    return next
  }

  if ((type.includes('edit') || type.includes('write')) && filePath) {
    next.editing = filePath
    next.status = 'thinking'
    next.location = 'desk'
    next.timeline = appendTimeline(next, timelineEntry('Editing', filePath))
    return next
  }

  return next
}

export function eventAgentId(event = {}) {
  return event.sessionId || event.agentId || event.session_id || event.agent_id || event.id || ''
}

export function upsertAgentForEvent(agents, event = {}) {
  const id = eventAgentId(event) || agents[0]?.id || 'session-current'
  const found = agents.findIndex((agent) => agent.id === id)
  if (found >= 0) {
    const copy = [...agents]
    copy[found] = applyOfficeEvent(copy[found], event)
    return copy
  }
  const deskIndex = Math.min(agents.length, DESKS.length - 1)
  const newAgent = makeAgent({
    id,
    name: event.agentName || event.sessionName || `Agent ${agents.length + 1}`,
    deskIndex,
    task: event.task || 'New session',
  })
  return [...agents, applyOfficeEvent(newAgent, event)].slice(0, DESKS.length)
}

export const DEMO_SCRIPT = [
  { sessionId: 'session-marvis', type: 'tool/call', toolName: 'web_search', query: 'DeepSeek Harness plugin events' },
  { sessionId: 'session-marvis', type: 'tool/result', toolName: 'web_search' },
  { sessionId: 'session-code', type: 'tool/call', toolName: 'bash', command: 'npm test' },
  { sessionId: 'session-app', type: 'subagent/created', toolName: 'subagent', childName: 'UI helper' },
  { sessionId: 'session-file', type: 'session/idle', break: true },
  { sessionId: 'session-code', type: 'tool/result', toolName: 'bash' },
  { sessionId: 'session-data', type: 'approval/requested', question: 'Can I continue with this API mapping?' },
  { sessionId: 'session-test', type: 'agent/error', error: 'Snapshot mismatch' },
  { sessionId: 'session-app', type: 'agent/thinking' },
  { sessionId: 'session-file', type: 'agent/thinking' },
  { sessionId: 'session-test', type: 'agent/thinking' },
  { sessionId: 'session-data', type: 'agent/thinking' },
  { sessionId: 'session-marvis', type: 'tool/call', toolName: 'read', input: { path: 'src/plugin.ts' } },
  { sessionId: 'session-marvis', type: 'tool/result', toolName: 'read' },
  { sessionId: 'session-app', type: 'agent/completed', message: 'Interaction states ready' },
  { sessionId: 'session-app', type: 'agent/thinking' },
]

export function demoEventAt(index) {
  return DEMO_SCRIPT[index % DEMO_SCRIPT.length]
}
