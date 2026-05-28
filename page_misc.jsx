// Document detail modal + simple stub pages
const DocModal = ({ doc, onClose, goAsk }) => {
  if (!doc) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 20, padding: 24, borderBottom: '1px solid var(--rule)', alignItems: 'flex-start' }}>
          <div style={{ width: 100, flexShrink: 0 }}>
            <Thumb doc={doc} large />
          </div>
          <div style={{ flex: 1 }}>
            <div className="doc-meta" style={{ marginBottom: 10 }}>
              <span>{doc.type}</span>
              <span className="dot" />
              <span>{doc.geography.join(', ')}</span>
              <span className="dot" />
              <span>{fmtDate(doc.date)}</span>
              <span className="dot" />
              <span>{doc.language}</span>
              <span className="dot" />
              <span>{doc.pages ? doc.pages + ' pages' : '—'}</span>
            </div>
            <h2 className="serif" style={{ fontSize: 26, lineHeight: 1.15, margin: '0 0 8px' }}>{doc.title}</h2>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 14 }}>By <em style={{ fontStyle: 'normal', color: 'var(--ink-2)' }}>{doc.authors.join(', ')}</em></div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <button className="btn btn-primary"><Icon name="eye" size={13} /> Open document</button>
              <button className="btn"><Icon name="download" size={13} /> Download</button>
              <button className="btn"><Icon name="bookmark" size={13} /> Save</button>
              <button className="btn"><Icon name="share" size={13} /> Share</button>
            </div>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div style={{ padding: '20px 24px 26px' }}>
          <div className="micro" style={{ marginBottom: 8 }}>Summary</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: '0 0 18px' }}>{doc.summary}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <div className="micro" style={{ marginBottom: 6 }}>Topics</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {doc.topics.map(t => <span key={t} className="chip gold">{t}</span>)}
              </div>
            </div>
            <div>
              <div className="micro" style={{ marginBottom: 6 }}>Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {doc.tags.map(t => <span key={t} className={'chip ' + tagTone(t)}>{t}</span>)}
              </div>
            </div>
          </div>

          <div className="micro" style={{ marginBottom: 6 }}>Collection</div>
          <div style={{ fontSize: 13.5, marginBottom: 16 }}>{doc.collection}</div>

          <div style={{ padding: 14, background: 'var(--accent-soft)', borderRadius: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="sparkles" size={16} />
            <div style={{ flex: 1, fontSize: 13 }}>Want a specific answer from this document?</div>
            <button className="btn" onClick={() => { onClose(); goAsk(`From "${doc.title}", what are the key findings?`); }}>
              Ask this document →
            </button>
          </div>

          <div style={{ marginTop: 20, fontSize: 11.5, color: 'var(--ink-4)', display: 'flex', justifyContent: 'space-between' }}>
            <span>ID: {doc.id.toUpperCase()} · {fmtNum(doc.views)} views · {fmtNum(doc.downloads)} downloads</span>
            <span>Last reviewed by librarian: Jan 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StubPage = ({ title, subtitle, icon = 'book', children }) => (
  <div className="content">
    <div className="page-head">
      <div>
        <div className="micro" style={{ marginBottom: 8 }}>Resources</div>
        <h1 className="page-title">{title}</h1>
        <div className="page-subtitle">{subtitle}</div>
      </div>
    </div>
    <div className="empty" style={{ padding: 60 }}>
      <div style={{ color: 'var(--ink-3)', marginBottom: 10 }}><Icon name={icon} size={28} /></div>
      <div className="serif" style={{ fontSize: 20, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 420, margin: '0 auto' }}>This section lives on but isn't the focus of this prototype. Hook it up to a SharePoint list or Word doc once the rest of the hub is approved.</div>
      {children}
    </div>
  </div>
);

window.DocModal = DocModal;
window.StubPage = StubPage;
