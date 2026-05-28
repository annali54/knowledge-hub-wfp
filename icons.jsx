// Icon library + shared primitives
const Icon = ({ name, size = 16, ...rest }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", ...rest };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    library: <><path d="M4 4h4v16H4z"/><path d="M10 4h4v16h-4z"/><path d="m16 5 3.5 1-3 14.5-3.5-1z"/></>,
    sparkles: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></>,
    upload: <><path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
    bookmark: <><path d="M6 3h12v18l-6-4-6 4z"/></>,
    book: <><path d="M4 4h9a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M17 8h3v12h-3"/></>,
    tag: <><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7" cy="8" r="1.2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    filter: <><path d="M3 5h18M6 12h12M10 19h4"/></>,
    x: <><path d="M18 6 6 18M6 6l12 12"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <><path d="m5 13 4 4 10-10"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/></>,
    world: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    trend: <><path d="m3 17 6-6 4 4 8-8M14 7h7v7"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 19v3"/></>,
    sort: <><path d="M8 3v18M4 7l4-4 4 4M16 21V3M20 17l-4 4-4-4"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    external: <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></>,
    quote: <><path d="M7 7h4v4H7z M13 7h4v4h-4z M7 11c0 3-2 5-5 5M13 11c0 3-2 5-5 5"/></>,
    stack: <><path d="m12 3 9 4-9 4-9-4z"/><path d="m3 12 9 4 9-4"/><path d="m3 17 9 4 9-4"/></>,
    lightbulb: <><path d="M9 18h6M10 22h4M12 3a6 6 0 0 1 4 10.5c-.8.7-1 1.5-1 2.5H9c0-1-.2-1.8-1-2.5A6 6 0 0 1 12 3z"/></>,
    language: <><path d="M4 5h10M9 3v2M4 14c0-2.2 3-6 5-6s5 3.8 5 6M14 14H4"/><path d="M13 20l3-8 3 8M14.5 17h3"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

// Thumbnail — stylized preview per type
const Thumb = ({ doc, large = false }) => {
  const cls = `doc-thumb ${doc.thumb}`;
  const labelMap = { tech: "Technical", case: "Case study", blog: "Blog", deck: "Deck", video: "Video" };
  return (
    <div className={cls} style={large ? { height: 180 } : {}}>
      <span className="doc-thumb-label">{labelMap[doc.thumb] || doc.type}</span>
      {doc.thumb === 'video' && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      )}
      {doc.thumb === 'tech' && (
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-3)', padding: '0 14px', textAlign: 'center', lineHeight: 1.2 }}>
          {doc.title.split(' ').slice(0, 4).join(' ')}…
        </div>
      )}
      {doc.thumb === 'case' && (
        <div style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--warm)', fontStyle: 'italic' }}>
          Case<br/>Study
        </div>
      )}
      {doc.thumb === 'blog' && (
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, color: '#1e524d', padding: '0 10px', textAlign: 'center', lineHeight: 1.2 }}>
          {doc.title.split(' ').slice(0, 3).join(' ')}
        </div>
      )}
      {doc.thumb === 'deck' && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>
          {doc.pages} slides
        </div>
      )}
    </div>
  );
};

// Formatters
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
const fmtDateShort = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', d: 'numeric', year: 'numeric' });
};
const fmtNum = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
};

// Tag chip palette rotation
const tagTone = (t) => {
  const low = t.toLowerCase();
  if (/(rwanda|africa|uganda|kenya|malawi)/.test(low)) return '';
  if (/(blog|video|case|deck|report|note|tool)/.test(low)) return 'teal';
  if (/(district|government|office|policy|systems)/.test(low)) return 'gold';
  return 'neutral';
};

Object.assign(window, { Icon, Thumb, fmtDate, fmtDateShort, fmtNum, tagTone });
