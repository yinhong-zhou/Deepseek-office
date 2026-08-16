import React, { type CSSProperties, type ReactNode } from 'react'
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { Animal, type AgentActivity, type AgentPose } from './Animal.tsx'
import { deriveAgentModel, type AgentModel, type OfficeZone } from './model.ts'
import styles from './Office.module.css'
import polish from './OfficePolish.module.css'

const MAX_DESKS = 6

type Point = { x: number; y: number }

const DESKS: Point[] = [
  { x: 34, y: 49 }, { x: 50, y: 47 }, { x: 66, y: 49 },
  { x: 39, y: 70 }, { x: 55, y: 72 }, { x: 71, y: 70 },
]

const ZONES: Record<Exclude<OfficeZone, 'desk'>, Point> = {
  search: { x: 15, y: 28 },
  terminal: { x: 51, y: 29 },
  collab: { x: 85, y: 28 },
  break: { x: 15, y: 79 },
  boss: { x: 50, y: 93 },
}

const NEW_HIRE_ENTRY: Point = { x: 94, y: 20 }
const COLLAB_WELCOME: Point = { x: 87, y: 29 }

const SHARED_OFFSETS: Point[] = [
  { x: -4.4, y: 0 }, { x: -2.6, y: 1 }, { x: -0.9, y: 0 },
  { x: 0.9, y: 1 }, { x: 2.6, y: 0 }, { x: 4.4, y: 1 },
]

function idSlot(id: string): number {
  let total = 0
  for (let i = 0; i < id.length; i += 1) total = (total + id.charCodeAt(i) * (i + 3)) % 997
  return total % SHARED_OFFSETS.length
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

function corridorPoint(from: Point, to: Point): Point {
  const topTrip = from.y < 38 || to.y < 38
  const bottomTrip = from.y > 82 || to.y > 82
  return { x: 50, y: topTrip ? 36 : bottomTrip ? 82 : 60 }
}

function samePoint(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) < 0.05 && Math.abs(a.y - b.y) < 0.05
}

function useAgentTravel(target: Point, zone: OfficeZone, isSubagent: boolean): { point: Point; moving: boolean; onboarding: boolean } {
  const [point, setPoint] = React.useState<Point>(() => isSubagent ? NEW_HIRE_ENTRY : target)
  const pointRef = React.useRef(point)
  const zoneRef = React.useRef(zone)
  const firstRef = React.useRef(true)
  const [moving, setMoving] = React.useState(isSubagent)
  const [onboarding, setOnboarding] = React.useState(isSubagent)

  React.useEffect(() => { pointRef.current = point }, [point])

  React.useEffect(() => {
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(fn, ms)
      timers.push(timer)
    }

    if (firstRef.current) {
      firstRef.current = false
      zoneRef.current = zone
      if (isSubagent) {
        setMoving(true)
        later(() => setPoint(COLLAB_WELCOME), 80)
        later(() => setPoint(corridorPoint(COLLAB_WELCOME, target)), 560)
        later(() => setPoint(target), 1030)
        later(() => { setMoving(false); setOnboarding(false) }, 1580)
      } else {
        setPoint(target)
      }
      return () => timers.forEach(timer => window.clearTimeout(timer))
    }

    const from = pointRef.current
    if (zoneRef.current === zone && samePoint(from, target)) return undefined
    zoneRef.current = zone
    setMoving(true)
    setOnboarding(false)

    const corridor = corridorPoint(from, target)
    later(() => setPoint(corridor), 30)
    later(() => setPoint(target), 470)
    later(() => setMoving(false), 940)

    return () => timers.forEach(timer => window.clearTimeout(timer))
  }, [isSubagent, target.x, target.y, zone])

  return { point, moving, onboarding }
}

function statusDotClass(tone: AgentModel['statusTone']): string {
  return `${styles.statusDot} ${styles[`tone_${tone}`]}`
}

function workflowValue(value: string): ReactNode {
  return <span title={value}>{value}</span>
}

