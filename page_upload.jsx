// Upload flow with AI-powered auto-tagging
const { useState: useStateU, useRef: useRefU } = React;

const UploadPage = ({ data, useAI = true, onDone }) => {
  const [stage, setStage] = useStateU('drop'); // drop | analyzing | review | publishing | done
  const [file, setFile] = useStateU(null);
  const [dragActive, setDragActive] = useStateU(false);
  const [form, setForm] = useStateU({
    title: '', authors: '', summary: '', type: 'Technical Note',
    geography: [], topics: [], language: 'EN', collection: '',
  });
  const [suggestedTags, setSuggestedTags] = useStateU([]);
  const [aiStatus, setAiStatus] = useStateU('');
  const inputRef = useRefU(null);

  const simulateAnalysis = async (f) => {
    setStage('analyzing');
    setAiStatus('Extracting text from file…');
    await new Promise(r => setTimeout(r, 700));
    setAiStatus('Identifying language and structure…');
    await new Promise(r => setTimeout(r, 700));
    setAiStatus('Generating summary and tags…');

    // Infer a plausible title from filename
    const base = f.name.replace(/\.[^.]+$/, '').replace(/[_\-]+/g, ' ');
    const pretendTitle = base.replace(/\b\w/g, c => c.toUpperCase());
    const isSpanish = /es[_-]|espanol|español|honduras|guate|bolivia|peru/i.test(f.name);

    // Sample "extracted text" — in reality this would be PDF/Word text
    const pretendExtract = `This document discusses water and sanitation programming, community finance mechanisms, district-level coordination with government partners, and measurement approaches. Geographic focus appears to be ${isSpanish ? 'Latin American' : 'East African'} contexts. Authors discuss lessons learned and recommendations for scaling.`;

    let result = {
      title: pretendTitle,
      summary: `A program resource examining ${pretendTitle.toLowerCase()}. Explores implementation approaches, key findings, and implications for practitioners working on similar programs.`,
      type: 'Technical Note',
      language: isSpanish ? 'ES' : 'EN',
      geography: isSpanish ? ['Honduras'] : ['Rwanda'],
      topics: ['Finance', 'Service Delivery'],
      tags: ['community finance', 'district partnership', isSpanish ? 'Latin America' : 'Africa', 'case study'],
      authors: 'Staff contributor',
      collection: 'Learning & Innovation Agenda'
    };

    if (useAI && window.claude?.complete) {
      try {
        const prompt = `You are a librarian for Water For People. Based on this filename and pretend-extract, suggest metadata.

FILENAME: ${f.name}
EXTRACT: ${pretendExtract}

Respond in JSON only, no preamble:
{
  "title": "clean human title",
  "summary": "2 sentence summary, ~40 words, written in the extract's language",
  "type": "Technical Note | Case Study | Blog | Report | Presentation | Tool | Video",
  "language": "EN or ES",
  "geography": ["Country1"],
  "topics": ["Topic1","Topic2"],
  "tags": ["kebab-case-tag", "another-tag", "region"],
  "authors": "likely author name or Staff contributor",
  "collection": "Scaling with Government | Learning & Innovation Agenda | Sustainable Services | Climate | Innovation"
}`;
        const resp = await window.claude.complete(prompt);
        const jsonMatch = resp.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          result = { ...result, ...parsed };
        }
      } catch (e) { /* keep fallback */ }
    } else {
      await new Promise(r => setTimeout(r, 600));
    }

    setForm({
      title: result.title,
      authors: result.authors,
      summary: result.summary,
      type: result.type,
      language: result.language,
      geography: Array.isArray(result.geography) ? result.geography : [result.geography].filter(Boolean),
      topics: Array.isArray(result.topics) ? result.topics : [result.topics].filter(Boolean),
      collection: result.collection || '',
    });
    setSuggestedTags(Array.isArray(result.tags) ? result.tags : []);
    setAiStatus('');
    setStage('review');
  };

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    simulateAnalysis(f);
  };

  const publish = async () => {
    setStage('publishing');
    await new Promise(r => setTimeout(r, 900));
    setStage('done');
  };

  const addSuggestedTag = (t) => {
    setSuggestedTags(prev => prev.filter(x => x !== t));
    // add to topics list for simplicity
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Contribute</div>
          <h1 className="page-title">Upload a resource</h1>
          <div className="page-subtitle">Drop a file. The library reads it, summarizes, and proposes tags — you review, edit, and publish. Most uploads take under a minute.</div>
        </div>
        {stage !== 'drop' && (
          <div className="page-head-actions">
            <button className="btn" onClick={() => { setStage('drop'); setFile(null); }}>← Start over</button>
          </div>
        )}
      </div>

      <div className="upload-wrap">
        {stage === 'drop' && (
          <>
            <div
              className={'drop-zone' + (dragActive ? ' active' : '')}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={e => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              <div className="drop-icon"><Icon name="upload" size={22} /></div>
              <h2 className="drop-title">Drop a file, or click to browse</h2>
              <div className="drop-sub">One file at a time. The library does the rest — metadata, summary, tags, language detection.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary"><Icon name="upload" size={13}/> Choose file</button>
                <button className="btn">Paste a link instead</button>
              </div>
              <div className="drop-formats">PDF · DOCX · PPTX · MP4 · PNG/JPG · max 500 MB</div>
            </div>

            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { icon: 'sparkles', title: 'Auto-summarized', sub: 'AI reads your document and drafts a 2-sentence abstract — in English or Spanish.' },
                { icon: 'tag', title: 'Smart tagging', sub: 'Geography, topic, product type, and collection all suggested from content — you confirm.' },
                { icon: 'check', title: 'One-button publish', sub: 'Review the draft, hit publish. Pipeline triggers translation, librarian review, and surface to board.' },
              ].map((b, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: 6 }}>
                  <div style={{ color: 'var(--accent)', marginBottom: 8 }}><Icon name={b.icon} size={18} /></div>
                  <div className="serif" style={{ fontSize: 17, marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {(stage === 'analyzing' || stage === 'review' || stage === 'publishing' || stage === 'done') && (
          <div className="upload-stage">
            <div className="upload-file-bar">
              <div className="file-icon">{file?.name.split('.').pop()?.toUpperCase().slice(0, 3)}</div>
              <div className="file-info">
                <div className="file-name">{file?.name}</div>
                <div className="file-stats">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ''} · uploaded {fmtDateShort(new Date().toISOString().slice(0, 10))}</div>
              </div>
              {stage === 'analyzing' && (
                <div className="analyzing"><div className="spin" /> {aiStatus || 'Analyzing…'}</div>
              )}
              {stage === 'review' && (
                <div className="chip teal"><Icon name="sparkles" size={11} /> Ready to review</div>
              )}
              {stage === 'done' && <div className="chip teal"><Icon name="check" size={11} /> Published</div>}
            </div>

            {stage === 'analyzing' && (
              <div style={{ padding: '48px 24px', display: 'grid', gap: 14, maxWidth: 520, margin: '0 auto' }}>
                {['Extracting text and structure', 'Detecting language', 'Generating summary', 'Suggesting tags', 'Matching to collections'].map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: i < 3 ? 'var(--ink-2)' : 'var(--ink-4)' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 50, border: '1.5px solid var(--accent)', borderTopColor: i < 3 ? 'var(--accent)' : 'transparent', animation: i === 3 ? 'spin 0.8s linear infinite' : 'none', background: i < 3 ? 'var(--accent)' : 'transparent' }} />
                    {step}
                  </div>
                ))}
              </div>
            )}

            {(stage === 'review' || stage === 'publishing') && (
              <>
                <div className="upload-form">
                  <div className="form-field full ai-filled">
                    <label className="form-label">Title <span className="ai-badge"><Icon name="sparkles" size={9} /> AI draft</span></label>
                    <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="form-field full ai-filled">
                    <label className="form-label">Summary <span className="ai-badge"><Icon name="sparkles" size={9} /> AI draft</span></label>
                    <textarea className="form-textarea" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Product type</label>
                    <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      {['Technical Note', 'Case Study', 'Blog', 'Report', 'Presentation', 'Tool', 'Video'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Language <span className="ai-badge"><Icon name="sparkles" size={9} /> detected</span></label>
                    <select className="form-select" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                      <option value="EN">English</option>
                      <option value="ES">Spanish</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Author(s)</label>
                    <input className="form-input" value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Collection</label>
                    <select className="form-select" value={form.collection} onChange={e => setForm({ ...form, collection: e.target.value })}>
                      <option value="">—</option>
                      {data.collections.map(c => <option key={c.id}>{c.title}</option>)}
                      <option>Learning & Innovation Agenda</option>
                      <option>Sustainable Services</option>
                    </select>
                  </div>
                  <div className="form-field full">
                    <label className="form-label">Geography <span className="ai-badge"><Icon name="sparkles" size={9} /> suggested</span></label>
                    <div className="tag-input">
                      {form.geography.map(g => (
                        <span key={g} className="chip neutral">{g}<span className="chip-close" onClick={() => setForm({ ...form, geography: form.geography.filter(x => x !== g) })}>×</span></span>
                      ))}
                      <input placeholder="Add a country or region…" />
                    </div>
                  </div>
                  <div className="form-field full">
                    <label className="form-label">Topics & tags <span className="ai-badge"><Icon name="sparkles" size={9} /> {suggestedTags.length} suggested</span></label>
                    <div className="tag-input">
                      {form.topics.map(t => (
                        <span key={t} className="chip">{t}<span className="chip-close" onClick={() => setForm({ ...form, topics: form.topics.filter(x => x !== t) })}>×</span></span>
                      ))}
                      {suggestedTags.map(t => (
                        <span key={t} className="chip suggested" onClick={() => { setForm({ ...form, topics: [...form.topics, t] }); addSuggestedTag(t); }}>{t}</span>
                      ))}
                      <input placeholder="Type to add a custom tag…" />
                    </div>
                  </div>
                </div>

                <div className="upload-footer">
                  <div className="footer-note">
                    <Icon name="info" size={12} /> AI-drafted fields are shaded. Review before publishing — your edits train the librarian for next time.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn">Save as draft</button>
                    <button className="btn btn-primary" onClick={publish} disabled={stage === 'publishing'}>
                      {stage === 'publishing' ? 'Publishing…' : <><Icon name="check" size={13} /> Publish to library</>}
                    </button>
                  </div>
                </div>
              </>
            )}

            {stage === 'done' && (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, margin: '0 auto 14px', borderRadius: 50, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                  <Icon name="check" size={22} />
                </div>
                <div className="serif" style={{ fontSize: 26, marginBottom: 6 }}>Published to the library</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 13.5, marginBottom: 20, maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.5 }}>
                  "{form.title}" is now searchable. Librarian review queued for this week. Translation to {form.language === 'EN' ? 'Spanish' : 'English'} will trigger automatically.
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn" onClick={() => { setStage('drop'); setFile(null); }}>Upload another</button>
                  <button className="btn btn-primary" onClick={onDone}>View in library →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

window.UploadPage = UploadPage;
