import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Footer = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('full_name, social_links')
            .single();

        if (data) setProfile(data);
    };

    return (
        <footer className="bg-slate-100 dark:bg-slate-950 py-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                    © {new Date().getFullYear()} {profile?.full_name || 'Alex Dev'}. All rights reserved.
                </p>

                <div className="flex items-center gap-6">
                    {profile?.social_links?.github && (
                        <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                            <Github size={20} />
                        </a>
                    )}
                    {profile?.social_links?.linkedin && (
                        <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                            <Linkedin size={20} />
                        </a>
                    )}
                    {profile?.social_links?.twitter && (
                        <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                            <Twitter size={20} />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