function WorkflowCard({ model, onOpen }: { model: AgentModel; onOpen: () => void }) {
  return <button
    className={styles.workflowCard}
    onClick={onOpen}
    type="button"
    style={{ '--accent': model.accent } as CSSProperties}
  >
    <div className={styles.workflowHeader}>
      <div className={styles.agentIdentity}>
        <i className={styles.identitySwatch} />
        <strong>{model.name}</strong>
      </div>
      <span className={styles.workflowStatus}><i className={statusDotClass(model.statusTone)} />{model.statusLabel}</span>
    </div>
    <div className={styles.taskLine}>{model.summary.task}</div>
    <div className={styles.workflowGrid}>
      <span className={styles.workflowLabel}>READ</span>{workflowValue(model.summary.reading)}
      <span className={styles.workflowLabel}>EDIT</span>{workflowValue(model.summary.editing)}
      <span className={styles.workflowLabel}>TOOL</span>{workflowValue(model.summary.tool)}
      <span className={styles.workflowLabel}>NEXT</span>{workflowValue(model.summary.next)}
    </div>
    {model.isSubagent ? <span className={styles.subagentChip}>subagent</span> : null}
  </button>
}

function ActorBadge({ pose, zone, onboarding }: { pose: AgentPose; zone: OfficeZone; onboarding: boolean }) {
  if (onboarding) return <span className={`${styles.speechBubble} ${polish.newHireBubble}`}>新员工报到!</span>
  if (pose === 'error') return <span className={`${styles.actorBubble} ${styles.errorBubble}`}>!</span>
  if (pose === 'completed') return <span className={`${styles.actorBubble} ${styles.doneBubble}`}>✓</span>
  if (zone === 'boss') return <span className={styles.speechBubble}>老板，我需要你</span>
  if (zone === 'break') return <span className={styles.speechBubble}>摸会儿鱼 ☕</span>
  if (zone === 'collab') return <span className={styles.speechBubble}>来个人帮忙</span>
  return null
}

function activityForZone(zone: OfficeZone): AgentActivity {
  return zone === 'desk' ? 'desk' : zone
}

function AgentLive({ ctx, summary, deskIndex, idleEpoch }: { ctx: ClientContext; summary: any; deskIndex: number; idleEpoch: number }) {
  const id = String(summary.id) as SessionId
  const snapshot = useSessionSnapshot(ctx, id)
  const model = React.useMemo(() => deriveAgentModel(summary, snapshot, idleEpoch), [summary, snapshot, idleEpoch])
  const desk = DESKS[deskIndex] ?? DESKS[0]!
  const destination = model.zone === 'desk' ? desk : ZONES[model.zone]
  const slot = SHARED_OFFSETS[idSlot(model.id)] ?? { x: 0, y: 0 }
  const target = model.zone === 'desk' ? destination : { x: destination.x + slot.x, y: destination.y + slot.y }
  const travel = useAgentTravel(target, model.zone, model.isSubagent)
  const renderedPose: AgentPose = travel.moving ? 'walking' : model.pose
  const activity = activityForZone(model.zone)
  const deskFacing = renderedPose === 'thinking' || renderedPose === 'idleDesk'
  const facing = travel.moving ? 'front' : model.zone === 'desk' && deskFacing ? 'back' : model.zone === 'search' || model.zone === 'terminal' ? 'back' : 'front'
  const atDesk = model.zone === 'desk' && !travel.moving
  const actorZ = atDesk ? 250 + Math.round(desk.y) : 680 + Math.round(travel.point.y)

  return <>
    <div className={styles.workflowAnchor} style={{ left: `${desk.x}%`, top: `${desk.y - 16}%` }}>
      <WorkflowCard model={model} onOpen={() => ctx.sessions.open(id)} />
    </div>
    <button
      className={`${styles.agentActor} ${styles[`zone_${model.zone}`]} ${travel.moving ? styles.actorMoving : ''} ${polish.actorRoute} ${travel.onboarding ? polish.actorOnboarding : ''}`}
      style={{
        left: `${travel.point.x}%`,
        top: `${travel.point.y}%`,
        zIndex: actorZ,
        '--accent': model.accent,
      } as CSSProperties}
      onClick={() => ctx.sessions.open(id)}
      title={`${model.name} · ${model.statusLabel}`}
      type="button"
    >
      <Animal species={model.species} accent={model.accent} pose={renderedPose} activity={activity} facing={facing} compact={atDesk} />
      <ActorBadge pose={renderedPose} zone={model.zone} onboarding={travel.onboarding} />
      {renderedPose === 'completed' ? <span className={styles.confetti} aria-hidden="true">✦ · ✧ · ✦</span> : null}
      {model.zone !== 'desk' || travel.onboarding ? <span className={styles.actorName}>{model.name}</span> : null}
    </button>
  </>
}

