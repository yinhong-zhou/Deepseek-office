import React, { type CSSProperties, type ReactNode } from 'react'
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { Animal, type AgentPose } from './Animal.tsx'
import { deriveAgentModel, type AgentModel, type OfficeZone } from './model.ts'
import styles from './Office.module.css'

const MAX_DESKS = 9
const DESKS = [
  { x: 34, y: 43 }, { x: 50, y: 43 }, { x: 66, y: 43 },
  { x: 34, y: 67 }, { x: 50, y: 67 }, { x: 66, y: 67 },
  { x: 34, y: 86 }, { x: 50, y: 86 }, { x: 66, y: 86 },
]
const ZONES: Record<Exclude<OfficeZone, 'desk'>, { x: number; y: number }> = {
  search: { x: 15, y: 22 }, terminal: { x: 52, y: 19 }, collab: { x: 85, y: 22 }, break: { x: 14, y: 73 }, boss: { x: 51, y: 94 },
}

function idSlot(id: string): number {
  let total = 0
  for (let i = 0; i < id.length; i += 1) total = (total + id.charCodeAt(i) * (i + 3)) % 997
  return total % 4
}

function useIdleEpoch(): number {
  const [epoch, setEpoch] = React.useState(() => Math.floor(Date.now() / 30000))
  React.useEffect(() => {
    const timer = window.setInterval(() => setEpoch(Math.floor(Date.now() / 30000)), 10000)
    return () => window.clearInterval(timer)
  }, [])
  return epoch
}

