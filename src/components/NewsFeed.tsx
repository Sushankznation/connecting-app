import React, { useEffect, useState } from 'react';
import { supabase } from '../queries/supabaseClient';
import UserList from './UserList';
import { Post } from '../types';

const NewsFeed: React.FC<{ userId: string }> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch posts from followed users
  const fetchFollowedPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch the IDs of users that the current user follows
      const { data: followsData, error: followsError } = await supabase
        .from('follows')
        .select('followed_id')
        .eq('follower_id', userId);

      if (followsError) throw new Error('Error loading followed user IDs');
      const followedIds = followsData?.map((follow) => follow.followed_id) || [];

      console.log("Followed User IDs:", followedIds); // Debugging log

      // Step 2: Fetch posts from followed users using the RPC function
      if (followedIds.length > 0) {
        const { data: postsData, error: postsError } = await supabase
          .rpc('get_followed_user_posts', { followed_ids: followedIds });

        if (postsError) throw new Error('Error loading posts');
        console.log("Fetched Posts Data:", postsData);
        setPosts(postsData || []);
      } else {
        setPosts([]); // No followed users, no posts to show
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // This will be called by UserList to refresh posts
  const handleFollowChange = () => {
    fetchFollowedPosts(); // Refresh posts after a follow/unfollow
  };

  useEffect(() => {
    fetchFollowedPosts();
  }, [userId]);

  if (loading) return <div className="text-center text-xl text-gray-500">Loading posts...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Pass the callback function to UserList */}
      <UserList userId={userId} onFollowChange={handleFollowChange} />
      {posts.length === 0 ? (
        <p className="text-center text-lg text-gray-400">No posts available. Follow some users to see their posts here.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
            <div className="mb-4 flex items-center space-x-4">
              <div className="text-lg font-semibold">{post.user_id}</div>
              <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
            </div>
            <h3 className="text-xl font-bold mb-2">{post.content}</h3>
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post Image" 
                className="w-full h-auto mb-4 rounded-lg object-cover"
                style={{ maxHeight: '400px' }} 
              />
            )}
            <div className="text-gray-600">
              <p>Posted by: <span className="font-medium text-blue-500">{post.user_id}</span></p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsFeed;
