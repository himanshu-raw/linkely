import React, { useState } from 'react';
import { useAppContext } from '../App';
import { generatePostIdea } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const CreatePostForm: React.FC = () => {
  const { currentUser, addPost } = useAppContext();

  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert('Image size should be less than 2MB.');
          return;
      }
      setImageFile(file);
      const dataUri = await fileToDataUri(file);
      setImage(dataUri);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    
    const newPost = {
      id: `p${Date.now()}`,
      user: currentUser,
      content: content.trim(),
      imageUrl: image || undefined,
      timestamp: new Date().toLocaleString(),
      likes: [],
      comments: [],
    };

    addPost(newPost);
    setContent('');
    setImage(null);
    setImageFile(null);
  };

  const handleGenerateIdea = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const idea = await generatePostIdea();
      setContent(idea);
    } catch (err) {
      setError('Failed to generate post idea. Please check your API key.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start space-x-3">
        <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-12 h-12 rounded-full object-cover" />
        <form onSubmit={handleSubmit} className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${currentUser?.name}?`}
            className="w-full p-2 border-none rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={3}
          />
          {image && (
            <div className="mt-2 relative">
              <img src={image} alt="Preview" className="rounded-lg max-h-80 w-auto" />
              <button onClick={() => { setImage(null); setImageFile(null); }} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1">&times;</button>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </label>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              <button type="button" onClick={handleGenerateIdea} disabled={isGenerating} className="flex items-center space-x-1 p-2 rounded-full text-purple-500 hover:text-purple-700 hover:bg-purple-50 disabled:opacity-50">
                <SparklesIcon />
                <span className="text-sm font-medium hidden sm:inline">{isGenerating ? 'Generating...' : 'Idea'}</span>
              </button>
            </div>
            <button type="submit" disabled={!content.trim()} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:bg-blue-300">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
