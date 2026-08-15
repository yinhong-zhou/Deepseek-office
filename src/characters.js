function safeAccent(accent) {
  return /^#[0-9a-f]{6}$/i.test(String(accent || '')) ? accent : '#4f73e8'
}

function speciesHead(species, front) {
  if (species === 'horse') {
    return front
      ? `
        <path d="M38 38 Q34 17 44 10 Q49 25 50 31" fill="#d6b68e" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <path d="M82 38 Q86 17 76 10 Q71 25 70 31" fill="#d6b68e" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <path d="M43 24 Q57 8 74 20 Q66 30 57 28 Q50 35 43 24Z" fill="#a77c51" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <path d="M37 38 Q60 24 83 38 L80 78 Q60 91 40 78Z" fill="#d4af7e" stroke="#17191d" stroke-width="4"/>
        <path d="M49 36 Q60 30 70 36 L68 68 Q60 76 52 68Z" fill="#f6f1e9"/>
        <ellipse cx="51" cy="51" rx="4" ry="6" fill="#17191d"/><ellipse cx="69" cy="51" rx="4" ry="6" fill="#17191d"/>
        <ellipse cx="60" cy="68" rx="22" ry="14" fill="#f8f1e8" stroke="#17191d" stroke-width="4"/>
        <circle cx="53" cy="66" r="2.2" fill="#17191d"/><circle cx="67" cy="66" r="2.2" fill="#17191d"/>
        <path d="M55 72 Q60 77 65 72" fill="none" stroke="#17191d" stroke-width="3.5" stroke-linecap="round"/>
      `
      : `
        <path d="M38 38 Q34 17 44 10 Q49 25 50 31" fill="#d6b68e" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <path d="M82 38 Q86 17 76 10 Q71 25 70 31" fill="#d6b68e" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <path d="M43 24 Q57 8 74 20 Q66 30 57 28 Q50 35 43 24Z" fill="#a77c51" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <path d="M37 38 Q60 24 83 38 L80 78 Q60 91 40 78Z" fill="#d4af7e" stroke="#17191d" stroke-width="4"/>
        <path d="M79 39 Q88 48 82 65" fill="none" stroke="#9b6f46" stroke-width="5" stroke-linecap="round"/>
      `
  }

  if (species === 'sheep') {
    return front
      ? `
        <path d="M37 35 Q31 19 40 14 Q45 19 47 29" fill="#c8aa82" stroke="#17191d" stroke-width="4"/>
        <path d="M83 35 Q89 19 80 14 Q75 19 73 29" fill="#c8aa82" stroke="#17191d" stroke-width="4"/>
        <path d="M33 38 Q30 27 40 24 Q43 15 53 21 Q60 12 67 21 Q79 17 82 28 Q91 32 85 42 Q91 52 82 59 Q83 70 73 72 Q64 80 56 74 Q44 79 39 68 Q28 65 32 54 Q23 46 33 38Z" fill="#fbfaf5" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
        <ellipse cx="60" cy="51" rx="22" ry="20" fill="#f4d8c6"/>
        <ellipse cx="52" cy="50" rx="4" ry="6" fill="#17191d"/><ellipse cx="68" cy="50" rx="4" ry="6" fill="#17191d"/>
        <path d="M57 60 Q60 64 63 60" fill="none" stroke="#17191d" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M60 56 l-3 -3 h6Z" fill="#df7e88"/>
      `
      : `
        <path d="M37 35 Q31 19 40 14 Q45 19 47 29" fill="#c8aa82" stroke="#17191d" stroke-width="4"/>
        <path d="M83 35 Q89 19 80 14 Q75 19 73 29" fill="#c8aa82" stroke="#17191d" stroke-width="4"/>
        <path d="M33 38 Q30 27 40 24 Q43 15 53 21 Q60 12 67 21 Q79 17 82 28 Q91 32 85 42 Q91 52 82 59 Q83 70 73 72 Q64 80 56 74 Q44 79 39 68 Q28 65 32 54 Q23 46 33 38Z" fill="#fbfaf5" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
      `
  }

  return front
    ? `
      <path d="M40 34 Q34 17 43 12 Q49 24 49 32" fill="#e3c99f" stroke="#17191d" stroke-width="4"/>
      <path d="M80 34 Q86 17 77 12 Q71 24 71 32" fill="#e3c99f" stroke="#17191d" stroke-width="4"/>
      <path d="M39 35 Q29 31 26 38 Q32 46 43 42" fill="#f7f4ed" stroke="#17191d" stroke-width="4"/>
      <path d="M81 35 Q91 31 94 38 Q88 46 77 42" fill="#f7f4ed" stroke="#17191d" stroke-width="4"/>
      <path d="M36 39 Q60 25 84 39 L81 78 Q60 91 39 78Z" fill="#fbfaf5" stroke="#17191d" stroke-width="4"/>
      <ellipse cx="72" cy="47" rx="12" ry="14" fill="#4c4f55"/>
      <ellipse cx="51" cy="51" rx="4" ry="6" fill="#17191d"/><ellipse cx="69" cy="51" rx="4" ry="6" fill="#17191d"/>
      <ellipse cx="60" cy="67" rx="24" ry="15" fill="#f3ddcf" stroke="#17191d" stroke-width="4"/>
      <circle cx="52" cy="65" r="2.2" fill="#17191d"/><circle cx="68" cy="65" r="2.2" fill="#17191d"/>
      <path d="M55 72 Q60 77 65 72" fill="none" stroke="#17191d" stroke-width="3.5" stroke-linecap="round"/>
    `
    : `
      <path d="M40 34 Q34 17 43 12 Q49 24 49 32" fill="#e3c99f" stroke="#17191d" stroke-width="4"/>
      <path d="M80 34 Q86 17 77 12 Q71 24 71 32" fill="#e3c99f" stroke="#17191d" stroke-width="4"/>
      <path d="M39 35 Q29 31 26 38 Q32 46 43 42" fill="#f7f4ed" stroke="#17191d" stroke-width="4"/>
      <path d="M81 35 Q91 31 94 38 Q88 46 77 42" fill="#f7f4ed" stroke="#17191d" stroke-width="4"/>
      <path d="M36 39 Q60 25 84 39 L81 78 Q60 91 39 78Z" fill="#fbfaf5" stroke="#17191d" stroke-width="4"/>
      <path d="M68 34 Q79 38 82 50" fill="none" stroke="#4c4f55" stroke-width="12" stroke-linecap="round" opacity=".9"/>
    `
}

