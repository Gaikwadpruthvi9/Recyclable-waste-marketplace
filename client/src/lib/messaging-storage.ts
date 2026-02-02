// Messaging Storage Layer
import { Conversation, Message, ConversationSummary } from './messaging-types';

const CONVERSATIONS_KEY = 'scrapify_conversations';

/**
 * Get all conversations from localStorage
 */
export const getConversations = (): Conversation[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
};

/**
 * Save conversations to localStorage
 */
const saveConversations = (conversations: Conversation[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

/**
 * Get or create a conversation for a listing between buyer and seller
 */
export const getOrCreateConversation = (
    listingId: string,
    listingTitle: string,
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string
): Conversation => {
    const conversations = getConversations();

    // Check if conversation already exists
    const existing = conversations.find(
        c => c.listingId === listingId &&
            c.participants.buyerId === buyerId &&
            c.participants.sellerId === sellerId
    );

    if (existing) {
        return existing;
    }

    // Create new conversation
    const newConversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        listingId,
        listingTitle,
        participants: {
            buyerId,
            buyerName,
            sellerId,
            sellerName
        },
        messages: [],
        lastMessageAt: new Date().toISOString(),
        lastMessagePreview: '',
        unreadCount: {
            buyer: 0,
            seller: 0
        },
        status: 'active',
        createdAt: new Date().toISOString()
    };

    conversations.push(newConversation);
    saveConversations(conversations);

    return newConversation;
};

/**
 * Get a conversation by ID
 */
export const getConversationById = (conversationId: string): Conversation | null => {
    const conversations = getConversations();
    return conversations.find(c => c.id === conversationId) || null;
};

/**
 * Send a message in a conversation
 */
export const sendMessage = (
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string,
    attachments?: string[]
): Message => {
    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) {
        throw new Error('Conversation not found');
    }

    const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachments
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageAt = newMessage.timestamp;
    conversation.lastMessagePreview = content.substring(0, 50) + (content.length > 50 ? '...' : '');

    // Increment unread count for receiver
    if (receiverId === conversation.participants.buyerId) {
        conversation.unreadCount.buyer++;
    } else {
        conversation.unreadCount.seller++;
    }

    saveConversations(conversations);

    return newMessage;
};

/**
 * Mark messages as read in a conversation
 */
export const markMessagesAsRead = (conversationId: string, userId: string): void => {
    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) return;

    // Mark all messages where user is receiver as read
    conversation.messages.forEach(msg => {
        if (msg.receiverId === userId && !msg.read) {
            msg.read = true;
        }
    });

    // Reset unread count for this user
    if (userId === conversation.participants.buyerId) {
        conversation.unreadCount.buyer = 0;
    } else {
        conversation.unreadCount.seller = 0;
    }

    saveConversations(conversations);
};

/**
 * Get conversations for a specific user
 */
export const getUserConversations = (userId: string): ConversationSummary[] => {
    const conversations = getConversations();

    return conversations
        .filter(c =>
            c.participants.buyerId === userId ||
            c.participants.sellerId === userId
        )
        .map(c => {
            const isBuyer = c.participants.buyerId === userId;
            const otherParty = isBuyer
                ? { id: c.participants.sellerId, name: c.participants.sellerName }
                : { id: c.participants.buyerId, name: c.participants.buyerName };

            const unreadCount = isBuyer
                ? c.unreadCount.buyer
                : c.unreadCount.seller;

            return {
                id: c.id,
                listingId: c.listingId,
                listingTitle: c.listingTitle,
                otherPartyId: otherParty.id,
                otherPartyName: otherParty.name,
                lastMessage: c.lastMessagePreview,
                lastMessageAt: c.lastMessageAt,
                unreadCount,
                status: c.status
            };
        })
        .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
};

/**
 * Get total unread message count for a user
 */
export const getTotalUnreadCount = (userId: string): number => {
    const conversations = getConversations();

    return conversations.reduce((total, c) => {
        if (c.participants.buyerId === userId) {
            return total + c.unreadCount.buyer;
        } else if (c.participants.sellerId === userId) {
            return total + c.unreadCount.seller;
        }
        return total;
    }, 0);
};

/**
 * Archive a conversation
 */
export const archiveConversation = (conversationId: string): void => {
    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (conversation) {
        conversation.status = 'archived';
        saveConversations(conversations);
    }
};

/**
 * Delete a conversation
 */
export const deleteConversation = (conversationId: string): void => {
    const conversations = getConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);
    saveConversations(filtered);
};
