import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error) throw error;
            setArticle(data);
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen section-surface pt-32 flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen section-surface pt-32 px-4 text-center transition-colors duration-300">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Article Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">The article you are looking for does not exist.</p>
                <Link to="/articles" className="text-slate-900 dark:text-white hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={article.title}
                description={article.excerpt}
                keywords={`${article.title}, article, blog, web development, ${article.tags || ''}`}
                image={article.cover_image}
                type="article"
            />
            <article className="min-h-screen section-surface pt-32 pb-24 transition-colors duration-300">
                {/* Hero / Header */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                    <Link to="/articles" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Articles
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium tracking-wide">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> 5 min read</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                            {article.title}
                        </h1>

                        {article.excerpt && (
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
                                {article.excerpt}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Cover Image */}
                {article.cover_image && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="rounded-2xl overflow-hidden shadow-xl"
                        >
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-[300px] md:h-[500px] object-cover bg-slate-100 dark:bg-slate-800"
                            />
                        </motion.div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                        prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-8
                        prose-a:text-slate-900 dark:prose-a:text-white prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:decoration-2
                        prose-blockquote:border-l-2 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-700 prose-blockquote:pl-6 prose-blockquote:italic
                        prose-code:text-slate-900 dark:prose-code:text-white prose-code:bg-slate-100 dark:prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:shadow-lg
                        prose-img:rounded-xl prose-img:shadow-md"
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    return !inline ? (
                                        <div className="relative group my-8">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </motion.div>

                    {/* Back to articles bottom */}
                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                        <Link to="/articles" className="inline-flex items-center text-slate-900 dark:text-white font-medium hover:opacity-70 transition-opacity">
                            <ArrowLeft size={20} className="mr-2" /> Back to All Articles
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};

export default ArticleDetail;
