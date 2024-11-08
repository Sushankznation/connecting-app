// src/NewsFeed.tsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from './queries';

const POST_LIMIT = 10;

const NewsFeed: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables: { first: POST_LIMIT, offset: 0 },
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = useCallback(() => {
    if (data?.postsCollection?.edges) {
      fetchMore({
        variables: {
          offset: data.postsCollection.edges.length,
        },
      });
    }
  }, [fetchMore, data?.postsCollection?.edges?.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMorePosts]);

  if (loading && offset === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Handle cases where no data is returned
  if (!data?.postsCollection?.edges || data.postsCollection.edges.length === 0) {
    return <p>No posts available</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">News Feed</h2>
      {data.postsCollection.edges.map(({ node }: any) => (
        <div key={node.id} className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold text-lg">User: {node.user_id}</h3>
          <p className="text-gray-700 mt-2">{node.content}</p>
          {node.image_url && (
            <img
              src={node.image_url}
              alt="Post"
              className="w-full h-auto rounded mt-4"
            />
          )}
          <p className="text-xs text-gray-500 mt-1">{new Date(node.created_at).toLocaleString()}</p>
        </div>
      ))}
      <div ref={loadMoreRef} className="h-12"></div>
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};

export default NewsFeed;
