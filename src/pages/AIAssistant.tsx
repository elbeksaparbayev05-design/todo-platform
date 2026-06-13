import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button, SectionHeader, Card } from '../components/ui';
import { RiSendPlane2Line, RiRobot2Line, RiUserLine } from 'react-icons/ri';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your LifeFlow AI Assistant. I can help you with productivity tips, habit advice, and wellness insights. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function generateResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to help you stay productive and healthy. What would you like to know about?';
    }

    // Task-related responses
    if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
      const totalTodos = state.todos.length;
      const completedTodos = state.todos.filter(t => t.completed).length;
      return `Great! You have ${totalTodos} tasks in total, with ${completedTodos} completed. Keep up the momentum! 💪`;
    }

    // Habit-related responses
    if (lowerMessage.includes('habit')) {
      const totalHabits = state.habits.length;
      const avgStreak = totalHabits > 0
        ? Math.round(state.habits.reduce((a, h) => a + h.streak, 0) / totalHabits)
        : 0;
      return `You have ${totalHabits} habits tracked with an average streak of ${avgStreak} days. Consistency is key! 🔥`;
    }

    // Health-related responses
    if (lowerMessage.includes('health') || lowerMessage.includes('water') || lowerMessage.includes('sleep')) {
      const waterToday = state.waterLogs.find(w => w.date === new Date().toISOString().split('T')[0])?.glasses || 0;
      const waterGoal = state.settings.waterGoal;
      return `Today you've consumed ${waterToday}/${waterGoal} glasses of water. Stay hydrated! 💧`;
    }

    // Study-related responses
    if (lowerMessage.includes('study') || lowerMessage.includes('subject')) {
      const totalSubjects = state.studySubjects.length;
      const totalHours = state.studySubjects.reduce((a, s) => a + s.totalHours, 0);
      return `You're studying ${totalSubjects} subjects with a total of ${totalHours} hours planned. Amazing dedication! 📚`;
    }

    // Motivation responses
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('encour')) {
      const motivationalQuotes = [
        'You are capable of amazing things! Keep pushing forward! 🚀',
        'Small daily improvements lead to stunning results. Stay consistent! ✨',
        'Your dedication to self-improvement is inspiring. Keep it up! 💪',
        'Progress, not perfection. Every step counts! 👣',
        'You\'ve got this! One day at a time. 🌟'
      ];
      return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    }

    // Default response
    return 'That\'s interesting! Feel free to ask me about your tasks, habits, health, or study plans. I\'m here to help you succeed! 🎯';
  }

  function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(m => [...m, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date()
      };
      setMessages(m => [...m, assistantMessage]);
      setLoading(false);
    }, 500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SectionHeader
        title="AI Assistant"
        subtitle="Get personalized insights and recommendations"
      />

      {/* Chat Container */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: 16 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: 8
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <RiRobot2Line style={{ fontSize: 16 }} />
                  </div>
                )}

                <div style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: msg.role === 'user' ? '#4f46e5' : 'var(--bg-secondary)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 13,
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--bg-primary)',
                    flexShrink: 0
                  }}>
                    <RiUserLine style={{ fontSize: 16 }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 8 }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <RiRobot2Line style={{ fontSize: 16 }} />
              </div>
              <div style={{
                padding: '10px 14px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                display: 'flex',
                gap: 6
              }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--text-muted)'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: 8
        }}>
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          <Button onClick={handleSend} icon={<RiSendPlane2Line />} disabled={!input.trim() || loading}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
