import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({
        type: '', // 'success', 'error', 'loading'
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setStatus({
                type: 'error',
                message: 'Please enter your email address'
            });
            return;
        }

        setStatus({ type: 'loading', message: 'Sending reset link...' });

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (error) throw error;

            setStatus({
                type: 'success',
                message: 'Password reset link has been sent to your email. Please check your inbox.'
            });

            // Clear email field
            setEmail('');

        } catch (error) {
            console.error('Error sending reset email:', error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to send reset link. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back to Login Link */}
                <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Login
                </Link>

                <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Mail size={32} className="text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                        <p className="text-slate-400">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`flex items-start gap-3 p-4 rounded-lg mb-6 ${status.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : status.type === 'error'
                                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                            }`}>
                            {status.type === 'success' && <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />}
                            {status.type === 'error' && <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />}
                            <span className="text-sm">{status.message}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                placeholder="admin@example.com"
                                required
                                disabled={status.type === 'loading'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status.type === 'loading'}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status.type === 'loading' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail size={18} />
                                    Send Reset Link
                                </>
                            )}
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Remember your password?{' '}
                            <Link to="/admin/login" className="text-primary hover:text-primary-hover font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        If you don't receive an email within a few minutes, check your spam folder or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
