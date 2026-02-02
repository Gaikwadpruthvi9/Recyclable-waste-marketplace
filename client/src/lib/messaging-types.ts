// Messaging System Type Definitions

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
    attachments?: string[]; // Base64 images or file URLs
}

export interface Conversation {
    id: string;
    listingId: string;
    listingTitle: string;
    participants: {
        buyerId: string;
        buyerName: string;
        sellerId: string;
        sellerName: string;
    };
    messages: Message[];
    lastMessageAt: string;
    lastMessagePreview: string;
    unreadCount: {
        buyer: number;
        seller: number;
    };
    status: 'active' | 'archived';
    createdAt: string;
}

export interface ConversationSummary {
    id: string;
    listingId: string;
    listingTitle: string;
    otherPartyId: string;
    otherPartyName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    status: 'active' | 'archived';
}
