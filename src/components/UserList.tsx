import React, { useEffect, useState } from 'react';
import { supabase } from '../queries/supabaseClient';
import { InfinitySpin } from 'react-loader-spinner';

interface UserListProps {
  userId: string;
  onFollowChange: () => void;
}

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
}

const UserList: React.FC<UserListProps> = ({ userId, onFollowChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from('users').select('id, username, name, email');

    if (error) {
      setError('Error loading users');
      console.error(error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const fetchFollowing = async () => {
    const { data, error } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following list:', error);
    } else {
      setFollowing(data ? data.map((follow) => follow.followed_id) : []);
    }
  };

  const handleFollow = async (followedId: string) => {
    const { error } = await supabase
      .from('follows')
      .insert([{ follower_id: userId, followed_id: followedId }]);

    if (error) {
      console.error('Error following user:', error);
    } else {
      setFollowing((prev) => [...prev, followedId]);
      onFollowChange();
    }
  };

  const handleUnfollow = async (followedId: string) => {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', userId)
      .eq('followed_id', followedId);

    if (error) {
      console.error('Error unfollowing user:', error);
    } else {
      setFollowing((prev) => prev.filter((id) => id !== followedId));
      onFollowChange();
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFollowing();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <InfinitySpin width="200" color="#4fa94d" />
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between space-x-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-lg">{user.name || user.username}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div>
              {following.includes(user.id) ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  Follow
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
