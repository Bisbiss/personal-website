import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            // Fallback mock data for demonstration
            setArticles([
                {
                    id: 1,
                    title: 'The Future of Web Development',
                    excerpt: 'Exploring the latest trends in frontend frameworks and what to expect in 2025.',
                    created_at: '2025-11-15',
                    read_time: '5 min read',
                    slug: 'future-web-dev'
                },
                {
                    id: 2,
                    title: 'Mastering Tailwind CSS',
                    excerpt: 'A comprehensive guide to building responsive layouts with utility classes.',
                    created_at: '2025-11-10',
                    read_time: '8 min read',
                    slug: 'mastering-tailwind'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Articles"
                description="Read my latest articles about web development, programming, and technology. Learn from my experiences and insights."
                keywords="articles, blog, web development, programming, technology, tutorials, React, JavaScript"
            />
            <section id="articles" className="py-20 min-h-screen pt-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white"><span className="text-primary">04.</span> Articles</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Thoughts, tutorials, and insights about technology and software development.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {articles.map((article, index) => (
                                <motion.article
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary dark:hover:border-primary transition-all group cursor-pointer h-full flex flex-col shadow-lg dark:shadow-none"
                                >
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500 mb-4 font-mono">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(article.created_at).toLocaleDateString()}</span>
                                            {article.read_time && <span className="flex items-center gap-1"><Clock size={14} /> {article.read_time}</span>}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                            <Link to={`/articles/${article.slug}`}>
                                                {article.title}
                                            </Link>
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed flex-1">
                                            {article.excerpt}
                                        </p>
                                        <Link to={`/articles/${article.slug}`} className="flex items-center text-primary font-medium group-hover:gap-2 transition-all mt-auto">
                                            Read Article <ArrowRight size={16} className="ml-1" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Articles;
