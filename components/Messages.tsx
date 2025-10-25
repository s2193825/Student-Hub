
import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Teacher, Message } from '../types';
import { SendIcon } from './icons';

interface MessagesProps {
  conversations: Conversation[];
  teachers: Teacher[];
}

const Messages: React.FC<MessagesProps> = ({ conversations: initialConversations, teachers }) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teachers[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.teacherId === selectedTeacherId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTeacherId) return;

    const message: Message = {
      id: `m-${Date.now()}`,
      sender: 'student',
      text: newMessage,
      timestamp: 'Just now',
    };

    const updatedConversations = conversations.map(c => {
      if (c.teacherId === selectedTeacherId) {
        return { ...c, messages: [...c.messages, message] };
      }
      return c;
    });

    setConversations(updatedConversations);
    setNewMessage('');
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-4xl font-bold text-dark-text mb-6">Messages</h1>
      <div className="flex-grow flex bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        {/* Teacher List */}
        <div className="w-1/3 border-r border-border-color flex flex-col">
          <div className="p-4 border-b border-border-color">
            <h2 className="text-xl font-semibold">Teachers</h2>
          </div>
          <div className="overflow-y-auto">
            {teachers.map(teacher => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={`w-full text-left p-4 flex items-center space-x-3 hover:bg-light-bg ${selectedTeacherId === teacher.id ? 'bg-primary/10' : ''}`}
              >
                <img src={teacher.avatarUrl} alt={teacher.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className={`font-bold ${selectedTeacherId === teacher.id ? 'text-primary' : 'text-dark-text'}`}>{teacher.name}</p>
                  <p className="text-sm text-medium-text">{teacher.subject}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedTeacherId && teachers.find(t=>t.id === selectedTeacherId) ? (
            <>
              <div className="p-4 border-b border-border-color flex items-center space-x-3">
                 <img src={teachers.find(t=>t.id === selectedTeacherId)?.avatarUrl} alt="teacher" className="w-12 h-12 rounded-full" />
                 <div>
                    <h2 className="text-xl font-semibold text-dark-text">{teachers.find(t=>t.id === selectedTeacherId)?.name}</h2>
                    <p className="text-sm text-medium-text">{teachers.find(t=>t.id === selectedTeacherId)?.subject}</p>
                 </div>
              </div>
              <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {selectedConversation?.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'student' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-dark-text rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'student' ? 'text-indigo-200' : 'text-light-text'} text-right`}>{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                   <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="p-4 border-t border-border-color bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-3 border border-border-color rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button type="submit" className="bg-primary text-white rounded-full p-3 hover:bg-primary-hover transition-colors">
                    <SendIcon className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-lg text-medium-text">Select a teacher to start a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
