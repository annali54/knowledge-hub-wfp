// Ask the library — smart search with real Claude AI
const { useState: useStateA, useRef: useRefA, useEffect: useEffectA } = React;

const AskPage = ({ data, openDoc, initialQuery = "", useAI = true }) => {
  const [query, setQuery] = useStateA(initialQuery);
  const [state, setState] = useStateA(initialQuery ? 'thinking' : 'idle'); // idle | thinking | done | error
  const [answer, setAnswer] = useStateA(null);
  const [sources, setSources] = useStateA([]);
  const [history, setHistory] = useStateA([]);
  const taRef = useRefA(null);

  useEffectA(() => {
    if (initialQuery) runQuery(initialQuery);
  }, []);

  const pickRelevantDocs = (q) => {
    const words = q.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const scored = data.docs.map(d => {
      const hay = (d.title + ' ' + d.summary + ' ' + d.tags.join(' ') + ' ' + d.topics.join(' ') + ' ' + d.geography.join(' ')).toLowerCase();
      let score = 0;
      words.forEach(w => {
        if (hay.includes(w)) score += 1;
        if (d.title.toLowerCase().includes(w)) score += 2;
      });
      return { d, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 0).slice(0, 5).map(s => s.d);
  };

  const runQuery = async (q) => {
    if (!q.trim()) return;
    setState('thinking');
    setAnswer(null);
    setSources([]);

    const canned = data.cannedAnswers[q.trim()];
    if (canned) {
      await new Promise(r => setTimeout(r, 900));
      setAnswer(canned.answer);
      setSources(canned.sources.map(id => data.docs.find(d => d.id === id)).filter(Boolean));
      setState('done');
      setHistory(h => [{ q, a: canned.answer }, ...h]);
      return;
    }

    const relevant = pickRelevantDocs(q);
    if (relevant.length === 0) {
      setAnswer("I couldn't find anything in the library matching that question. Try rephrasing, or broaden the topic — for example, instead of asking about a specific district, try asking about the country or the underlying topic.");
      setState('done');
      return;
    }

    if (!useAI || !window.claude?.complete) {
      // Heuristic answer without AI
      await new Promise(r => setTimeout(r, 700));
      const lines = relevant.slice(0, 3).map((d, i) => `${d.summary} [${i + 1}]`).join(' ');
      setAnswer(`Based on ${relevant.length} related resources: ${lines}`);
      setSources(relevant.slice(0, 3));
      setState('done');
      return;
    }

    try {
      const sourceList = relevant.map((d, i) =>
        `[${i + 1}] "${d.title}" by ${d.authors.join(', ')} (${d.type}, ${d.geography.join('/')}, ${fmtDate(d.date)}). Summary: ${d.summary}`
      ).join('\n\n');

      const prompt = `You are a research assistant for Water For People's Program Learning Library. Answer the user's question using ONLY the library excerpts below. Cite sources inline as [1], [2], etc. using the numbering I provide. Keep the answer to 2-4 sentences. Synthesize across sources where possible. If the excerpts don't answer the question, say so honestly.

QUESTION: ${q}

LIBRARY EXCERPTS:
${sourceList}

Respond with ONLY the answer text, with inline citations like [1]. No preamble.`;

      const resp = await window.claude.complete(prompt);
      setAnswer(resp.trim());
      setSources(relevant.slice(0, 5));
      setState('done');
      setHistory(h => [{ q, a: resp }, ...h]);
    } catch (err) {
      setAnswer("The AI service couldn't be reached right now. Here are the most relevant library resources — open them below.");
      setSources(relevant.slice(0, 3));
      setState('done');
    }
  };

  const renderAnswer = (text) => {
    // Replace [N] with clickable citation pills
    const parts = text.split(/(\[\d+\])/);
    return parts.map((p, i) => {
      const m = p.match(/\[(\d+)\]/);
      if (m) {
        const n = parseInt(m[1], 10);
        const doc = sources[n - 1];
        return (
          <span
            key={i}
            className="citation"
            title={doc?.title}
            onClick={() => doc && openDoc(doc)}
          >{n}</span>
        );
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div className="content">
      <div className="ask-wrap">
        <div className="ask-hero">
          <div className="ask-kicker">Ask · Semantic search · Cross-document synthesis</div>
          <h1 className="ask-title">What do you want to learn?</h1>
          <div className="ask-sub">Ask a question in plain English or Spanish. The library reads across every document and answers with citations you can trace.</div>
        </div>

        <form onSubmit={e => { e.preventDefault(); runQuery(query); }}>
          <div className="ask-box">
            <textarea
              ref={taRef}
              className="ask-input"
              rows={2}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. What have we learned about sustainable sanitation finance in Rwanda?"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runQuery(query); }
              }}
            />
            <div className="ask-toolbar">
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11.5, color: 'var(--ink-3)' }}>
                <span className="chip teal" style={{ fontSize: 10 }}>EN / ES</span>
                <span>Answers across {data.docs.length} documents</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className="btn btn-ghost" title="Voice"><Icon name="mic" size={14} /></button>
                <button type="submit" className="btn btn-primary" disabled={!query.trim() || state === 'thinking'}>
                  <Icon name="send" size={13} /> Ask
                </button>
              </div>
            </div>
          </div>
        </form>

        {state === 'idle' && (
          <div className="ask-suggestions">
            {data.suggestedQs.map(q => (
              <button key={q} onClick={() => { setQuery(q); runQuery(q); }}>{q}</button>
            ))}
          </div>
        )}

        {state === 'thinking' && (
          <div className="ask-answer">
            <div className="ask-answer-head"><div className="dot" /> Reading the library…</div>
            <div className="answer-body">
              <div className="thinking"><div className="pulse" /> Finding relevant documents and synthesizing…</div>
            </div>
          </div>
        )}

        {state === 'done' && answer && (
          <div className="ask-answer">
            <div className="ask-answer-head">
              <div className="dot" />
              <span>Answer · synthesized from {sources.length} {sources.length === 1 ? 'source' : 'sources'}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button className="btn-ghost filter-btn" style={{ background: 'transparent', border: 'none' }}>
                  <Icon name="bookmark" size={11} /> Save
                </button>
                <button className="btn-ghost filter-btn" style={{ background: 'transparent', border: 'none' }}>
                  <Icon name="share" size={11} /> Share
                </button>
              </div>
            </div>
            <div className="answer-body serif" style={{ fontSize: 16 }}>
              <p>{renderAnswer(answer)}</p>
            </div>
            {sources.length > 0 && (
              <>
                <div className="micro" style={{ marginTop: 22, marginBottom: 10 }}>Sources cited</div>
                <div className="sources-grid">
                  {sources.map((s, i) => (
                    <div key={s.id} className="source-card" onClick={() => openDoc(s)}>
                      <div className="source-num">{i + 1}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.type}</div>
                      <div className="source-title">{s.title}</div>
                      <div className="source-meta">{s.authors[0]} · {s.geography[0]} · {fmtDate(s.date)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-elev)', border: '1px solid var(--rule)', borderRadius: 6, fontSize: 12.5, color: 'var(--ink-3)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Icon name="info" size={14} />
              <div>Answers are drafted from the library. Always trace citations back to the original source before citing in external work. Flag inaccuracies via the feedback link.</div>
            </div>
          </div>
        )}

        {history.length > 0 && state === 'idle' && (
          <>
            <div className="micro" style={{ marginTop: 32, marginBottom: 10 }}>Recent questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ padding: 12, background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: 6, fontSize: 13.5, cursor: 'pointer' }} onClick={() => { setQuery(h.q); runQuery(h.q); }}>
                  <div style={{ color: 'var(--ink-3)', fontSize: 11.5, marginBottom: 2 }}><Icon name="clock" size={11} /> recent</div>
                  {h.q}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

window.AskPage = AskPage;