function useSessionSnapshot(ctx: ClientContext, id: SessionId): any {
  const session = ctx.sessions.binding(id)?.session
  const subscribe = React.useCallback((notify: () => void) => session?.subscribe(notify) ?? (() => {}), [session])
  const getSnapshot = React.useCallback(() => session?.getSnapshot() ?? null, [session])
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

function statusDotClass(tone: AgentModel['statusTone']): string {
  return `${styles.statusDot} ${styles[`tone_${tone}`]}`
}

function workflowValue(value: string): ReactNode { return <span title={value}>{value}</span> }

function WorkflowCard({ model, onOpen }: { model: AgentModel; onOpen: () => void }) {
  return <button className={styles.workflowCard} onClick={onOpen} type="button" style={{ '--accent': model.accent } as CSSProperties}>
    <div className={styles.workflowHeader}>
      <strong>{model.name}</strong>
      <span className={styles.workflowStatus}><i className={statusDotClass(model.statusTone)} />{model.statusLabel}</span>
    </div>
    <div className={styles.taskLine}>{model.summary.task}</div>
    <div className={styles.workflowGrid}>
      <span className={styles.workflowLabel}>Reading</span>{workflowValue(model.summary.reading)}
      <span className={styles.workflowLabel}>Editing</span>{workflowValue(model.summary.editing)}
      <span className={styles.workflowLabel}>Tool</span>{workflowValue(model.summary.tool)}
    </div>
    {model.isSubagent ? <span className={styles.subagentChip}>new hire</span> : null}
  </button>
}

function ActorBadge({ pose, zone }: { pose: AgentPose; zone: OfficeZone }) {
  if (pose === 'error') return <span className={`${styles.actorBubble} ${styles.errorBubble}`}>!</span>
  if (pose === 'completed') return <span className={`${styles.actorBubble} ${styles.doneBubble}`}>✓</span>
  if (zone === 'boss') return <span className={styles.speechBubble}>老板，我需要你</span>
  if (zone === 'break') return <span className={styles.speechBubble}>摸会儿鱼 ☕</span>
  return null
}

function AgentLive({ ctx, summary, deskIndex, idleEpoch }: { ctx: ClientContext; summary: any; deskIndex: number; idleEpoch: number }) {
  const id = String(summary.id) as SessionId
  const snapshot = useSessionSnapshot(ctx, id)
  const model = React.useMemo(() => deriveAgentModel(summary, snapshot, idleEpoch), [summary, snapshot, idleEpoch])
  const desk = DESKS[deskIndex] ?? DESKS[0]!
  const zone = model.zone === 'desk' ? desk : ZONES[model.zone]
  const slot = idSlot(model.id)
  const zoneOffsetX = model.zone === 'desk' ? 0 : (slot - 1.5) * 2.3
  const zoneOffsetY = model.zone === 'desk' ? 0 : (slot % 2) * 1.2
  const facing = model.zone === 'desk' || model.zone === 'terminal' || model.zone === 'search' ? 'back' : 'front'
  return <>
    <div className={styles.workflowAnchor} style={{ left: `${desk.x}%`, top: `${desk.y - 16}%` }}>
      <WorkflowCard model={model} onOpen={() => ctx.sessions.open(id)} />
    </div>
    <button className={`${styles.agentActor} ${styles[`zone_${model.zone}`]}`} style={{ left: `${zone.x + zoneOffsetX}%`, top: `${zone.y + zoneOffsetY}%`, '--accent': model.accent } as CSSProperties} onClick={() => ctx.sessions.open(id)} title={`${model.name} · ${model.statusLabel}`} type="button">
      <Animal species={model.species} accent={model.accent} pose={model.pose} facing={facing} compact={model.zone === 'desk'} />
      <ActorBadge pose={model.pose} zone={model.zone} />
      {model.pose === 'completed' ? <span className={styles.confetti} aria-hidden="true">✦ · ✧</span> : null}
    </button>
  </>
}

function Desk({ index }: { index: number }) {
  const desk = DESKS[index] ?? DESKS[0]!
  return <div className={styles.desk} style={{ left: `${desk.x}%`, top: `${desk.y}%` }}>
    <div className={styles.monitor}><span /></div><div className={styles.keyboard} /><div className={styles.mug} />
    <div className={styles.plant}><i /><i /><i /></div><div className={styles.deskTop} /><div className={styles.deskLegLeft} /><div className={styles.deskLegRight} /><div className={styles.chair} />
  </div>
}

function SearchStation() {
  return <section className={`${styles.zoneCard} ${styles.searchStation}`} aria-label="Search Station">
    <div className={styles.zoneTitle}><b>Search Station</b><span>web_search · web_fetch</span></div>
    <div className={styles.searchCounter}><div className={styles.searchScreen}>⌕<span>SEARCH</span></div></div>
    <div className={styles.zonePlant}><i /><i /><i /></div>
  </section>
}
function TerminalBoard() {
  return <section className={`${styles.zoneCard} ${styles.terminalStation}`} aria-label="Terminal">
    <div className={styles.zoneTitle}><b>Terminal</b><span>bash · pwsh · test · build</span></div>
    <div className={styles.blackboard}><code>&gt; run task</code><code>&gt; build workspace...</code><code>&gt; tests <em>passing</em></code><span className={styles.chalk} /></div>
  </section>
}
function CollaborationZone() {
  return <section className={`${styles.zoneCard} ${styles.collabStation}`} aria-label="Collaboration">
    <div className={styles.zoneTitle}><b>Collaboration</b><span>subagent · fork · spawn</span></div>
    <div className={styles.collabBoard}><i /><i /><i /><i /></div><div className={styles.roundTable}><span /><span /></div>
  </section>
}
function BreakZone() {
  return <section className={`${styles.zoneCard} ${styles.breakStation}`} aria-label="Break Zone">
    <div className={styles.zoneTitle}><b>Break Zone</b><span>coffee · snacks · good vibes</span></div>
    <div className={styles.breakCounter}><div className={styles.coffeeMachine}><i /></div><div className={styles.cookies}>● ● ●</div><div className={styles.cups}>▯ ▯</div></div>
  </section>
}
function BossZone() {
  return <section className={`${styles.zoneCard} ${styles.bossStation}`} aria-label="Boss Approval">
    <div className={styles.bossDesk}><span className={styles.bossMonitor} /><span className={styles.bossLamp} /></div>
    <div className={styles.zoneTitle}><b>Boss / Approval</b><span>ask_user · approval</span></div><div className={styles.youLabel}>YOU</div>
  </section>
}

export function OfficeApp({ ctx }: { ctx: ClientContext }) {
  const [open, setOpen] = React.useState(true)
  const idleEpoch = useIdleEpoch()
  const list = React.useSyncExternalStore(ctx.sessions.list.subscribe, ctx.sessions.list.getSnapshot, ctx.sessions.list.getSnapshot)
  const summaries = React.useMemo(() => {
    const rows = list.ids.map(id => list.byId[id]).filter((row): row is NonNullable<typeof row> => row !== undefined).filter(row => !row.blank || row.id === list.current).sort((a, b) => {
      if (a.id === list.current) return -1
      if (b.id === list.current) return 1
      if (a.running !== b.running) return a.running ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
    return rows.slice(0, MAX_DESKS)
  }, [list])
  const runningCount = summaries.filter(row => row.running).length
  const hiddenCount = Math.max(0, list.ids.length - summaries.length)

  if (!open) return <button className={styles.officeFab} type="button" onClick={() => setOpen(true)}><span>🏢</span><b>DeepSeek-office</b>{runningCount > 0 ? <i>{runningCount}</i> : null}</button>

  return <div className={styles.overlayRoot}><div className={styles.officeShell}>
    <header className={styles.header}>
      <div><h1>DeepSeek-office</h1><p>看看你的 Agent 今天都在忙什么</p></div>
      <div className={styles.headerStats}><span><i className={`${styles.statusDot} ${styles.tone_green}`} />{summaries.length} coworkers</span><span>{runningCount} working</span>{hiddenCount > 0 ? <span>+{hiddenCount} off-screen</span> : null}<button type="button" onClick={() => setOpen(false)} aria-label="Minimize office">—</button></div>
    </header>
    <main className={styles.officeRoom}>
      <div className={styles.backWall} /><SearchStation /><TerminalBoard /><CollaborationZone /><BreakZone /><BossZone />
      <div className={styles.floorGrid} aria-hidden="true" /><div className={styles.pathCenter} aria-hidden="true" />
      {summaries.map((_, index) => <Desk key={`desk-${index}`} index={index} />)}
      {summaries.map((summary, index) => <AgentLive key={String(summary.id)} ctx={ctx} summary={summary} deskIndex={index} idleEpoch={idleEpoch} />)}
      {summaries.length === 0 ? <div className={styles.emptyOffice}><div className={styles.emptyFace}>☕</div><b>办公室今天很安静</b><span>创建或打开一个会话，第一位牛马羊员工就会来上班。</span></div> : null}
    </main>
    <footer className={styles.footer}><span>工位 = 会话</span><span>联网搜索 → Search Station</span><span>命令 / 测试 → Terminal</span><span>Subagent → Collaboration</span><span>需要你 → Boss</span></footer>
  </div></div>
}
