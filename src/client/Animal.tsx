import React, { type ReactNode } from 'react'
import styles from './Office.module.css'

export type Species = 'cow' | 'horse' | 'sheep'
export type AgentPose = 'idle' | 'thinking' | 'walking' | 'error' | 'completed' | 'approval'
export type Facing = 'front' | 'back'

export interface AnimalProps {
  species: Species
  accent: string
  pose: AgentPose
  facing?: Facing
  compact?: boolean
}

function CommonBody({ accent, pose, children }: { accent: string; pose: AgentPose; children: ReactNode }) {
  const armLeft = pose === 'error' ? 'M28 70 Q12 54 25 41' : pose === 'completed' ? 'M28 72 Q12 54 12 35' : 'M29 70 Q18 76 18 90'
  const armRight = pose === 'error' ? 'M72 70 Q88 54 75 41' : pose === 'completed' ? 'M72 72 Q88 54 88 35' : 'M71 70 Q82 76 82 90'
  return <>
    <ellipse cx="50" cy="111" rx="30" ry="5" fill="rgba(40,55,75,.10)" />
    <path d="M28 61 Q23 70 27 94 Q31 106 43 108 L57 108 Q69 106 73 94 Q77 70 72 61 Z" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3.8" strokeLinejoin="round" />
    <path className={styles.animalArm} d={armLeft} fill="none" stroke="#1f2329" strokeWidth="8" strokeLinecap="round" />
    <path className={styles.animalArm} d={armRight} fill="none" stroke="#1f2329" strokeWidth="8" strokeLinecap="round" />
    <path d="M38 106 L38 113" stroke="#1f2329" strokeWidth="9" strokeLinecap="round" />
    <path d="M62 106 L62 113" stroke="#1f2329" strokeWidth="9" strokeLinecap="round" />
    <path d="M27 64 Q50 76 73 64" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
    <path d="M67 65 Q76 71 72 80" fill={accent} stroke="#1f2329" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M47 72 L47 92 L57 92 L57 72" fill="none" stroke="#1f2329" strokeWidth="2" />
    <rect x="43" y="87" width="14" height="16" rx="2.8" fill="#fff" stroke="#1f2329" strokeWidth="2.4" />
    {children}
  </>
}

function Cow({ accent, pose, facing }: Omit<AnimalProps, 'species' | 'compact'>) {
  return <CommonBody accent={accent} pose={pose}>
    <path d="M34 26 Q28 15 33 8 Q38 16 39 24" fill="#e9dbc7" stroke="#1f2329" strokeWidth="3" />
    <path d="M66 26 Q72 15 67 8 Q62 16 61 24" fill="#e9dbc7" stroke="#1f2329" strokeWidth="3" />
    <path d="M28 31 Q15 24 13 32 Q17 40 31 39" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3" />
    <path d="M72 31 Q85 24 87 32 Q83 40 69 39" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3" />
    <path d="M25 31 Q25 18 39 15 Q50 9 61 15 Q75 18 75 33 L72 58 Q66 66 50 66 Q34 66 28 58 Z" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3.8" />
    <path d="M47 15 Q51 4 57 16 Q53 20 47 15" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3" />
    <path d="M60 18 Q72 23 70 39 Q63 44 57 35 Q55 26 60 18" fill="#3d4146" />
    <path d="M26 76 Q32 70 36 79 Q34 89 27 91" fill="#3d4146" />
    <path d="M67 84 Q75 81 73 94 Q68 99 63 94" fill="#3d4146" />
    {facing === 'front' ? <>
      <ellipse cx="50" cy="48" rx="25" ry="16" fill="#f7e2d7" stroke="#1f2329" strokeWidth="3" />
      <ellipse cx="40" cy="34" rx="3.2" ry="5.7" fill="#111" /><ellipse cx="60" cy="34" rx="3.2" ry="5.7" fill="#111" />
      <circle cx="42" cy="47" r="1.8" fill="#111" /><circle cx="58" cy="47" r="1.8" fill="#111" />
      <path d="M45 54 Q50 59 55 54" fill="none" stroke="#1f2329" strokeWidth="2.4" strokeLinecap="round" />
    </> : <>
      <path d="M35 40 Q50 28 65 40" fill="none" stroke="#d9d4ca" strokeWidth="3" strokeLinecap="round" />
      <path d="M57 22 Q66 29 67 39" fill="none" stroke="#3d4146" strokeWidth="8" strokeLinecap="round" />
    </>}
    <path d="M73 88 Q90 86 87 102" fill="none" stroke="#1f2329" strokeWidth="3" strokeLinecap="round" />
    <path d="M87 101 Q94 99 91 108 Q86 112 83 105 Z" fill="#3d4146" stroke="#1f2329" strokeWidth="2" />
  </CommonBody>
}

