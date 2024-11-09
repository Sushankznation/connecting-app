import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

interface Post {
  id: string;
  content: string;
  created_at: string;
  image_url?: string;
  user_id: string;
}

const NewsFeed: React.FC<{ userId: string }> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowedPosts = async () => {
    setLoading(true);
    setError(null);

    // Step 1: Fetch the IDs of users that the current user follows
    const { data: followsData, error: followsError } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', userId);

    if (followsError) {
      setError('Error loading followed user IDs');
      setLoading(false);
      return;
    }

    const followedIds = followsData?.map((follow) => follow.followed_id) || [];
    console.log("Followed User IDs:", followedIds);
    // Step 2: Fetch posts from followed users using the RPC function
    const { data: postsData, error: postsError } = await supabase
      .rpc('get_followed_user_posts', { followed_ids: followedIds });

    if (postsError) {
      setError('Error loading posts');
    } else {
      setPosts(postsData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFollowedPosts();
  }, [userId]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4 p-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold">{post.content}</h3>
          <p className="text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
          {post.image_url && (
            <img src={post.image_url} alt="Post Image" className="w-full h-auto mt-2 rounded" />
          )}
          <p className="text-gray-600">Posted by: {post.user_id}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
