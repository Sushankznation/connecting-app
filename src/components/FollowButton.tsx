import React from 'react';
import { useMutation } from '@apollo/client';
import { FOLLOW_USER, UNFOLLOW_USER } from '../queries/queries';

interface FollowButtonProps {
  followerId: string;
  followingId: string;
  isFollowing: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ followerId, followingId, isFollowing }) => {
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const handleFollow = async () => {
    try {
      await followUser({ variables: { followerId, followingId } });
      alert('You are now following this user!');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser({ variables: { followerId, followingId } });
      alert('You have unfollowed this user!');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      className={`p-2 rounded ${isFollowing ? 'bg-red-500' : 'bg-blue-500'} text-white`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
