// Program Insights Dashboard
const InsightsPage = ({ data, openDoc, goAsk }) => {
  // Build some mock insights from the dataset
  const totalViews = data.docs.reduce((s, d) => s + d.views, 0);
  const totalDownloads = data.docs.reduce((s, d) => s + d.downloads, 0);
  const totalDocs = data.docs.length;
  const recent30 = data.docs.filter(d => (new Date('2026-04-13') - new Date(d.date)) / 86400000 <= 30).length;

  const topViewed = [...data.docs].sort((a, b) => b.views - a.views).slice(0, 6);
  const topDownloads = [...data.docs].sort((a, b) => b.downloads - a.downloads).slice(0, 5);

  // Geo counts
  const geoCounts = {};
  data.docs.forEach(d => d.geography.forEach(g => geoCounts[g] = (geoCounts[g] || 0) + 1));
  const geoBars = Object.entries(geoCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Topic × geography heat map (gaps visualization)
  const topics = ['Finance', 'Service Delivery', 'Sanitation', 'Climate', 'Schools', 'Government Systems'];
  const countries = ['Rwanda', 'Uganda', 'Honduras', 'Guatemala', 'India', 'Malawi'];
  const heatCell = (topic, country) => {
    const n = data.docs.filter(d => d.topics.includes(topic) && d.geography.includes(country)).length;
    return n;
  };
  const heatColor = (n) => {
    if (n === 0) return '#f2ede1';
    if (n === 1) return '#e3dfcd';
    if (n === 2) return '#c9ddd7';
    if (n === 3) return '#8db9b0';
    return '#2d6e68';
  };
  const heatText = (n) => (n >= 3 ? '#fff' : 'var(--ink-2)');

  // Search terms (mock)
  const noResults = [
    { q: "groundwater monitoring", count: 14 },
    { q: "menstrual hygiene Malawi", count: 9 },
    { q: "tariff India urban", count: 7 },
    { q: "solar pumping maintenance", count: 5 },
  ];
  const topSearches = [
    { q: "Rwanda sanitation", count: 142, result: 8 },
    { q: "tariff", count: 98, result: 12 },
    { q: "Honduras schools", count: 74, result: 3 },
    { q: "climate resilience", count: 61, result: 5 },
  ];

  // Contributions leaderboard
  const contribCounts = {};
  data.docs.forEach(d => d.authors.forEach(a => contribCounts[a] = (contribCounts[a] || 0) + 1));
  const contribLead = Object.entries(contribCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Sparklines (simple path generators)
  const sparkline = (values, color) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const w = 120, h = 32;
    const pts = values.map((v, i) => [i * (w / (values.length - 1)), h - ((v - min) / range) * h]).map(p => p.join(',')).join(' ');
    const area = `M0,${h} L` + values.map((v, i) => `${i * (w / (values.length - 1))},${h - ((v - min) / range) * h}`).join(' L') + ` L${w},${h} Z`;
    return (
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={area} fill={color} opacity="0.15" />
        <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    );
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Insights</div>
          <h1 className="page-title">Program insights dashboard</h1>
          <div className="page-subtitle">What's being read, what's being missed, and where our evidence is thin. Updated nightly from SharePoint analytics and the library metadata.</div>
        </div>
        <div className="page-head-actions">
          <button className="btn"><Icon name="download" /> Export</button>
          <select className="btn"><option>Last 90 days</option><option>Last 30 days</option><option>Last year</option><option>All time</option></select>
        </div>
      </div>

      {/* KPI row */}
      <div className="dash-grid">
        <div className="kpi-card">
          <div className="kpi-label">Resources published</div>
          <div className="kpi-value">{totalDocs}</div>
          <div className="kpi-delta up">+{recent30} in last 30 days</div>
          <div className="kpi-spark">{sparkline([3, 5, 4, 6, 8, 7, 9, 11, 10, 12, 14, totalDocs], 'var(--accent)')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Views</div>
          <div className="kpi-value">{fmtNum(totalViews)}</div>
          <div className="kpi-delta up">+24% vs. prior 90 days</div>
          <div className="kpi-spark">{sparkline([2100, 2800, 3200, 4100, 4800, 5900, 6700, 7200, 8100, 8800, 9400, 10200], 'var(--ink)')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Downloads</div>
          <div className="kpi-value">{fmtNum(totalDownloads)}</div>
          <div className="kpi-delta up">+18%</div>
          <div className="kpi-spark">{sparkline([400, 520, 610, 720, 880, 1050, 1180, 1340, 1510, 1680, 1830, 2010], 'var(--warm)')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Unique readers (30d)</div>
          <div className="kpi-value">247</div>
          <div className="kpi-delta up">+12 staff · +38 external</div>
          <div className="kpi-spark">{sparkline([140, 155, 160, 175, 190, 195, 210, 220, 225, 235, 240, 247], 'var(--gold)')}</div>
        </div>
      </div>

      {/* Row: most read + contributors */}
      <div className="dash-row">
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Most-viewed this quarter</h3>
              <div className="dash-card-sub">Click to inspect the full document card</div>
            </div>
            <select className="sort-select"><option>By views</option><option>By downloads</option></select>
          </div>
          <div className="bar-list">
            {topViewed.map((d, i) => {
              const max = topViewed[0].views;
              const pct = (d.views / max) * 100;
              return (
                <div key={d.id} className={'bar-row ' + (i === 0 ? 'accent' : i === 1 ? 'warm' : i === 2 ? 'gold' : '')} onClick={() => openDoc(d)} style={{ cursor: 'pointer' }}>
                  <div className="label" title={d.title}>{d.title}</div>
                  <div className="bar"><div className="bar-fill" style={{ width: pct + '%' }} /></div>
                  <div className="num">{fmtNum(d.views)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Top contributors</h3>
              <div className="dash-card-sub">By resources published</div>
            </div>
          </div>
          <div className="bar-list">
            {contribLead.map(([name, n], i) => (
              <div key={name} className="bar-row">
                <div className="label">{name}</div>
                <div className="bar"><div className="bar-fill" style={{ width: (n / contribLead[0][1]) * 100 + '%' }} /></div>
                <div className="num">{n}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: 10, borderTop: '1px solid var(--rule)', fontSize: 12, color: 'var(--ink-3)' }}>
            <Icon name="info" size={11} /> 6 country teams haven't contributed in 90 days. <a style={{ color: 'var(--accent)', cursor: 'pointer' }}>Nudge them →</a>
          </div>
        </div>
      </div>

      {/* Geography + coverage heat map */}
      <div className="dash-row">
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Coverage & gaps</h3>
              <div className="dash-card-sub">Resources by topic × country. Light cells = thin evidence.</div>
            </div>
          </div>
          <table className="matrix-table">
            <thead>
              <tr>
                <th></th>
                {countries.map(c => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {topics.map(t => (
                <tr key={t}>
                  <td>{t}</td>
                  {countries.map(c => {
                    const n = heatCell(t, c);
                    return (
                      <td key={c}>
                        <div className="heat-cell" style={{ background: heatColor(n), color: heatText(n) }}>{n || ''}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--ink-3)' }}>
            <span>Gap threshold</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[0, 1, 2, 3, 4].map(n => <div key={n} style={{ width: 20, height: 12, background: heatColor(n), borderRadius: 2 }} />)}
            </div>
            <span>0 → 4+ resources</span>
            <div style={{ marginLeft: 'auto' }}>
              <button className="btn-ghost filter-btn" style={{ background: 'transparent', border: 'none' }} onClick={() => goAsk("Where are our evidence gaps? Suggest what to commission next.")}>
                <Icon name="sparkles" size={11} /> Ask AI what to commission
              </button>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">By country</h3>
              <div className="dash-card-sub">Published resources</div>
            </div>
          </div>
          <div className="bar-list">
            {geoBars.map(([g, n], i) => (
              <div key={g} className="bar-row accent">
                <div className="label">{g}</div>
                <div className="bar"><div className="bar-fill" style={{ width: (n / geoBars[0][1]) * 100 + '%' }} /></div>
                <div className="num">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search insights */}
      <div className="dash-row">
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Top searches</h3>
              <div className="dash-card-sub">Queries from staff and partners, last 30 days</div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>Query</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>Searches</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>Results</th>
              </tr>
            </thead>
            <tbody>
              {topSearches.map(s => (
                <tr key={s.q} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={{ padding: '10px 4px' }}>{s.q}</td>
                  <td style={{ textAlign: 'right', padding: '10px 4px', fontVariantNumeric: 'tabular-nums' }}>{s.count}</td>
                  <td style={{ textAlign: 'right', padding: '10px 4px', fontVariantNumeric: 'tabular-nums', color: s.result < 5 ? 'var(--warm)' : 'var(--ink-3)' }}>{s.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dash-card" style={{ background: 'linear-gradient(180deg, var(--warm-soft) 0%, var(--paper) 100%)' }}>
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Queries with no answers</h3>
              <div className="dash-card-sub">Signals for what to commission next</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {noResults.map(q => (
              <div key={q.q} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: 4, fontSize: 13 }}>
                <span>"{q.q}"</span>
                <span style={{ fontSize: 11, color: 'var(--warm)', fontVariantNumeric: 'tabular-nums' }}>{q.count} tries</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-3)' }}>
            <Icon name="lightbulb" size={12} /> Prompt the learning agenda team to consider these as priority gaps.
          </div>
        </div>
      </div>
    </div>
  );
};

window.InsightsPage = InsightsPage;
