import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Projects = () => {
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
                .eq('is_featured', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setProjects(data);
            } else {
                // Fallback data if no projects in DB
                setProjects(fallbackProjects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects(fallbackProjects);
        } finally {
            setLoading(false);
        }
    };

    const fallbackProjects = [
        {
            title: 'Project One',
            description: 'A futuristic dashboard for managing IoT devices with real-time data visualization.',
            tech_stack: ['React', 'D3.js', 'WebSocket'],
            image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            github_url: '#',
            demo_url: '#'
        },
        {
            title: 'Project Two',
            description: 'E-commerce platform with a focus on speed and accessibility.',
            tech_stack: ['Next.js', 'Stripe', 'Tailwind'],
            image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
            github_url: '#',
            demo_url: '#'
        },
        {
            title: 'Project Three',
            description: 'AI-powered chat application with natural language processing.',
            tech_stack: ['Python', 'TensorFlow', 'React'],
            image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
            github_url: '#',
            demo_url: '#'
        }
    ];

    return (
        <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white"><span className="text-primary">02.</span> Featured Projects</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        A selection of projects I've worked on, demonstrating my expertise in web development.
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
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all group shadow-lg dark:shadow-none"
                            >
                                <div className="relative overflow-hidden h-48">
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all z-10"></div>
                                    <img
                                        src={project.image_url || project.image} // Handle both naming conventions
                                        alt={project.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {/* Handle both array and string formats for tech_stack */}
                                        {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack || '').split(',')).map((tech) => (
                                            <span key={tech.trim()} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4">
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
    );
};

export default Projects;
