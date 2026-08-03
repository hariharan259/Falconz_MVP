import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  citations?: { title: string; link: string }[];
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'ASSISTANT',
    content: 'Welcome to the FalconZ AI Terminal. I can assist with mission planning, anomaly detection, and engineering calculations. How can I help you today?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'USER', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // For MVP, we point to the local backend. 
      // If the backend isn't running, this will fail gracefully after timeout.
      const res = await fetch('http://localhost:8000/api/v1/ai/query', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`
        },
        body: JSON.stringify({ session_id: 'mvp-session-1', message: userMsg.content })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: data.reply,
        citations: data.source_citations
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: '**Error:** Unable to reach the FalconZ AI Gateway. Please ensure the backend is running.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-1">AI Assistant</h1>
        <p className="text-gray-400">RAG-powered intelligence and engineering calculations.</p>
      </header>

      {/* Chat Window */}
      <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden border-t-2 border-t-falcon-blue">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar */}
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
                msg.role === 'USER' 
                  ? 'bg-falcon-blue/20 border-falcon-blue/50 text-falcon-blue' 
                  : 'bg-purple-500/20 border-purple-500/50 text-purple-400'
              }`}>
                {msg.role === 'USER' ? <User size={20} /> : <Bot size={20} />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'USER' 
                  ? 'bg-falcon-blue text-white rounded-tr-none' 
                  : 'bg-black/40 border border-white/10 rounded-tl-none'
              }`}>
                
                {/* Markdown Content */}
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Citations block for AI */}
                {msg.role === 'ASSISTANT' && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <BookOpen size={12} /> Sources Cited
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, i) => (
                        <a key={i} href={cite.link} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded text-falcon-accent transition-colors">
                          [{i + 1}] {cite.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
               <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border bg-purple-500/20 border-purple-500/50 text-purple-400">
                <Bot size={20} />
              </div>
              <div className="bg-black/40 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="animate-spin text-falcon-blue" size={20} />
                <span className="text-gray-400 text-sm animate-pulse">Analyzing telemetry and documentation...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about battery calculations, anomalies, or PX4 parameters..."
              className="w-full bg-black/60 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-falcon-blue focus:ring-1 focus:ring-falcon-blue transition-all"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-falcon-blue hover:bg-falcon-accent rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,123,255,0.4)]"
            >
              <Send size={20} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