function Horse({ accent, pose, facing }: Omit<AnimalProps, 'species' | 'compact'>) {
  return <CommonBody accent={accent} pose={pose}>
    <path d="M31 30 Q20 13 29 9 Q37 17 39 28" fill="#c99c69" stroke="#1f2329" strokeWidth="3" />
    <path d="M69 30 Q80 13 71 9 Q63 17 61 28" fill="#c99c69" stroke="#1f2329" strokeWidth="3" />
    <path d="M26 30 Q29 17 40 14 Q50 8 63 16 Q74 22 73 41 L68 61 Q61 67 50 67 Q39 67 32 61 Q25 49 26 30 Z" fill="#cda577" stroke="#1f2329" strokeWidth="3.8" />
    <path d="M37 16 Q49 5 62 16 Q58 25 47 24 Q43 32 36 28" fill="#8f633f" stroke="#1f2329" strokeWidth="2.5" />
    <path d="M69 26 Q77 37 69 56" fill="none" stroke="#8f633f" strokeWidth="7" strokeLinecap="round" />
    <path d="M26 73 Q33 68 36 77 Q34 87 27 91" fill="#9b6b45" /><path d="M66 86 Q74 83 73 94 Q69 100 63 95" fill="#9b6b45" />
    {facing === 'front' ? <>
      <path d="M40 21 L43 58 L58 58 L61 22 Q50 17 40 21" fill="#f8f1e7" opacity=".94" />
      <ellipse cx="50" cy="49" rx="23" ry="15" fill="#f8f1e7" stroke="#1f2329" strokeWidth="3" />
      <ellipse cx="40" cy="34" rx="3.1" ry="5.8" fill="#111" /><ellipse cx="60" cy="34" rx="3.1" ry="5.8" fill="#111" />
      <circle cx="42" cy="48" r="1.8" fill="#111" /><circle cx="58" cy="48" r="1.8" fill="#111" />
      <path d="M45 55 Q50 59 55 55" fill="none" stroke="#1f2329" strokeWidth="2.4" strokeLinecap="round" />
    </> : <path d="M37 20 Q50 13 63 20" fill="none" stroke="#8f633f" strokeWidth="8" strokeLinecap="round" />}
    <path d="M73 88 Q86 88 86 99" fill="none" stroke="#1f2329" strokeWidth="3" strokeLinecap="round" />
    <path d="M84 97 Q94 96 91 106 Q84 110 80 103 Z" fill="#8f633f" stroke="#1f2329" strokeWidth="2" />
  </CommonBody>
}

function Sheep({ accent, pose, facing }: Omit<AnimalProps, 'species' | 'compact'>) {
  return <CommonBody accent={accent} pose={pose}>
    <path d="M31 29 Q18 23 16 32 Q21 40 34 37" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3" />
    <path d="M69 29 Q82 23 84 32 Q79 40 66 37" fill="#fbfaf6" stroke="#1f2329" strokeWidth="3" />
    <path d="M31 25 Q23 13 30 9 Q39 13 40 26" fill="#d8c6ac" stroke="#1f2329" strokeWidth="3" />
    <path d="M69 25 Q77 13 70 9 Q61 13 60 26" fill="#d8c6ac" stroke="#1f2329" strokeWidth="3" />
    <path d="M24 34 Q20 23 30 20 Q31 10 41 13 Q50 6 57 14 Q69 12 69 23 Q79 27 75 38 Q79 49 69 55 Q65 66 52 63 Q40 68 33 59 Q20 57 24 45 Q17 39 24 34 Z" fill="#fffdf8" stroke="#1f2329" strokeWidth="3.8" strokeLinejoin="round" />
    <path d="M25 75 Q32 69 36 79 Q34 89 27 91" fill="#8b7b6a" /><path d="M66 86 Q74 83 73 94 Q69 100 63 95" fill="#8b7b6a" />
    {facing === 'front' ? <>
      <ellipse cx="50" cy="43" rx="18" ry="18" fill="#f7dfd4" />
      <ellipse cx="42" cy="39" rx="3" ry="5.5" fill="#111" /><ellipse cx="58" cy="39" rx="3" ry="5.5" fill="#111" />
      <path d="M48 46 L52 46 L50 49 Z" fill="#e79096" />
      <path d="M45 53 Q50 58 55 53" fill="none" stroke="#1f2329" strokeWidth="2.4" strokeLinecap="round" />
    </> : <path d="M33 31 Q50 22 67 31" fill="none" stroke="#e7e1d7" strokeWidth="5" strokeLinecap="round" />}
  </CommonBody>
}

export function Animal({ species, accent, pose, facing = 'front', compact = false }: AnimalProps) {
  const body = species === 'cow' ? <Cow accent={accent} pose={pose} facing={facing} /> : species === 'horse' ? <Horse accent={accent} pose={pose} facing={facing} /> : <Sheep accent={accent} pose={pose} facing={facing} />
  return <svg className={`${styles.animal} ${styles[`pose_${pose}`]} ${compact ? styles.animalCompact : ''}`} viewBox="0 0 100 120" role="img" aria-label={`${species} office worker`}>{body}</svg>
}