function DeskBack({ index }: { index: number }) {
  const desk = DESKS[index] ?? DESKS[0]!
  return <div className={`${polish.deskLayer} ${polish.deskBack}`} style={{ left: `${desk.x}%`, top: `${desk.y}%`, zIndex: 180 + Math.round(desk.y) }}>
    <div className={styles.deskShadow} />
    <div className={styles.chair}><span /></div>
  </div>
}

function DeskFront({ index }: { index: number }) {
  const desk = DESKS[index] ?? DESKS[0]!
  return <div className={`${polish.deskLayer} ${polish.deskFront}`} style={{ left: `${desk.x}%`, top: `${desk.y}%`, zIndex: 320 + Math.round(desk.y) }}>
    <div className={styles.deskTop}>
      <div className={styles.monitor}><span /><i /></div>
      <div className={styles.keyboard} />
      <div className={styles.mug} />
      <div className={styles.deskPlant}><i /><i /><i /></div>
      <div className={styles.deskPaper} />
    </div>
    <div className={polish.deskApron} />
    <div className={styles.deskLegLeft} /><div className={styles.deskLegRight} />
  </div>
}

function SearchStation() {
  return <section className={`${styles.zoneCard} ${styles.searchStation}`} aria-label="Search Station">
    <div className={styles.zoneHeading}><span className={styles.zoneIcon}>⌕</span><div><b>Search Station</b><small>web_search · web_fetch</small></div></div>
    <div className={styles.searchDesk}>
      <div className={styles.searchMonitor}><div className={styles.searchOrb}>⌕</div><span>SEARCH</span></div>
      <div className={styles.searchStack}><i /><i /><i /></div>
      <div className={styles.searchPlant}><i /><i /><i /></div>
    </div>
  </section>
}

function TerminalBoard() {
  return <section className={`${styles.zoneCard} ${styles.terminalStation}`} aria-label="Terminal blackboard">
    <div className={styles.zoneHeading}><span className={styles.zoneIcon}>&gt;_</span><div><b>Terminal Blackboard</b><small>bash · test · build · git</small></div></div>
    <div className={styles.blackboardFrame}>
      <div className={styles.blackboard}>
        <code><span>$</span> pnpm test</code>
        <code><span>$</span> git diff --stat</code>
        <code className={styles.boardSuccess}>✓ workspace ready</code>
        <i className={styles.chalkA} /><i className={styles.chalkB} />
      </div>
    </div>
  </section>
}

function CollaborationZone() {
  return <section className={`${styles.zoneCard} ${styles.collabStation}`} aria-label="Collaboration zone">
    <div className={styles.zoneHeading}><span className={styles.zoneIcon}>+</span><div><b>Collaboration</b><small>subagent · fork · spawn</small></div></div>
    <div className={polish.newHireDoor}><span>NEW HIRE</span><i>↘</i></div>
    <div className={styles.collabWall}>
      <div className={styles.stickyA} /><div className={styles.stickyB} /><div className={styles.stickyC} />
      <span className={styles.collabLineA} /><span className={styles.collabLineB} />
    </div>
    <div className={styles.collabTable}><span /><span /><i /></div>
  </section>
}

function BreakZone() {
  return <section className={`${styles.zoneCard} ${styles.breakStation}`} aria-label="Break zone">
    <div className={styles.zoneHeading}><span className={styles.zoneIcon}>☕</span><div><b>Coffee & Snacks</b><small>idle employees only</small></div></div>
    <div className={styles.breakCounter}>
      <div className={styles.coffeeMachine}><span /><i /></div>
      <div className={styles.snackJar}><i /><i /><i /></div>
      <div className={styles.snackBox}>SNACKS</div>
      <div className={styles.breakCups}><span /><span /></div>
    </div>
  </section>
}

