import React, { type ReactNode } from 'react'
import styles from './Office.module.css'
import polish from './OfficePolish.module.css'

export type Species = 'cow' | 'horse' | 'sheep'
export type AgentPose = 'idleDesk' | 'thinking' | 'walking' | 'tool' | 'break' | 'approval' | 'error' | 'completed'
export type Facing = 'front' | 'back'
export type AgentActivity = 'desk' | 'search' | 'terminal' | 'collab' | 'break' | 'boss'

export interface AnimalProps {
  species: Species
  accent: string
  pose: AgentPose
  activity?: AgentActivity
  facing?: Facing
  compact?: boolean
}

interface PoseGeometry {
  bodyY: number
  headTilt: number
  leftArm: string
  rightArm: string
  leftLeg: string
  rightLeg: string
}

const POSES: Record<AgentPose, PoseGeometry> = {
  idleDesk: {
    bodyY: 8,
    headTilt: -3,
    leftArm: 'M38 82 Q30 92 43 100',
    rightArm: 'M82 82 Q90 92 77 100',
    leftLeg: 'M49 119 Q43 121 44 130',
    rightLeg: 'M71 119 Q77 121 76 130',
  },
  thinking: {
    bodyY: 7,
    headTilt: 0,
    leftArm: 'M38 82 Q31 90 45 99',
    rightArm: 'M82 82 Q89 90 75 99',
    leftLeg: 'M49 119 Q42 122 44 130',
    rightLeg: 'M71 119 Q78 122 76 130',
  },
  walking: {
    bodyY: 0,
    headTilt: 1,
    leftArm: 'M38 82 Q22 89 27 105',
    rightArm: 'M82 82 Q98 73 94 58',
    leftLeg: 'M50 119 Q43 126 38 133',
    rightLeg: 'M70 119 Q79 126 84 132',
  },
  tool: {
    bodyY: 0,
    headTilt: -1,
    leftArm: 'M38 82 Q28 76 32 66',
    rightArm: 'M82 82 Q92 76 88 66',
    leftLeg: 'M49 119 L47 132',
    rightLeg: 'M71 119 L73 132',
  },
  break: {
    bodyY: 0,
    headTilt: 3,
    leftArm: 'M38 82 Q27 91 29 104',
    rightArm: 'M82 82 Q94 77 89 67',
    leftLeg: 'M49 119 L47 132',
    rightLeg: 'M71 119 L73 132',
  },
  approval: {
    bodyY: -2,
    headTilt: -9,
    leftArm: 'M38 82 Q29 92 31 105',
    rightArm: 'M82 82 Q91 92 89 105',
    leftLeg: 'M49 119 L48 132',
    rightLeg: 'M71 119 L72 132',
  },
  error: {
    bodyY: 2,
    headTilt: 0,
    leftArm: 'M38 82 Q18 65 34 45',
    rightArm: 'M82 82 Q102 65 86 45',
    leftLeg: 'M49 119 L45 132',
    rightLeg: 'M71 119 L75 132',
  },
  completed: {
    bodyY: -3,
    headTilt: 0,
    leftArm: 'M38 82 Q20 62 22 42',
    rightArm: 'M82 82 Q100 62 98 42',
    leftLeg: 'M49 119 L43 132',
    rightLeg: 'M71 119 L77 132',
  },
}

function activityGeometry(pose: AgentPose, activity: AgentActivity): PoseGeometry {
  const base = POSES[pose]
  if (pose !== 'tool') return base
  if (activity === 'search') {
    return {
      ...base,
      headTilt: -3,
      leftArm: 'M38 82 Q30 70 43 60',
      rightArm: 'M82 82 Q90 70 77 60',
    }
  }
  if (activity === 'terminal') {
    return {
      ...base,
      headTilt: -5,
      leftArm: 'M38 82 Q28 88 29 101',
      rightArm: 'M82 82 Q98 67 101 48',
    }
  }
  if (activity === 'collab') {
    return {
      ...base,
      headTilt: 1,
      leftArm: 'M38 82 Q34 92 49 94',
      rightArm: 'M82 82 Q86 92 71 94',
    }
  }
  return base
}

