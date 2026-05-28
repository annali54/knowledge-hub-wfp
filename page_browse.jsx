// Browse Library page
const { useState: useStateB, useMemo: useMemoB } = React;

const BrowsePage = ({ data, openDoc, goAsk }) => {
  const [query, setQuery] = useStateB("");
  const [sort, setSort] = useStateB("recent");
  const [activeFilters, setActiveFilters] = useStateB({});  // {geography: Set, topic: Set, type: Set, language: Set}
  const [openFacet, setOpenFacet] = useStateB({ geography: true, topic: true, type: true, language: false });
  const [view, setView] = useStateB("list");

  const toggleFilter = (cat, val) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      const set = new Set(next[cat] || []);
      if (set.has(val)) set.delete(val); else set.add(val);
      next[cat] = set;
      return next;
    });
  };
  const clearFilter = (cat, val) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      const set = new Set(next[cat] || []);
      set.delete(val);
      next[cat] = set;
      return next;
    });
  };
  const clearAll = () => setActiveFilters({});

  const filtered = useMemoB(() => {
    let list = data.docs;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.tags.join(' ').toLowerCase().includes(q) ||
        d.authors.join(' ').toLowerCase().includes(q)
      );
    }
    Object.entries(activeFilters).forEach(([cat, set]) => {
      if (!set || set.size === 0) return;
      list = list.filter(d => {
        if (cat === 'geography') return d.geography.some(g => set.has(g));
        if (cat === 'topic') return d.topics.some(t => set.has(t));
        if (cat === 'type') return set.has(d.type);
        if (cat === 'language') return set.has(d.language);
        if (cat === 'collection') return set.has(d.collection);
        return true;
      });
    });
    list = [...list];
    if (sort === 'recent') list.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === 'popular') list.sort((a, b) => b.views - a.views);
    if (sort === 'downloads') list.sort((a, b) => b.downloads - a.downloads);
    if (sort === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [query, activeFilters, sort]);

  const activeCount = Object.values(activeFilters).reduce((s, set) => s + (set?.size || 0), 0);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Program Learning Library</div>
          <h1 className="page-title">A working archive of what we've learned.</h1>
          <div className="page-subtitle">Every technical note, case study, presentation, and field blog published by the program team — searchable, summarizable, and connected.</div>
        </div>
        <div className="page-head-actions">
          <button className="btn" onClick={() => goAsk()}>
            <Icon name="sparkles" /> Ask the library
          </button>
          <button className="btn btn-accent" onClick={() => window.__setPage('upload')}>
            <Icon name="upload" /> Upload resource
          </button>
        </div>
      </div>

      <div className="collections-strip">
        {data.collections.map(c => (
          <div key={c.id} className={`collection-card ${c.color}`}>
            <div className="coll-label">{c.label}</div>
            <div className="coll-title serif">{c.title}</div>
            <div className="coll-count">{c.count} resources</div>
          </div>
        ))}
      </div>

      <div className="search-shell">
        <Icon name="search" size={18} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search titles, authors, tags, full text…"
        />
        <div className="search-mode">
          <button className="active">Keyword</button>
          <button onClick={() => goAsk(query)}>Semantic</button>
          <button onClick={() => goAsk(query)}>Ask AI</button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="micro" style={{ marginRight: 4 }}>Quick filters</div>
        {['Rwanda', 'Uganda', 'Honduras', 'Global'].map(g => (
          <button key={g} className={'filter-btn' + (activeFilters.geography?.has(g) ? ' has-value' : '')} onClick={() => toggleFilter('geography', g)}>{g}</button>
        ))}
        <div style={{ width: 1, height: 18, background: 'var(--rule)' }} />
        {['Technical Note', 'Case Study', 'Report', 'Blog'].map(t => (
          <button key={t} className={'filter-btn' + (activeFilters.type?.has(t) ? ' has-value' : '')} onClick={() => toggleFilter('type', t)}>{t}</button>
        ))}
        <div style={{ width: 1, height: 18, background: 'var(--rule)' }} />
        {['EN', 'ES'].map(l => (
          <button key={l} className={'filter-btn' + (activeFilters.language?.has(l) ? ' has-value' : '')} onClick={() => toggleFilter('language', l)}>
            <Icon name="language" size={11} /> {l}
          </button>
        ))}
        {activeCount > 0 && (
          <button className="btn-ghost filter-btn" style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)' }} onClick={clearAll}>
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="results-layout">
        <div>
          <div className="result-header">
            <div className="result-count">
              <b>{filtered.length}</b> resource{filtered.length === 1 ? '' : 's'}
              {activeCount > 0 && <span> · filtered</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="recent">Most recent</option>
                <option value="popular">Most viewed</option>
                <option value="downloads">Most downloaded</option>
                <option value="alpha">Alphabetical</option>
              </select>
              <div style={{ display: 'flex', border: '1px solid var(--rule-2)', borderRadius: 4 }}>
                <button onClick={() => setView('list')} style={{ padding: '4px 8px', background: view === 'list' ? 'var(--ink)' : 'transparent', color: view === 'list' ? '#fff' : 'var(--ink-3)' }} title="List"><Icon name="list" size={14} /></button>
                <button onClick={() => setView('grid')} style={{ padding: '4px 8px', background: view === 'grid' ? 'var(--ink)' : 'transparent', color: view === 'grid' ? '#fff' : 'var(--ink-3)' }} title="Grid"><Icon name="grid" size={14} /></button>
              </div>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 4 }}>No matches</div>
              <div style={{ fontSize: 13 }}>Try a broader query, or <a style={{ color: 'var(--accent)' }} onClick={() => goAsk(query)}>ask the library in plain English →</a></div>
            </div>
          )}

          {view === 'list' && (
            <div className="doc-list">
              {filtered.map(doc => (
                <div key={doc.id} className="doc-card" onClick={() => openDoc(doc)}>
                  <Thumb doc={doc} />
                  <div className="doc-body">
                    <div className="doc-meta">
                      <span>{doc.type}</span>
                      <span className="dot" />
                      <span>{doc.geography.join(', ')}</span>
                      <span className="dot" />
                      <span>{fmtDate(doc.date)}</span>
                      <span className="dot" />
                      <span>{doc.language}</span>
                    </div>
                    <h3 className="doc-title">{doc.title}</h3>
                    <div className="doc-authors">By <em>{doc.authors.join(', ')}</em></div>
                    <p className="doc-summary">{doc.summary}</p>
                    <div className="doc-tags">
                      {doc.tags.slice(0, 4).map(t => <span key={t} className={'chip ' + tagTone(t)}>{t}</span>)}
                    </div>
                  </div>
                  <div className="doc-actions">
                    <div className="doc-stats">
                      <div>{fmtNum(doc.views)} views</div>
                      <div>{fmtNum(doc.downloads)} downloads</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="iconbtn" onClick={e => e.stopPropagation()} title="Save"><Icon name="bookmark" size={14} /></button>
                      <button className="iconbtn" onClick={e => e.stopPropagation()} title="Share"><Icon name="share" size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 12 }}>
              {filtered.map(doc => (
                <div key={doc.id} onClick={() => openDoc(doc)} style={{ cursor: 'pointer' }}>
                  <Thumb doc={doc} large />
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 3 }}>{doc.type} · {fmtDate(doc.date)}</div>
                    <div className="serif" style={{ fontSize: 15, lineHeight: 1.2, marginBottom: 6 }}>{doc.title}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {doc.tags.slice(0, 2).map(t => <span key={t} className={'chip ' + tagTone(t)}>{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="rail">
          <div className="rail-card">
            <h4 className="rail-title">Refine</h4>
            {[
              ['geography', 'Geography'],
              ['topic', 'Topic'],
              ['type', 'Product type'],
              ['language', 'Language'],
              ['collection', 'Collection'],
            ].map(([cat, label]) => (
              <div key={cat} className={'facet' + (openFacet[cat] ? ' open' : '')}>
                <div className="facet-head" onClick={() => setOpenFacet(p => ({ ...p, [cat]: !p[cat] }))}>
                  <span>{label}</span>
                  <Icon name="chevron" size={10} />
                </div>
                {openFacet[cat] && (
                  <div className="facet-body">
                    {data.facets[cat].slice(0, 6).map(val => {
                      const on = activeFilters[cat]?.has(val);
                      const count = data.docs.filter(d => {
                        if (cat === 'geography') return d.geography.includes(val);
                        if (cat === 'topic') return d.topics.includes(val);
                        if (cat === 'type') return d.type === val;
                        if (cat === 'language') return d.language === val;
                        if (cat === 'collection') return d.collection === val;
                      }).length;
                      return (
                        <div key={val} className={'facet-row' + (on ? ' on' : '')} onClick={() => toggleFilter(cat, val)}>
                          <div className="box">{on && <Icon name="check" size={9} />}</div>
                          <span>{val}</span>
                          <span className="count">{count}</span>
                        </div>
                      );
                    })}
                    {data.facets[cat].length > 6 && (
                      <div style={{ fontSize: 11.5, color: 'var(--accent)', paddingTop: 6, cursor: 'pointer' }}>
                        Show {data.facets[cat].length - 6} more…
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rail-card" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }}>
            <h4 className="rail-title" style={{ color: 'rgba(255,255,255,0.6)' }}>Tip</h4>
            <div className="serif" style={{ fontSize: 17, lineHeight: 1.3, marginBottom: 10 }}>"What have we learned about sanitation finance in Rwanda?"</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Ask the library in plain English. It synthesizes across documents and cites its sources.</div>
            <button className="btn" style={{ background: '#fff', color: 'var(--ink)', borderColor: '#fff' }} onClick={() => goAsk()}>
              <Icon name="sparkles" size={14} /> Try it
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

window.BrowsePage = BrowsePage;
