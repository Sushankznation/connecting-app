// src/CreatePostForm.tsx
import React, { useState } from 'react';
import { supabase } from '../queries/supabaseClient';

const CreatePostForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    // const { data, error } = await supabase.storage
    const {  error } = await supabase.storage
      .from('post-images')
      .upload(filePath, file);
    if (error) {
      setErrorMessage(`Error uploading image: ${error.message}`);
      return null;
    }
    return supabase.storage.from('post-images').getPublicUrl(filePath).data.publicUrl || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    let imageUrl = null;
    if (imageFile) imageUrl = await uploadImage(imageFile);
    if (errorMessage) {
      setLoading(false);
      return; // Stop submission if there's an error with image upload
    }

    // Use Supabase client directly to insert a new post into the database
    // const { data, error } = await supabase
    const {  error } = await supabase
      .from('posts')
      .insert([{ user_id: userId, content, image_url: imageUrl }]);

    if (error) {
      setErrorMessage(`Error creating post: ${error.message}`);
    } else {
      // Alert on successful post creation
      alert("Post created successfully!");
      setContent("");
      setImageFile(null);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Create a Post</h2>

      {errorMessage && (
        <div className="mb-4 text-red-600 text-center bg-red-100 border border-red-400 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
        required
      />

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default CreatePostForm;
