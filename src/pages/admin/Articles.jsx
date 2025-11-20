import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, X, Save, Loader, Upload, Image as ImageIcon } from 'lucide-react';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    const coverImage = watch('cover_image');

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        if (coverImage) setPreviewImage(coverImage);
    }, [coverImage]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `article_${Math.random()}.${fileExt}`;
            const filePath = `articles/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setValue('cover_image', publicUrl);
            setPreviewImage(publicUrl);
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            const articleData = {
                ...data,
                user_id: user.id
            };

            if (editId) {
                const { error } = await supabase
                    .from('articles')
                    .update(articleData)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('articles')
                    .insert([articleData]);
                if (error) throw error;
            }

            await fetchArticles();
            resetForm();
        } catch (error) {
            alert('Error saving article: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;

        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchArticles();
        } catch (error) {
            alert('Error deleting article: ' + error.message);
        }
    };

    const handleEdit = (article) => {
        setIsEditing(true);
        setEditId(article.id);
        setValue('title', article.title);
        setValue('slug', article.slug);
        setValue('excerpt', article.excerpt);
        setValue('content', article.content);
        setValue('cover_image', article.cover_image);
        setPreviewImage(article.cover_image);
        setValue('is_published', article.is_published);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setPreviewImage(null);
        reset();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Articles</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} /> Add Article
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">{editId ? 'Edit Article' : 'New Article'}</h2>
                        <button onClick={resetForm} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                                <input
                                    {...register('title', { required: true })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                                {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Slug (URL friendly)</label>
                                <input
                                    {...register('slug', { required: true })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                                {errors.slug && <span className="text-red-500 text-sm">Slug is required</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Excerpt</label>
                                <textarea
                                    {...register('excerpt')}
                                    rows="2"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Cover Image</label>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="article-image-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="article-image-upload"
                                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} />}
                                                <span className="text-slate-400">{uploading ? 'Uploading...' : 'Upload Cover Image'}</span>
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-xs text-slate-500">Or enter URL manually:</span>
                                            <input
                                                {...register('cover_image')}
                                                placeholder="https://..."
                                                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {previewImage && (
                                        <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 relative group">
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setValue('cover_image', '');
                                                    setPreviewImage(null);
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Content (Markdown)</label>
                                <textarea
                                    {...register('content')}
                                    rows="10"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-mono focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register('is_published')}
                                    id="is_published"
                                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-slate-400">Publish immediately</label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                {editId ? 'Update Article' : 'Create Article'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {articles.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                            No articles found. Write something amazing!
                        </div>
                    ) : (
                        articles.map((article) => (
                            <div key={article.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    {article.cover_image ? (
                                        <img src={article.cover_image} alt={article.title} className="w-20 h-20 object-cover rounded-lg bg-slate-800" />
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-white">{article.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${article.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {article.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-2 font-mono">/{article.slug}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(article)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Articles;
