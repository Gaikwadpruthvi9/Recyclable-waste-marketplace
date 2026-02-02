'use client';

import { Notification, NotificationType } from '@/lib/notification-types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, MessageCircle, DollarSign, Package, CheckCircle, XCircle, FileText, X } from 'lucide-react';
import Link from 'next/link';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.NEW_MESSAGE:
                return <MessageCircle className="w-5 h-5 text-blue-600" />;
            case NotificationType.NEW_OFFER:
                return <DollarSign className="w-5 h-5 text-green-600" />;
            case NotificationType.OFFER_ACCEPTED:
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case NotificationType.OFFER_REJECTED:
                return <XCircle className="w-5 h-5 text-red-600" />;
            case NotificationType.ORDER_CREATED:
            case NotificationType.ORDER_STATUS_UPDATE:
                return <Package className="w-5 h-5 text-purple-600" />;
            case NotificationType.LISTING_APPROVED:
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case NotificationType.LISTING_REJECTED:
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const handleClick = () => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
    };

    const content = (
        <div
            className={`flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                }`}
            onClick={handleClick}
        >
            <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                    </h4>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                </div>
            </div>
        </div>
    );

    if (notification.actionUrl) {
        return <Link href={notification.actionUrl}>{content}</Link>;
    }

    return content;
}
