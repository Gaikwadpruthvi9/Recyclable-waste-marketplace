// Custom hook for messaging functionality
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getConversations,
    getOrCreateConversation,
    getConversationById,
    sendMessage as sendMessageToStorage,
    markMessagesAsRead,
    getUserConversations,
    getTotalUnreadCount,
    archiveConversation as archiveConv,
    deleteConversation as deleteConv
} from '@/lib/messaging-storage';
import { Conversation, Message, ConversationSummary } from '@/lib/messaging-types';

export const useMessages = (userId?: string) => {
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshConversations = useCallback(() => {
        if (!userId) {
            setConversations([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        const userConvs = getUserConversations(userId);
        setConversations(userConvs);
        setUnreadCount(getTotalUnreadCount(userId));
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);

    const startConversation = useCallback((
        listingId: string,
        listingTitle: string,
        buyerId: string,
        buyerName: string,
        sellerId: string,
        sellerName: string
    ): Conversation => {
        const conversation = getOrCreateConversation(
            listingId,
            listingTitle,
            buyerId,
            buyerName,
            sellerId,
            sellerName
        );
        refreshConversations();
        return conversation;
    }, [refreshConversations]);

    const sendMessage = useCallback((
        conversationId: string,
        senderId: string,
        receiverId: string,
        content: string,
        attachments?: string[]
    ): Message => {
        const message = sendMessageToStorage(conversationId, senderId, receiverId, content, attachments);
        refreshConversations();
        return message;
    }, [refreshConversations]);

    const markAsRead = useCallback((conversationId: string, userId: string) => {
        markMessagesAsRead(conversationId, userId);
        refreshConversations();
    }, [refreshConversations]);

    const archiveConversation = useCallback((conversationId: string) => {
        archiveConv(conversationId);
        refreshConversations();
    }, [refreshConversations]);

    const deleteConversation = useCallback((conversationId: string) => {
        deleteConv(conversationId);
        refreshConversations();
    }, [refreshConversations]);

    return {
        conversations,
        unreadCount,
        loading,
        startConversation,
        sendMessage,
        markAsRead,
        archiveConversation,
        deleteConversation,
        refreshConversations,
        getConversationById
    };
};
