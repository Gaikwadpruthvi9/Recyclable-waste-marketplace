'use client';

import { ConversationSummary } from '@/lib/messaging-types';
import { format } from 'date-fns';
import { MessageCircle, User } from 'lucide-react';

interface ConversationListProps {
    conversations: ConversationSummary[];
    selectedId?: string;
    onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
    if (conversations.length === 0) {
        return (
            <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">Start messaging from a listing page</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
                const isSelected = conversation.id === selectedId;
                const hasUnread = conversation.unreadCount > 0;

                return (
                    <button
                        key={conversation.id}
                        onClick={() => onSelect(conversation.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${isSelected ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'
                                        }`}>
                                        {conversation.otherPartyName}
                                    </h3>
                                    {conversation.lastMessageAt && (
                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {format(new Date(conversation.lastMessageAt), 'MMM dd')}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 truncate mb-1">
                                    {conversation.listingTitle}
                                </p>

                                {conversation.lastMessage && (
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {conversation.lastMessage}
                                        </p>
                                        {hasUnread && (
                                            <span className="ml-2 flex-shrink-0 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