function Face({ facing, pose }: { facing: Facing; pose: AgentPose }) {
  if (facing === 'back') {
    return <>
      <path d="M43 47 Q60 36 77 47" fill="none" stroke="#d8d6cf" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 52 Q60 45 72 52" fill="none" stroke="#ece9e0" strokeWidth="2" strokeLinecap="round" />
    </>
  }

  const sleepy = pose === 'idleDesk'
  const error = pose === 'error'
  const done = pose === 'completed'
  const approval = pose === 'approval'

  return <>
    {sleepy ? <>
      <path d="M46 49 Q50 52 54 49" fill="none" stroke="#202329" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M66 49 Q70 52 74 49" fill="none" stroke="#202329" strokeWidth="2.8" strokeLinecap="round" />
    </> : approval ? <>
      <ellipse cx="50" cy="48" rx="3.6" ry="5.2" fill="#17191d" />
      <ellipse cx="70" cy="48" rx="3.6" ry="5.2" fill="#17191d" />
      <circle cx="50" cy="45.5" r="1.35" fill="#fff" />
      <circle cx="70" cy="45.5" r="1.35" fill="#fff" />
      <path d="M44 40 Q50 36 55 39" fill="none" stroke="#202329" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 39 Q70 36 76 40" fill="none" stroke="#202329" strokeWidth="2" strokeLinecap="round" />
    </> : <>
      <ellipse cx="50" cy="48" rx={error ? 3.7 : 3.2} ry={error ? 5.4 : 4.6} fill="#17191d" />
      <ellipse cx="70" cy="48" rx={error ? 3.7 : 3.2} ry={error ? 5.4 : 4.6} fill="#17191d" />
      {!error ? <><circle cx="51" cy="46.5" r="1" fill="#fff" /><circle cx="71" cy="46.5" r="1" fill="#fff" /></> : null}
    </>}
    {error ? <path d="M53 62 Q60 56 67 62" fill="none" stroke="#202329" strokeWidth="2.7" strokeLinecap="round" />
      : done ? <path d="M52 58 Q60 68 68 58" fill="none" stroke="#202329" strokeWidth="2.8" strokeLinecap="round" />
      : approval ? <path d="M55 60 Q60 57 65 60" fill="none" stroke="#202329" strokeWidth="2.3" strokeLinecap="round" />
      : <path d="M55 60 Q60 64 65 60" fill="none" stroke="#202329" strokeWidth="2.4" strokeLinecap="round" />}
  </>
}

function CowHead({ facing, pose }: { facing: Facing; pose: AgentPose }) {
  return <>
    <path d="M39 30 Q31 17 37 11 Q44 18 45 31" fill="#ead9be" stroke="#202329" strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M81 30 Q89 17 83 11 Q76 18 75 31" fill="#ead9be" stroke="#202329" strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M35 34 Q20 28 19 37 Q25 45 39 43" fill="#fbfaf5" stroke="#202329" strokeWidth="3.2" />
    <path d="M85 34 Q100 28 101 37 Q95 45 81 43" fill="#fbfaf5" stroke="#202329" strokeWidth="3.2" />
    <path d="M34 33 Q36 19 49 17 Q60 9 73 17 Q86 21 86 40 L82 66 Q75 75 60 75 Q45 75 38 66 Q32 51 34 33 Z" fill="#fbfaf5" stroke="#202329" strokeWidth="4" strokeLinejoin="round" />
    <path d="M57 17 Q61 6 68 18 Q64 23 57 17" fill="#fbfaf5" stroke="#202329" strokeWidth="3" />
    <path d="M73 20 Q84 24 82 41 Q75 47 68 38 Q66 29 73 20" fill="#3d4146" />
    {facing === 'front' ? <>
      <ellipse cx="60" cy="59" rx="25" ry="16" fill="#f5dfd4" stroke="#202329" strokeWidth="3" />
      <Face facing={facing} pose={pose} />
      <circle cx="51" cy="58" r="1.8" fill="#202329" /><circle cx="69" cy="58" r="1.8" fill="#202329" />
    </> : <Face facing={facing} pose={pose} />}
  </>
}

