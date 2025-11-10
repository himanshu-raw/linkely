import React, { useState } from 'react';
import { useAppContext } from '../App';
import { PostCard } from './PostCard';
import { EditProfileModal } from './EditProfileModal';

interface ProfilePageProps {
  userId: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { users, posts, currentUser } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const user = users.find(u => u.id === userId);
  const userPosts = posts.filter(p => p.user.id === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const isOwnProfile = currentUser?.id === userId;

  if (!user) {
    return <div className="text-center text-gray-500">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-4">
               <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
               {isOwnProfile && (
                 <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                   Edit Profile
                 </button>
               )}
            </div>
            <p className="mt-2 text-gray-600">{user.bio}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Posts</h2>
      <div className="space-y-6">
        {userPosts.length > 0 ? (
            userPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
            <div className="text-center text-gray-500 mt-8 bg-white p-6 rounded-lg border border-gray-200">
                <p>This user hasn't posted anything yet.</p>
            </div>
        )}
      </div>
      {isEditModalOpen && user && (
          <EditProfileModal user={user} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};
