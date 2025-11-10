import React, { useState, useRef } from 'react';
import { Post } from '../types';
import { useAppContext } from '../App';
import { HeartIcon } from './icons/HeartIcon';
import { CommentIcon } from './icons/CommentIcon';
import { MoreIcon } from './icons/MoreIcon';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, updatePost, deletePost, toggleLike, addComment, navigateToProfile } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUser?.id === post.user.id;
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;

  const handleUpdate = () => {
    if (editedContent.trim()) {
      updatePost({ ...post, content: editedContent });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
  };

  const handleLike = () => {
    if (currentUser) {
      toggleLike(post.id, currentUser.id);
    } else {
      alert("Please log in to like posts.");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && newComment.trim()) {
      const comment = {
        id: `c${Date.now()}`,
        user: currentUser,
        text: newComment.trim(),
      };
      addComment(post.id, comment);
      setNewComment('');
    } else if (!currentUser) {
        alert("Please log in to comment.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigateToProfile(post.user.id)} className="flex items-center space-x-3 text-left">
          <img src={post.user.avatarUrl} alt={post.user.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-gray-800 hover:underline">{post.user.name}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </button>
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <MoreIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                <button onClick={() => { handleDelete(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm bg-gray-200 rounded-md">Cancel</button>
              <button onClick={handleUpdate} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">Save</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        )}
      </div>
      
      {post.imageUrl && !isEditing && (
        <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />
      )}

      <div className="px-4 py-2 flex justify-between items-center text-gray-500">
        <div className="flex space-x-6">
          <button onClick={handleLike} className={`flex items-center space-x-2 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}>
            <HeartIcon filled={isLiked} />
            <span>{post.likes.length}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 hover:text-blue-500">
            <CommentIcon />
            <span>{post.comments.length}</span>
          </button>
        </div>
      </div>
      
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="mt-4 space-y-4 max-h-60 overflow-y-auto">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-3">
                 <button onClick={() => navigateToProfile(comment.user.id)}>
                    <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full object-cover mt-1" />
                </button>
                <div>
                  <div className="bg-gray-100 rounded-lg p-2">
                     <button onClick={() => navigateToProfile(comment.user.id)} className="font-semibold text-sm text-gray-800 hover:underline">{comment.user.name}</button>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {currentUser && (
             <form onSubmit={handleAddComment} className="mt-4 flex items-center space-x-2">
              <img src={currentUser.avatarUrl} alt="Your avatar" className="w-8 h-8 rounded-full object-cover"/>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow p-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600">Post</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