function HorseHead({ facing, pose }: { facing: Facing; pose: AgentPose }) {
  return <>
    <path d="M39 32 Q26 15 35 10 Q45 18 47 32" fill="#caa174" stroke="#202329" strokeWidth="3.2" />
    <path d="M81 32 Q94 15 85 10 Q75 18 73 32" fill="#caa174" stroke="#202329" strokeWidth="3.2" />
    <path d="M35 31 Q38 19 50 16 Q61 10 75 18 Q87 24 85 43 L80 68 Q72 76 60 76 Q48 76 40 68 Q32 52 35 31 Z" fill="#cda477" stroke="#202329" strokeWidth="4" />
    <path d="M47 18 Q60 6 74 18 Q70 27 59 26 Q54 35 46 30" fill="#87603f" stroke="#202329" strokeWidth="2.6" />
    <path d="M79 26 Q90 39 80 60" fill="none" stroke="#87603f" strokeWidth="7" strokeLinecap="round" />
    {facing === 'front' ? <>
      <path d="M51 22 L54 65 L71 65 L73 23 Q61 17 51 22" fill="#f8efe5" opacity=".95" />
      <ellipse cx="60" cy="60" rx="23" ry="15" fill="#f8efe5" stroke="#202329" strokeWidth="3" />
      <Face facing={facing} pose={pose} />
      <circle cx="51" cy="59" r="1.8" fill="#202329" /><circle cx="69" cy="59" r="1.8" fill="#202329" />
    </> : <Face facing={facing} pose={pose} />}
  </>
}

function SheepHead({ facing, pose }: { facing: Facing; pose: AgentPose }) {
  return <>
    <path d="M38 31 Q25 18 32 11 Q42 15 46 30" fill="#d9c6aa" stroke="#202329" strokeWidth="3.2" />
    <path d="M82 31 Q95 18 88 11 Q78 15 74 30" fill="#d9c6aa" stroke="#202329" strokeWidth="3.2" />
    <path d="M38 35 Q23 29 21 38 Q27 46 41 43" fill="#fbfaf5" stroke="#202329" strokeWidth="3.2" />
    <path d="M82 35 Q97 29 99 38 Q93 46 79 43" fill="#fbfaf5" stroke="#202329" strokeWidth="3.2" />
    <path d="M33 37 Q27 25 39 22 Q39 11 51 14 Q60 5 69 15 Q81 13 81 25 Q92 29 87 40 Q92 52 81 58 Q77 72 63 69 Q49 75 41 64 Q28 63 31 50 Q23 43 33 37 Z" fill="#fffdf8" stroke="#202329" strokeWidth="4" strokeLinejoin="round" />
    {facing === 'front' ? <>
      <ellipse cx="60" cy="52" rx="19" ry="20" fill="#f6ddd3" />
      <Face facing={facing} pose={pose} />
      <path d="M58 58 L62 58 L60 62 Z" fill="#df9298" />
    </> : <Face facing={facing} pose={pose} />}
  </>
}

function Mug({ accent }: { accent: string }) {
  return <g className={styles.animalMug}>
    <rect x="86" y="66" width="12" height="14" rx="3" fill="#fffdf8" stroke="#202329" strokeWidth="2.4" />
    <path d="M98 69 Q106 70 103 77 Q101 80 98 79" fill="none" stroke="#202329" strokeWidth="2.3" />
    <path d="M89 64 Q92 60 95 64" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity=".8" />
  </g>
}

function ToolProp({ activity, accent }: { activity: AgentActivity; accent: string }) {
  if (activity === 'terminal') {
    return <g className={polish.toolProp}>
      <rect x="98" y="44" width="12" height="4" rx="2" fill="#f2eadb" stroke="#202329" strokeWidth="1.6" transform="rotate(-20 104 46)" />
      <circle cx="108" cy="43" r="1.5" fill={accent} />
    </g>
  }
  if (activity === 'collab') {
    return <g className={polish.toolProp}>
      <rect x="48" y="87" width="25" height="18" rx="3" fill="#fff" stroke="#202329" strokeWidth="2" />
      <path d="M53 92 H68 M53 97 H65" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </g>
  }
  if (activity === 'search') {
    return <g className={polish.toolProp}>
      <circle cx="60" cy="86" r="7" fill="none" stroke={accent} strokeWidth="2.5" />
      <path d="M65 91 L71 97" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  }
  return null
}

