import { useEffect, useRef, useState } from 'react';
import { Send, Users, Hash, MoreHorizontal, Paperclip, Smile, Sparkles, Copy, Check, Menu } from 'lucide-react';

const members = [
  { id: 'chat', name: 'Alfred', provider: 'ChatGPT', color: 'blue', handle: '@chat', initials: 'A' },
  { id: 'claude', name: 'JARVIS', provider: 'Claude', color: 'green', handle: '@claude', initials: 'J' },
  { id: 'grok', name: 'Athena', provider: 'Grok', color: 'orange', handle: '@grok', initials: 'A' },
];

const starter = [{
  id: 'welcome',
  author: 'system',
  text: 'Welcome to NXTWVE Chat. This is your private-feeling shared room prototype. Messages are saved in this browser on this device.',
  time: Date.now()
}];

function timeLabel(value) {
  return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function Avatar({ member, you = false }) {
  return <div className={`avatar ${you ? 'you' : member?.color || 'system'}`}>{you ? 'Y' : member?.initials || '•'}</div>;
}

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('nxtwve-chat-messages');
      return saved ? JSON.parse(saved) : starter;
    } catch { return starter; }
  });
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nxtwve-chat-messages', JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      author: 'you',
      text,
      time: Date.now(),
      mentions: members.filter(m => text.toLowerCase().includes(m.handle) || text.toLowerCase().includes('@all')).map(m => m.id)
    }]);
    setDraft('');
    inputRef.current?.focus();
  };

  const copyPrompt = async (message, member) => {
    const prompt = `You are ${member.name}, representing ${member.provider}, in the NXTWVE Chat Council.\n\nConversation message from the user:\n${message.text}\n\nRespond in the context of the shared group conversation.`;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(`${message.id}-${member.id}`);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      window.prompt('Copy this prompt:', prompt);
    }
  };

  const clearChat = () => {
    if (window.confirm('Clear all messages saved in this browser? This cannot be undone.')) setMessages(starter);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">N</div>
        <div className="brand-copy"><strong>NXTWVE <span>CHAT</span></strong><small>THE COUNCIL ROOM</small></div>
        <div className="topbar-spacer" />
        <div className="privacy-pill"><span /> Local prototype</div>
        <button className="icon-button" aria-label="Room information" onClick={() => setShowInfo(v => !v)}><MoreHorizontal size={20} /></button>
      </header>

      <section className="room-bar">
        <div className="room-title"><Hash size={18} /><strong>council</strong><span className="room-divider">/</span><span className="room-subtitle">One room. Four participants.</span></div>
        <div className="room-people"><Users size={16} /><span>4</span></div>
      </section>

      {showInfo && <div className="info-banner">
        <strong>Prototype status:</strong> Chat messages are stored locally in this browser. Alfred, JARVIS and Athena are not connected yet. Use the copy-prompt controls to relay a message manually to an AI website.
        <button onClick={() => setShowInfo(false)}>Dismiss</button>
      </div>}

      <section className="conversation" aria-label="Council conversation">
        <div className="welcome-block">
          <div className="welcome-icon"><Sparkles size={23} /></div>
          <h1>Welcome to <span>#council</span></h1>
          <p>This is the beginning of your conversation. Bring all three minds into one room.</p>
          <div className="member-chips">
            {members.map(m => <div className="member-chip" key={m.id}><i className={`dot ${m.color}`} />{m.name}<small>{m.provider}</small></div>)}
          </div>
        </div>

        {messages.map(message => {
          const member = members.find(m => m.id === message.author);
          const isYou = message.author === 'you';
          return (
            <article className={`message ${isYou ? 'message-you' : ''}`} key={message.id}>
              <Avatar member={member} you={isYou} />
              <div className="message-body">
                <div className="message-meta">
                  <strong>{isYou ? 'You' : member?.name || 'NXTWVE'}</strong>
                  {!isYou && member && <span className={`provider-tag ${member.color}`}>{member.provider}</span>}
                  <time>{timeLabel(message.time)}</time>
                </div>
                <p>{message.text}</p>
                {isYou && message.mentions?.length > 0 && (
                  <div className="mention-actions">
                    {message.mentions.map(id => {
                      const target = members.find(m => m.id === id);
                      const key = `${message.id}-${id}`;
                      return <button key={id} onClick={() => copyPrompt(message, target)} className="relay-button">
                        {copied === key ? <Check size={13} /> : <Copy size={13} />}
                        {copied === key ? 'Prompt copied' : `Copy prompt for ${target.name}`}
                      </button>;
                    })}
                  </div>
                )}
              </div>
            </article>
          );
        })}
        <div ref={endRef} />
      </section>

      <footer className="composer-area">
        <div className="connection-note"><span className="status-dot" /> AI connections not configured yet · Manual relay available</div>
        <div className="composer">
          <button className="composer-tool" title="Attachment (coming later)" aria-label="Attachment"><Paperclip size={18} /></button>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Message #council — try @chat, @claude, @grok or @all"
            rows={1}
          />
          <button className="composer-tool emoji-tool" title="Emoji (coming later)" aria-label="Emoji"><Smile size={18} /></button>
          <button className="send-button" onClick={send} disabled={!draft.trim()} aria-label="Send message"><Send size={17} /></button>
        </div>
        <div className="composer-foot"><span>Enter to send · Shift + Enter for a new line</span><button onClick={clearChat}>Clear conversation</button></div>
      </footer>
    </main>
  );
}
