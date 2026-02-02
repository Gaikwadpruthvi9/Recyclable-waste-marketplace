'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ConversationList from '@/components/messaging/ConversationList';
import MessageThread from '@/components/messaging/MessageThread';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
    const { user } = useAuth();
    const { conversations, loading } = useMessages(user?.id);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <MessageCircle className="w-10 h-10 text-primary-600" />
                            Messages
                        </h1>
                        <p className="text-lg text-gray-600">
                            Communicate with buyers and sellers
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                            {/* Conversation List */}
                            <div className={`lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${selectedConversationId ? 'hidden lg:block' : ''
                                }`}>
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="font-semibold text-gray-900">Conversations</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
                                    </p>
                                </div>
                                <div className="overflow-y-auto h-[calc(100%-80px)]">
                                    <ConversationList
                                        conversations={conversations}
                                        selectedId={selectedConversationId || undefined}
                                        onSelect={setSelectedConversationId}
                                    />
                                </div>
                            </div>

                            {/* Message Thread */}
                            <div className={`lg:col-span-2 ${!selectedConversationId ? 'hidden lg:block' : ''
                                }`}>
                                {selectedConversationId ? (
                                    <MessageThread
                                        conversationId={selectedConversationId}
                                        onBack={() => setSelectedConversationId(null)}
                                    />
                                ) : (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Select a conversation
                                            </h3>
                                            <p className="text-gray-600">
                                                Choose a conversation from the list to start messaging
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
