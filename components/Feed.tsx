import React from 'react';
import { useAppContext } from '../App';
import { PostCard } from './PostCard';
import { CreatePostForm } from './CreatePostForm';

export const Feed: React.FC = () => {
  const { posts, currentUser } = useAppContext();

  return (
    <div className="max-w-2xl mx-auto">
      {currentUser && <CreatePostForm />}
      <div className="space-y-6 mt-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