function body(species, accent, front) {
  const fluffy = species === 'sheep'
  return `
    <ellipse cx="60" cy="139" rx="32" ry="5" fill="#d7d9de" opacity=".55"/>
    ${front ? speciesHead(species, true) : speciesHead(species, false)}
    <path d="M38 78 Q60 67 82 78 ${fluffy ? 'Q89 87 84 96 Q91 105 84 113 Q87 125 76 126 Q69 136 60 130 Q50 136 44 127 Q33 127 35 116 Q27 108 34 99 Q28 88 38 78Z' : 'Q91 95 83 126 Q60 137 37 126 Q29 96 38 78Z'}" fill="#fbfaf5" stroke="#17191d" stroke-width="4" stroke-linejoin="round"/>
    <path d="M40 82 Q60 91 80 82" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
    <path d="M77 82 Q86 84 84 91 L79 101 Q75 95 74 87Z" fill="${accent}" stroke="#17191d" stroke-width="3"/>
    <path d="M43 92 Q33 99 34 112" fill="none" stroke="#17191d" stroke-width="8" stroke-linecap="round"/>
    <path d="M77 92 Q87 99 86 112" fill="none" stroke="#17191d" stroke-width="8" stroke-linecap="round"/>
    <path d="M49 124 V136" stroke="#17191d" stroke-width="9" stroke-linecap="round"/>
    <path d="M71 124 V136" stroke="#17191d" stroke-width="9" stroke-linecap="round"/>
    ${front ? '<path d="M60 91 V111" stroke="#31343a" stroke-width="3"/><rect x="51" y="107" width="18" height="16" rx="3" fill="#fff" stroke="#17191d" stroke-width="3"/>' : ''}
    ${species === 'cow' ? '<path d="M80 111 Q101 110 94 126" fill="none" stroke="#17191d" stroke-width="3"/><path d="M91 124 q8 -6 10 2 q-4 7 -10 2Z" fill="#44474d" stroke="#17191d" stroke-width="3"/>' : ''}
    ${species === 'horse' ? '<path d="M80 112 Q102 113 97 127 Q89 130 90 120" fill="#a77c51" stroke="#17191d" stroke-width="3"/>' : ''}
  `
}

export function characterSvg({ species = 'cow', accent = '#4f73e8', facing = 'front', state = 'thinking' } = {}) {
  const color = safeAccent(accent)
  const front = facing === 'front'
  const stateClass = String(state || '').replace(/[^a-z0-9_-]/gi, '')
  return `
    <svg class="agent-svg agent-svg--${stateClass}" viewBox="0 0 120 150" role="img" aria-label="${species} agent">
      ${body(species, color, front)}
    </svg>
  `
}
