import React, { useEffect, useState } from 'react';
import { supabase } from '../queries/supabaseClient';
import { InfinitySpin } from 'react-loader-spinner';
import { Post } from '../types';

interface PostsListProps {
    userId: string;
    refetchTrigger: boolean;
}

const PostsList: React.FC<PostsListProps> = ({ userId, refetchTrigger }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFollowedPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: followsData, error: followsError } = await supabase
                .from('follows')
                .select('followed_id')
                .eq('follower_id', userId);

            if (followsError) throw new Error('Error loading followed user IDs');
            const followedIds = followsData?.map((follow) => follow.followed_id) || [];

            if (followedIds.length > 0) {
                const { data: postsData, error: postsError } = await supabase
                    .rpc('get_followed_user_posts', { followed_ids: followedIds });

                if (postsError) throw new Error('Error loading posts');
                setPosts(postsData || []);
            } else {
                setPosts([]);
            }
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowedPosts();
    }, [refetchTrigger]);

    if (loading)
        return (
            <div className="flex justify-center items-center">
                <InfinitySpin width="200" color="#4fa94d" />
            </div>
        );

    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            {posts.length === 0 ? (
                <p className="text-center text-lg text-gray-400">
                    No posts available. Follow some users to see their posts here.
                </p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        className="p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <div className="text-lg font-semibold text-gray-800 truncate">{post.user_id}</div>
                                <p className="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 break-words">
                            {post.content}
                        </h3>

                        {post.image_url && (
                            <img
                                src={post.image_url}
                                alt="Post Image"
                                className="w-full h-auto mb-4 rounded-lg object-cover"
                                style={{ maxHeight: '400px' }}
                            />
                        )}

                        <div className="text-gray-600">
                            <p>
                                Posted by: <span className="font-medium text-blue-500">{post.user_id}</span>
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PostsList;
