// Sidebar nav + topbar
const { useState } = React;

const Sidebar = ({ page, setPage, data }) => {
  const navItems = [
    { section: 'Discover' },
    { key: 'browse', label: 'Browse library', icon: 'library', count: data.docs.length },
    { key: 'ask', label: 'Ask the library', icon: 'sparkles', badge: 'AI' },
    { key: 'collections', label: 'Collections', icon: 'stack', count: data.collections.length },
    { key: 'bookmarks', label: 'My reading list', icon: 'bookmark', count: 4 },
    { section: 'Contribute' },
    { key: 'upload', label: 'Upload a resource', icon: 'upload' },
    { section: 'Insights' },
    { key: 'dashboard', label: 'Program insights', icon: 'chart' },
    { key: 'gaps', label: 'Coverage & gaps', icon: 'globe' },
    { section: 'Resources' },
    { key: 'style', label: 'Editorial style guide', icon: 'book' },
    { key: 'tags', label: 'Tag reference', icon: 'tag' },
    { key: 'agenda', label: 'Learning agenda', icon: 'lightbulb' },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><img src="assets/wfp-logo.jpg" alt="Water For People" /></div>
        <div>
          <div className="brand-name">Program Learning</div>
          <div className="brand-sub">Library · Water For People</div>
        </div>
      </div>
      <div className="nav">
        {navItems.map((item, i) => item.section
          ? <div key={i} className="nav-section">{item.section}</div>
          : (
            <button
              key={item.key}
              className={'nav-item' + (page === item.key ? ' active' : '')}
              onClick={() => setPage(item.key)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.count !== undefined && <span className="count">{item.count}</span>}
              {item.badge && <span className="count" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 10, fontSize: 9 }}>{item.badge}</span>}
            </button>
          )
        )}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--rule)', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
        <div style={{ fontWeight: 500, color: 'var(--ink-2)', marginBottom: 2 }}>Help</div>
        <div>Watch the 3-minute tour</div>
        <div>Ask your librarian →</div>
      </div>
    </aside>
  );
};

const Topbar = ({ crumbs = [], rightSlot }) => (
  <div className="topbar">
    <div className="crumb">
      <span>Intranet</span>
      <Icon name="chevron" size={10} />
      <span>Program Learning Library</span>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          <Icon name="chevron" size={10} />
          <b>{c}</b>
        </React.Fragment>
      ))}
    </div>
    <div className="topbar-spacer" />
    {rightSlot}
    <button className="iconbtn" title="Notifications"><Icon name="bell" size={15} /></button>
    <button className="iconbtn" title="Settings"><Icon name="settings" size={15} /></button>
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>LM</div>
  </div>
);

Object.assign(window, { Sidebar, Topbar });
