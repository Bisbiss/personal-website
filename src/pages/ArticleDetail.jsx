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
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 px-4 text-center transition-colors duration-300">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Article Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">The article you are looking for does not exist.</p>
                <Link to="/articles" className="text-primary hover:text-primary-hover flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={article.title}
                description={article.excerpt || article.content?.substring(0, 160)}
                keywords={`${article.title}, article, blog, web development, ${article.tags || ''}`}
                image={article.cover_image}
                type="article"
            />
            <article className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
                {/* Hero / Header */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <Link to="/articles" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary mb-8 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back to Articles
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500 mb-6 font-mono">
                            <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(article.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={16} /> 5 min read</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-primary pl-6 italic">
                            {article.excerpt}
                        </p>
                    </motion.div>
                </div>

                {/* Cover Image */}
                {article.cover_image && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl"
                        >
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-[400px] md:h-[500px] object-cover"
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
                        className="prose dark:prose-invert prose-lg max-w-none 
            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline 
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
            prose-code:text-primary prose-code:bg-slate-100 dark:prose-code:bg-slate-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:p-4 prose-pre:rounded-xl
            prose-ul:list-disc prose-ul:pl-6 prose-ul:text-slate-600 dark:prose-ul:text-slate-300 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-slate-600 dark:prose-ol:text-slate-300 prose-ol:mb-6
            prose-blockquote:border-l-primary prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-blockquote:italic prose-blockquote:pl-6"
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    return !inline ? (
                                        <div className="relative group">
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
                </div>
            </article>
        </>
    );
};

export default ArticleDetail;
