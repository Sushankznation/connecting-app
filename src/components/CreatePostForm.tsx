import React, { useState } from 'react';
import { supabase } from '../queries/supabaseClient';
import { useMutation, gql } from '@apollo/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the GraphQL mutation
const CREATE_POST = gql`
  mutation CreatePost(
    $userId: UUID!,
    $content: String!,
    $imageUrl: String
  ) {
    insertIntopostsCollection(
      objects: [
        {
          user_id: $userId,
          content: $content,
          image_url: $imageUrl
        }
      ]
    ) {
      records {
        id
        user_id
        content
        image_url
        created_at
      }
    }
  }
`;

const CreatePostForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use the Apollo `useMutation` hook with the CREATE_POST mutation
  const [createPost] = useMutation(CREATE_POST);

  // Function to upload the image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Sanitize the filename to remove spaces and special characters
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filePath = `${userId}/${Date.now()}_${safeFileName}`;

      // Upload the file to the 'post-images' bucket
      const {  error } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (error) {
        console.error("Error details:", error); // Log detailed error information
        setErrorMessage(`Error uploading image: ${error.message}`);
        return null;
      }

      // Get the public URL for the uploaded file
      const { publicUrl } = supabase.storage.from('post-images').getPublicUrl(filePath).data || {};
      return publicUrl || null;
    } catch (err) {
      console.error("Unexpected error:", err); // Catch unexpected errors
      setErrorMessage("Unexpected error occurred while uploading image.");
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    // Initialize image URL as null
    let imageUrl = null;
    if (imageFile) {
      // Upload the image file if provided
      imageUrl = await uploadImage(imageFile);
    }

    // Stop if there's an error in uploading the image
    if (errorMessage) {
      setLoading(false);
      toast.error(errorMessage); // Show error toast for image upload failure
      return;
    }

    try {
      // Call the GraphQL mutation to create a post
      await createPost({
        variables: {
          userId,
          content,
          imageUrl,
        },
      });

      // Success handling
      toast.success("Post created successfully!"); // Success toast notification
      setContent("");
      setImageFile(null);
    } catch (error: any) {
      // Error handling
      setErrorMessage(`Error creating post: ${error.message}`);
      toast.error(`Error creating post: ${error.message}`); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
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
