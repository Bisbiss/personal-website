import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState({
        type: '',
        message: ''
    });

    useEffect(() => {
        // Check if user came from password reset email
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setStatus({
                    type: 'error',
                    message: 'Invalid or expired reset link. Please request a new one.'
                });
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (password.length < 6) {
            setStatus({
                type: 'error',
                message: 'Password must be at least 6 characters long'
            });
            return;
        }

        if (password !== confirmPassword) {
            setStatus({
                type: 'error',
                message: 'Passwords do not match'
            });
            return;
        }

        setStatus({ type: 'loading', message: 'Updating password...' });

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setStatus({
                type: 'success',
                message: 'Password updated successfully! Redirecting to login...'
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);

        } catch (error) {
            console.error('Error updating password:', error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to update password. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Lock size={32} className="text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-slate-400">
                            Enter your new password below
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
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                    disabled={status.type === 'loading' || status.type === 'success'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="Confirm new password"
                                    required
                                    disabled={status.type === 'loading' || status.type === 'success'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status.type === 'loading' || status.type === 'success'}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status.type === 'loading' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : status.type === 'success' ? (
                                <>
                                    <CheckCircle size={18} />
                                    Password Updated
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Update Password
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
