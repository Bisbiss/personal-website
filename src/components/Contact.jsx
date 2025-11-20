import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
    const [contactInfo, setContactInfo] = useState({
        email: 'hello@alexdev.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [captcha, setCaptcha] = useState({
        num1: 0,
        num2: 0,
        answer: '',
        userAnswer: ''
    });

    const [status, setStatus] = useState({
        type: '', // 'success', 'error', 'loading'
        message: ''
    });

    useEffect(() => {
        fetchProfile();
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({
            num1,
            num2,
            answer: (num1 + num2).toString(),
            userAnswer: ''
        });
    };

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('email, phone, location')
            .single();

        if (data) {
            setContactInfo({
                email: data.email || 'hello@alexdev.com',
                phone: data.phone || '+1 (555) 123-4567',
                location: data.location || 'San Francisco, CA'
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCaptchaChange = (e) => {
        setCaptcha({
            ...captcha,
            userAnswer: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({
                type: 'error',
                message: 'Please fill in all fields'
            });
            return;
        }

        // Validate CAPTCHA
        if (captcha.userAnswer !== captcha.answer) {
            setStatus({
                type: 'error',
                message: 'Incorrect CAPTCHA answer. Please try again.'
            });
            generateCaptcha(); // Generate new CAPTCHA
            return;
        }

        setStatus({ type: 'loading', message: 'Sending message...' });

        try {
            // Get user's user agent (optional, for spam tracking)
            const userAgent = navigator.userAgent;

            // Insert message to Supabase
            const { data, error } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message,
                        user_agent: userAgent,
                    }
                ]);

            if (error) throw error;

            setStatus({
                type: 'success',
                message: 'Message sent successfully! I\'ll get back to you soon.'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                message: ''
            });

            // Generate new CAPTCHA
            generateCaptcha();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setStatus({ type: '', message: '' });
            }, 5000);

        } catch (error) {
            console.error('Error sending message:', error);
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again or email me directly.'
            });
            generateCaptcha(); // Generate new CAPTCHA on error
        }
    };

    return (
        <section id="contact" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white"><span className="text-primary">05.</span> Get In Touch</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Have a project in mind or just want to say hi? I'd love to hear from you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</h4>
                                    <a href={`mailto:${contactInfo.email}`} className="text-lg text-slate-900 dark:text-white hover:text-primary transition-colors">{contactInfo.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Phone</h4>
                                    <a href={`tel:${contactInfo.phone}`} className="text-lg text-slate-900 dark:text-white hover:text-primary transition-colors">{contactInfo.phone}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Location</h4>
                                    <p className="text-lg text-slate-900 dark:text-white">{contactInfo.location}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                                    placeholder="Your message..."
                                ></textarea>
                            </div>

                            {/* Math CAPTCHA */}
                            <div>
                                <label htmlFor="captcha" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Security Check
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 flex items-center justify-center gap-3">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                                            {captcha.num1} + {captcha.num2} =
                                        </span>
                                        <input
                                            type="number"
                                            id="captcha"
                                            value={captcha.userAnswer}
                                            onChange={handleCaptchaChange}
                                            required
                                            className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-center text-slate-900 dark:text-white font-mono text-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="?"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateCaptcha}
                                        className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                        title="Generate new question"
                                    >
                                        <RefreshCw size={20} />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Please solve the math problem to verify you're human
                                </p>
                            </div>

                            {/* Status Messages */}
                            {status.message && (
                                <div className={`flex items-center gap-2 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                        status.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                            'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                    }`}>
                                    {status.type === 'success' && <CheckCircle size={20} />}
                                    {status.type === 'error' && <AlertCircle size={20} />}
                                    <span className="text-sm">{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status.type === 'loading'}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status.type === 'loading' ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
