import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setProjects(data);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Projects"
                description="Explore my portfolio of projects, ranging from web applications to open source contributions."
                keywords="projects, portfolio, web development, software engineering, react, javascript"
            />
            <section className="py-20 min-h-screen pt-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">All Projects</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            A comprehensive list of my work, including featured projects and experiments.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all group shadow-lg dark:shadow-none flex flex-col"
                                >
                                    <div className="relative overflow-hidden h-48 shrink-0">
                                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all z-10"></div>
                                        <img
                                            src={project.image_url || project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm line-clamp-3 flex-1">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack || '').split(',')).map((tech) => (
                                                <span key={tech.trim()} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 mt-auto">
                                            {(project.github_url || project.github) && (
                                                <a href={project.github_url || project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                                    <Github size={18} /> Code
                                                </a>
                                            )}
                                            {(project.demo_url || project.demo) && (
                                                <a href={project.demo_url || project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                                    <ExternalLink size={18} /> Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ProjectsPage;
