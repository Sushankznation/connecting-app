import React, { useState } from 'react';
import UserList from './UserList';
import PostsList from './PostList';

const NewsFeed: React.FC<{ userId: string }> = ({ userId }) => {
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  // This will be called by UserList to refresh posts
  const handleFollowChange = () => {
    setRefetchTrigger((prev) => !prev); // Toggle refetch trigger to reload PostsList only
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar: UserList */}
        <div className="w-full md:w-1/2 lg:w-1/2 bg-gray-50 p-4 rounded-lg shadow-md">
          <UserList userId={userId} onFollowChange={handleFollowChange} />
        </div>
        
        {/* Right Content: PostsList */}
        <div className="w-full md:w-1/2 lg:w-3/4">
          <PostsList userId={userId} refetchTrigger={refetchTrigger} />
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