function Effects({ pose, accent, activity }: { pose: AgentPose; accent: string; activity: AgentActivity }) {
  if (pose === 'error') return <g className={styles.animalEffect}>
    <path d="M94 25 Q103 31 98 39" fill="none" stroke="#e45d65" strokeWidth="3" strokeLinecap="round" />
    <circle cx="99" cy="18" r="3" fill="#e45d65" />
  </g>
  if (pose === 'completed') return <g className={styles.animalEffect} fill={accent}>
    <path d="M19 27 l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" opacity=".75" />
    <path d="M102 22 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" opacity=".55" />
  </g>
  if (pose === 'approval') return <g className={styles.animalEffect}>
    <path d="M96 22 Q106 15 110 25" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="111" cy="28" r="2.4" fill={accent} />
  </g>
  if (pose === 'thinking') return <g className={polish.typingEffect} stroke={accent} strokeWidth="2" strokeLinecap="round">
    <path d="M43 101 l-4 3" /><path d="M77 101 l4 3" />
  </g>
  if (pose === 'tool' && activity === 'search') return <g className={polish.searchEffect} fill="none" stroke={accent} strokeWidth="1.8">
    <circle cx="60" cy="26" r="5" opacity=".45" /><circle cx="60" cy="26" r="10" opacity=".2" />
  </g>
  return null
}

function CommonBody({ accent, pose, activity, compact, children }: { accent: string; pose: AgentPose; activity: AgentActivity; compact: boolean; children: ReactNode }) {
  const p = activityGeometry(pose, activity)
  const seated = compact && (pose === 'idleDesk' || pose === 'thinking')
  return <>
    <ellipse className={styles.animalShadow} cx="60" cy={seated ? 132 : 136} rx={seated ? 27 : 32} ry="5.5" fill="rgba(35,44,58,.12)" />
    <g className={`${styles.animalLegs} ${seated ? polish.animalLegsSeated : ''}`}>
      <path d={p.leftLeg} fill="none" stroke="#202329" strokeWidth="9" strokeLinecap="round" />
      <path d={p.rightLeg} fill="none" stroke="#202329" strokeWidth="9" strokeLinecap="round" />
      <path d="M39 132 Q47 137 54 132" fill="#4d5158" stroke="#202329" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M66 132 Q73 137 81 132" fill="#4d5158" stroke="#202329" strokeWidth="2.2" strokeLinejoin="round" />
    </g>
    <g className={`${styles.animalBody} ${seated ? polish.animalBodySeated : ''}`} transform={`translate(0 ${p.bodyY})`}>
      <path d="M38 73 Q32 82 35 107 Q39 120 53 122 L67 122 Q81 120 85 107 Q88 82 82 73 Z" fill="#fbfaf5" stroke="#202329" strokeWidth="4" strokeLinejoin="round" />
      <path className={styles.animalArmLeft} d={p.leftArm} fill="none" stroke="#202329" strokeWidth="8.5" strokeLinecap="round" />
      <path className={styles.animalArmRight} d={p.rightArm} fill="none" stroke="#202329" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M36 76 Q60 89 84 76" fill="none" stroke={accent} strokeWidth="7.5" strokeLinecap="round" />
      <path d="M76 78 Q88 83 83 94" fill={accent} stroke="#202329" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M57 85 L57 103 L67 103 L67 85" fill="none" stroke="#202329" strokeWidth="2" />
      <rect x="53" y="99" width="18" height="19" rx="3.2" fill="#fff" stroke="#202329" strokeWidth="2.4" />
      <circle cx="62" cy="108" r="2.6" fill={accent} opacity=".7" />
      <g className={styles.animalHead} style={{ transform: `rotate(${p.headTilt}deg)`, transformOrigin: '60px 72px' }}>
        {children}
      </g>
      {pose === 'break' ? <Mug accent={accent} /> : null}
      {pose === 'tool' ? <ToolProp activity={activity} accent={accent} /> : null}
      <Effects pose={pose} accent={accent} activity={activity} />
    </g>
  </>
}

export function Animal({ species, accent, pose, activity = 'desk', facing = 'front', compact = false }: AnimalProps) {
  const head = species === 'cow'
    ? <CowHead facing={facing} pose={pose} />
    : species === 'horse'
      ? <HorseHead facing={facing} pose={pose} />
      : <SheepHead facing={facing} pose={pose} />

  return <svg
    className={`${styles.animal} ${styles[`pose_${pose}`] ?? ''} ${polish[`activity_${activity}`] ?? ''} ${compact ? styles.animalCompact : ''}`}
    viewBox="0 0 120 145"
    role="img"
    aria-label={`${species} office worker`}
  >
    <CommonBody accent={accent} pose={pose} activity={activity} compact={compact}>{head}</CommonBody>
  </svg>
}
