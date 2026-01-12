import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Layout, Server } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const About = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('about_content, skills')
            .single();

        if (data) setProfile(data);
    };

    // Fallback skills if none in DB
    const defaultSkills = [
        { category: 'Frontend', items: 'React, Tailwind CSS, Framer Motion' },
        { category: 'Backend', items: 'Node.js, Supabase, PostgreSQL' },
        { category: 'Tools', items: 'Git, VS Code, Figma' }
    ];

    const skillsToDisplay = profile?.skills || defaultSkills;

    const getIconForCategory = (category) => {
        const lower = category.toLowerCase();
        if (lower.includes('front')) return <Layout className="w-8 h-8" />;
        if (lower.includes('back')) return <Server className="w-8 h-8" />;
        if (lower.includes('tool')) return <Code className="w-8 h-8" />;
        return <Database className="w-8 h-8" />;
    };

    return (
        <section id="about" className="py-20 section-surface transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white"><span className="text-primary">01.</span> About Me</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6 whitespace-pre-line">
                            {profile?.about_content || (
                                <>
                                    <p className="mb-4">
                                        I'm a passionate developer with a knack for building beautiful and functional websites.
                                        My journey in tech started with a curiosity about how things work, which led me to
                                        dive deep into the world of programming.
                                    </p>
                                    <p>
                                        When I'm not coding, you can find me exploring the latest tech trends,
                                        tinkering with hardware, or gaming. I believe in continuous learning and
                                        pushing the boundaries of what's possible on the web.
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {skillsToDisplay.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors shadow-sm dark:shadow-none"
                            >
                                <div className="text-primary mb-4">{getIconForCategory(skill.category)}</div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{skill.category}</h3>
                                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                                    {/* Handle both array and string formats for items */}
                                    {(Array.isArray(skill.items) ? skill.items : (skill.items || '').split(',')).map((item) => (
                                        <li key={item.trim()}>- {item.trim()}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
