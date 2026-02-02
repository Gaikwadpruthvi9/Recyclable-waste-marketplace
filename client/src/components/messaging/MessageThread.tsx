'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { format } from 'date-fns';
import { ArrowLeft, Send, User } from 'lucide-react';

interface MessageThreadProps {
    conversationId: string;
    onBack?: () => void;
}

export default function MessageThread({ conversationId, onBack }: MessageThreadProps) {
    const { user } = useAuth();
    const { getConversation, sendMessage, markAsRead } = useMessages(user?.id);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversation = getConversation(conversationId);

    useEffect(() => {
        if (conversation && user) {
            markAsRead(conversationId, user.id);
        }
    }, [conversationId, conversation, user, markAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation?.messages]);

    if (!conversation || !user) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
                <p className="text-gray-500">Conversation not found</p>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        sendMessage(conversationId, user.id, newMessage.trim());
        setNewMessage('');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="lg:hidden text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">{conversation.otherPartyName}</h2>
                    <p className="text-sm text-gray-600 truncate">{conversation.listingTitle}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.messages.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    conversation.messages.map((message) => {
                        const isOwn = message.senderId === user.id;
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                    <p
                                        className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'
                                            }`}
                                    >
                                        {format(new Date(message.timestamp), 'MMM dd, h:mm a')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input flex-1"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="btn btn-primary"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
