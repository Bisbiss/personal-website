import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
    return (
        <>
            <SEO
                title="404 - Page Not Found"
                description="The page you are looking for doesn't exist or has been moved."
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
                <div className="max-w-2xl w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* 404 Number */}
                        <div className="relative mb-8">
                            <h1 className="text-[150px] md:text-[200px] font-bold text-slate-200 dark:text-slate-800 leading-none select-none">
                                404
                            </h1>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search size={80} className="text-slate-400 dark:text-slate-600 animate-pulse" />
                            </div>
                        </div>

                        {/* Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Page Not Found
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                Oops! The page you're looking for doesn't exist or has been moved.
                            </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                            >
                                <Home size={20} />
                                Go to Homepage
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Go Back
                            </button>
                        </motion.div>

                        {/* Helpful Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="mt-12"
                        >
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                You might be interested in:
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Link
                                    to="/#about"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors underline"
                                >
                                    About Me
                                </Link>
                                <Link
                                    to="/#projects"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors underline"
                                >
                                    Projects
                                </Link>
                                <Link
                                    to="/articles"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors underline"
                                >
                                    Articles
                                </Link>
                                <Link
                                    to="/#contact"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors underline"
                                >
                                    Contact
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
