import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, Plus, Trash2, Upload, X } from 'lucide-react';

const Profile = () => {
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            skills: []
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills"
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const avatarUrl = watch('avatar_url');

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        if (avatarUrl) setPreviewImage(avatarUrl);
    }, [avatarUrl]);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setValue('full_name', data.full_name);
                    setValue('tagline', data.tagline);
                    setValue('bio', data.bio);
                    setValue('about_content', data.about_content);
                    setValue('email', data.email);
                    setValue('phone', data.phone);
                    setValue('location', data.location);
                    setValue('github', data.social_links?.github || '');
                    setValue('linkedin', data.social_links?.linkedin || '');
                    setValue('twitter', data.social_links?.twitter || '');
                    setValue('avatar_url', data.avatar_url);

                    if (data.skills && Array.isArray(data.skills)) {
                        setValue('skills', data.skills);
                    }
                } else {
                    setValue('email', user.email);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error.message);
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
            const fileName = `avatar_${Math.random()}.${fileExt}`;
            const filePath = `profile/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setValue('avatar_url', publicUrl);
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

            if (!user) throw new Error('No user logged in');

            const updates = {
                id: user.id,
                full_name: data.full_name,
                tagline: data.tagline,
                bio: data.bio,
                about_content: data.about_content,
                email: data.email,
                phone: data.phone,
                location: data.location,
                avatar_url: data.avatar_url,
                social_links: {
                    github: data.github,
                    linkedin: data.linkedin,
                    twitter: data.twitter
                },
                skills: data.skills,
                updated_at: new Date(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;
            alert('Profile updated!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Website Content & Profile</h1>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Hero Section */}
                    <section>
                        <h2 className="text-xl font-bold text-primary mb-4 border-b border-slate-800 pb-2">Hero Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avatar Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Profile Picture (Avatar & Favicon)</label>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="avatar-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} />}
                                                <span className="text-slate-400">{uploading ? 'Uploading...' : 'Upload Avatar'}</span>
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-xs text-slate-500">Or enter URL manually:</span>
                                            <input
                                                {...register('avatar_url')}
                                                placeholder="https://..."
                                                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {previewImage && (
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-950 relative group shrink-0">
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setValue('avatar_url', '');
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
                                <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                                <input
                                    {...register('full_name', { required: true })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Tagline (Hero Subtitle)</label>
                                <input
                                    {...register('tagline')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Short Bio (Meta Description)</label>
                                <textarea
                                    {...register('bio')}
                                    rows="2"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section>
                        <h2 className="text-xl font-bold text-primary mb-4 border-b border-slate-800 pb-2">About Section</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">About Content</label>
                                <textarea
                                    {...register('about_content')}
                                    rows="6"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                    placeholder="Write a detailed bio..."
                                ></textarea>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-slate-400">Skills</label>
                                    <button
                                        type="button"
                                        onClick={() => append({ category: '', items: '' })}
                                        className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Category
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-4 items-start bg-slate-950 p-4 rounded-lg border border-slate-800">
                                            <div className="flex-1">
                                                <input
                                                    {...register(`skills.${index}.category`)}
                                                    placeholder="Category (e.g. Frontend)"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm mb-2 focus:border-primary focus:outline-none"
                                                />
                                                <input
                                                    {...register(`skills.${index}.items`)}
                                                    placeholder="Skills (comma separated, e.g. React, Vue)"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-slate-500 hover:text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section>
                        <h2 className="text-xl font-bold text-primary mb-4 border-b border-slate-800 pb-2">Contact Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                <input
                                    {...register('email')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                                <input
                                    {...register('phone')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                                <input
                                    {...register('location')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Social Links */}
                    <section>
                        <h2 className="text-xl font-bold text-primary mb-4 border-b border-slate-800 pb-2">Social Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">GitHub URL</label>
                                <input
                                    {...register('github')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">LinkedIn URL</label>
                                <input
                                    {...register('linkedin')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Twitter URL</label>
                                <input
                                    {...register('twitter')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end pt-6 sticky bottom-0 bg-slate-900 p-4 border-t border-slate-800 -mx-8 -mb-8 rounded-b-xl">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            Save All Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
