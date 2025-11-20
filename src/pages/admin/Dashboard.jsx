import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FolderGit2, FileText, ShoppingBag, User, ArrowRight, Plus } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        articles: 0,
        products: 0
    });
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch Profile
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();
                setProfile(profileData);
            }

            // Fetch Counts
            const { count: projectsCount } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true });

            const { count: articlesCount } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true });

            const { count: productsCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            setStats({
                projects: projectsCount || 0,
                articles: articlesCount || 0,
                products: productsCount || 0
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: <FolderGit2 size={24} />,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            link: '/admin/projects'
        },
        {
            title: 'Articles',
            value: stats.articles,
            icon: <FileText size={24} />,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            link: '/admin/articles'
        },
        {
            title: 'Products',
            value: stats.products,
            icon: <ShoppingBag size={24} />,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            link: '/admin/products'
        },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Welcome back, <span className="text-primary font-medium">{profile?.full_name || 'Admin'}</span>! Here's what's happening.
                    </p>
                </div>
                <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    View Live Site <ArrowRight size={16} />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {statCards.map((stat, index) => (
                    <Link
                        to={stat.link}
                        key={index}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all group shadow-sm dark:shadow-none"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="text-slate-400 group-hover:text-primary transition-colors">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? '-' : stat.value}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                    to="/admin/projects"
                    className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                >
                    <div className="bg-blue-500/10 p-2 rounded text-blue-400"><Plus size={18} /></div>
                    <span className="font-medium">Add New Project</span>
                </Link>

                <Link
                    to="/admin/articles"
                    className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                >
                    <div className="bg-green-500/10 p-2 rounded text-green-400"><Plus size={18} /></div>
                    <span className="font-medium">Write Article</span>
                </Link>

                <Link
                    to="/admin/products"
                    className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                >
                    <div className="bg-purple-500/10 p-2 rounded text-purple-400"><Plus size={18} /></div>
                    <span className="font-medium">Add Product</span>
                </Link>

                <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                >
                    <div className="bg-orange-500/10 p-2 rounded text-orange-400"><User size={18} /></div>
                    <span className="font-medium">Update Profile</span>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
