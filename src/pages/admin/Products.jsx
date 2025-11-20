import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, X, Save, Loader } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            const productData = {
                ...data,
                user_id: user.id
            };

            if (editId) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            await fetchProducts();
            resetForm();
        } catch (error) {
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            alert('Error deleting product: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setEditId(product.id);
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price);
        setValue('image_url', product.image_url);
        setValue('buy_link', product.buy_link);
        setValue('is_active', product.is_active);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Products</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">{editId ? 'Edit Product' : 'New Product'}</h2>
                        <button onClick={resetForm} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Product Name</label>
                                <input
                                    {...register('name', { required: true })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                                {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows="3"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Image URL</label>
                                <input
                                    {...register('image_url')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Buy Link</label>
                                <input
                                    {...register('buy_link')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register('is_active')}
                                    id="is_active"
                                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-slate-400">Active (Visible)</label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                {editId ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {products.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                            No products found.
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-slate-800" />
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                                        <p className="text-primary font-mono">${product.price}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
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

export default Products;
