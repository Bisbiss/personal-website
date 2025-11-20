import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, X, Save, Loader, Upload, Image as ImageIcon } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    // Watch image_url to show preview if manually entered or set
    const imageUrl = watch('image_url');

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (imageUrl) setPreviewImage(imageUrl);
    }, [imageUrl]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
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
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setValue('image_url', publicUrl);
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

            const projectData = {
                ...data,
                tech_stack: typeof data.tech_stack === 'string' ? data.tech_stack.split(',').map(item => item.trim()) : data.tech_stack,
                user_id: user.id
            };

            if (editId) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([projectData]);
                if (error) throw error;
            }

            await fetchProjects();
            resetForm();
        } catch (error) {
            alert('Error saving project: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProjects();
        } catch (error) {
            alert('Error deleting project: ' + error.message);
        }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setEditId(project.id);
        setValue('title', project.title);
        setValue('description', project.description);
        setValue('image_url', project.image_url);
        setPreviewImage(project.image_url);
        setValue('demo_url', project.demo_url);
        setValue('github_url', project.github_url);
        setValue('tech_stack', project.tech_stack?.join(', '));
        setValue('is_featured', project.is_featured);
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
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} /> Add Project
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">{editId ? 'Edit Project' : 'New Project'}</h2>
                        <button onClick={resetForm} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                                <input
                                    {...register('title', { required: true })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                                {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows="3"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>

                            {/* Image Upload Section */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Project Image</label>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="project-image-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="project-image-upload"
                                                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} />}
                                                <span className="text-slate-400">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-xs text-slate-500">Or enter URL manually:</span>
                                            <input
                                                {...register('image_url')}
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
                                                    setValue('image_url', '');
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
                                <label className="block text-sm font-medium text-slate-400 mb-2">Tech Stack (comma separated)</label>
                                <input
                                    {...register('tech_stack')}
                                    placeholder="React, Node.js, Supabase"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Demo URL</label>
                                <input
                                    {...register('demo_url')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">GitHub URL</label>
                                <input
                                    {...register('github_url')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register('is_featured')}
                                    id="is_featured"
                                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary"
                                />
                                <label htmlFor="is_featured" className="text-sm font-medium text-slate-400">Feature this project</label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                {editId ? 'Update Project' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {projects.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                            No projects found. Create one to get started.
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-20 h-20 object-cover rounded-lg bg-slate-800" />
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                        <p className="text-slate-400 text-sm mb-2 line-clamp-1">{project.description}</p>
                                        <div className="flex gap-2">
                                            {project.tech_stack?.map(tech => (
                                                <span key={tech} className="text-xs bg-slate-800 text-primary px-2 py-1 rounded border border-slate-700">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
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

export default Projects;
