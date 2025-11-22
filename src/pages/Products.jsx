import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Products"
                description="Browse my collection of digital products, templates, and resources."
                keywords="digital products, templates, react themes, developer tools, software assets"
            />
            <section className="py-20 min-h-screen pt-32 bg-white dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Digital Products</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            High-quality digital assets and templates to accelerate your development workflow.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all group flex flex-col shadow-lg dark:shadow-none"
                                >
                                    <div className="relative overflow-hidden h-48 bg-slate-200 dark:bg-slate-700 shrink-0">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                <ShoppingBag size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                                            {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm line-clamp-3 flex-1">
                                            {product.description}
                                        </p>
                                        <a
                                            href={product.buy_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 bg-slate-900 dark:bg-slate-700 hover:bg-primary dark:hover:bg-primary text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-auto"
                                        >
                                            Buy Now <ExternalLink size={18} />
                                        </a>
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

export default ProductsPage;