function BossZone() {
  return <section className={`${styles.zoneCard} ${styles.bossStation}`} aria-label="Boss approval area">
    <div className={polish.bossLookCone} />
    <div className={styles.bossDesk}>
      <div className={styles.bossMonitor}><i /></div>
      <div className={styles.bossLamp}><span /></div>
      <div className={styles.bossPaper} />
    </div>
    <div className={styles.bossCaption}><b>Boss / Approval</b><small>ask_user · permission</small></div>
    <div className={styles.youMarker}><span>YOU</span><i>↑ agents look up at you</i></div>
  </section>
}

function RoomDecor() {
  return <>
    <div className={styles.backWall} />
    <div className={styles.window}><span /><span /><i /></div>
    <div className={styles.wallClock}><i /><b /></div>
    <div className={styles.floorGrid} />
    <div className={styles.centerRug} />
    <div className={polish.mainCorridor} />
    <div className={polish.crossCorridor} />
    <div className={styles.tinyPlantLeft}><i /><i /><i /></div>
    <div className={styles.tinyPlantRight}><i /><i /><i /></div>
  </>
}

export function OfficeApp({ ctx }: { ctx: ClientContext }) {
  const [open, setOpen] = React.useState(true)
  const idleEpoch = useIdleEpoch()
  const list = React.useSyncExternalStore(ctx.sessions.list.subscribe, ctx.sessions.list.getSnapshot, ctx.sessions.list.getSnapshot)
  const summaries = React.useMemo(() => {
    const rows = list.ids
      .map(id => list.byId[id])
      .filter((row): row is NonNullable<typeof row> => row !== undefined)
      .filter(row => !row.blank || row.id === list.current)
      .sort((a, b) => {
        if (a.id === list.current) return -1
        if (b.id === list.current) return 1
        if (a.running !== b.running) return a.running ? -1 : 1
        return b.updatedAt - a.updatedAt
      })
    return rows.slice(0, MAX_DESKS)
  }, [list])

  const runningCount = summaries.filter(row => row.running).length
  const hiddenCount = Math.max(0, list.ids.length - summaries.length)

  if (!open) return <button className={styles.officeFab} type="button" onClick={() => setOpen(true)}>
    <span className={styles.fabBuilding}>▦</span><b>DeepSeek-office</b>{runningCount > 0 ? <i>{runningCount}</i> : null}
  </button>

  return <div className={styles.overlayRoot}><div className={styles.officeShell}>
    <header className={styles.header}>
      <div className={styles.brandBlock}>
        <div className={styles.brandMark}>▦</div>
        <div><h1>DeepSeek-office</h1><p>你的 Agent 牛马羊，今天都在忙什么</p></div>
      </div>
      <div className={styles.headerStats}>
        <span><i className={`${styles.statusDot} ${styles.tone_green}`} />{summaries.length} coworkers</span>
        <span>{runningCount} working</span>
        {hiddenCount > 0 ? <span>+{hiddenCount} off-screen</span> : null}
        <button type="button" onClick={() => setOpen(false)} aria-label="Minimize office">—</button>
      </div>
    </header>

    <main className={styles.officeRoom}>
      <RoomDecor />
      <SearchStation /><TerminalBoard /><CollaborationZone /><BreakZone /><BossZone />
      {summaries.map((_, index) => <DeskBack key={`desk-back-${index}`} index={index} />)}
      {summaries.map((summary, index) => <AgentLive key={String(summary.id)} ctx={ctx} summary={summary} deskIndex={index} idleEpoch={idleEpoch} />)}
      {summaries.map((_, index) => <DeskFront key={`desk-front-${index}`} index={index} />)}
      {summaries.length === 0 ? <div className={styles.emptyOffice}>
        <div className={styles.emptyMascot}>☕</div><b>办公室今天很安静</b><span>创建或打开一个会话，第一位牛马羊员工就会来上班。</span>
      </div> : null}
    </main>

    <footer className={styles.footer}>
      <span><i className={styles.legendDesk} />工位 = 会话</span>
      <span>Search = 联网</span><span>Blackboard = 命令 / 测试</span><span>Collab = Subagent</span><span>Boss = 需要你</span>
    </footer>
  </div></div>
}
