import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Calendar, User, CheckCircle, Circle, Trash2, Eye } from 'lucide-react';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .update({ is_read: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, is_read: !currentStatus } : msg
            ));
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
            setSelectedMessage((prevSelected) => (prevSelected?.id === id ? null : prevSelected));

            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting message:', error);
            fetchMessages();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Messages</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {messages.length} total messages ({messages.filter(m => !m.is_read).length} unread)
                    </p>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Mail size={48} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">No messages yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Messages List */}
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                onClick={() => setSelectedMessage(message)}
                                className={`bg-white dark:bg-slate-900 p-6 rounded-xl border cursor-pointer transition-all ${selectedMessage?.id === message.id
                                        ? 'border-primary shadow-lg'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'
                                    } ${!message.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${message.is_read
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                : 'bg-primary/10 text-primary'
                                            }`}>
                                            {message.is_read ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{message.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{message.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                                    {message.message}
                                </p>
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(message.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:sticky lg:top-4 h-fit">
                        {selectedMessage ? (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            {selectedMessage.name}
                                        </h2>
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="text-primary hover:underline flex items-center gap-2"
                                        >
                                            <Mail size={16} />
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                        Received: {formatDate(selectedMessage.created_at)}
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => markAsRead(selectedMessage.id, selectedMessage.is_read)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedMessage.is_read
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                : 'bg-primary text-white hover:bg-primary-hover'
                                            }`}
                                    >
                                        {selectedMessage.is_read ? (
                                            <>
                                                <Circle size={18} />
                                                Mark Unread
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} />
                                                Mark Read
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                                <Eye size={48} className="mx-auto text-slate-400 mb-4" />
                                <p className="text-slate-600 dark:text-slate-400">
                                    Select a message to view details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
