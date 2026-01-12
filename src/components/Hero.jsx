import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Hero = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('full_name, tagline, social_links, avatar_url')
            .single();

        if (data) setProfile(data);
    };

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-slate-950 pointer-events-none"></div>
            <div className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.35),transparent_60%)] blur-3xl opacity-70 animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.3),transparent_60%)] blur-3xl opacity-70 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {profile?.avatar_url && (
                        <div className="mb-8 flex justify-center">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl shadow-primary/20">
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <h2 className="text-primary font-mono text-sm uppercase tracking-[0.3em] mb-4">Hello, World!</h2>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
                        I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {profile?.full_name || 'Bisbiss'}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        {profile?.tagline || 'Building digital experiences with code and creativity. Focused on modern web technologies and sleek interfaces.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#projects"
                            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
                        >
                            View Projects <ArrowRight size={20} />
                        </a>
                        <a
                            href="#contact"
                            className="px-8 py-3 border border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary rounded-full font-medium transition-all"
                        >
                            Contact Me
                        </a>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6 text-slate-500 dark:text-slate-400">
                        {profile?.social_links?.github && (
                            <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={24} /></a>
                        )}
                        {profile?.social_links?.linkedin && (
                            <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Linkedin size={24} /></a>
                        )}
                        <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Mail size={24} /></a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
