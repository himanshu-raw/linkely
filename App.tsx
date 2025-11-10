import React, { useState, useMemo, useCallback, useContext } from 'react';
import { Navbar } from './components/Navbar';
import { Feed } from './components/Feed';
import { AuthModal } from './components/AuthModal';
import { useMockData } from './hooks/useMockData';
import { User, Post, Comment } from './types';
import { ProfilePage } from './components/ProfilePage';

// --- AppContext ---
interface AppContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  users: User[];
  updateUser: (updatedUser: User) => void;
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (postId: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  navigateToProfile: (userId: string) => void;
  navigateToFeed: () => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

// Custom hook to use the AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export default function App() {
  const { users: initialUsers, initialPosts } = useMockData();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [view, setView] = useState<{ type: 'feed' | 'profile'; userId?: string }>({ type: 'feed' });

  const login = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    navigateToFeed();
  }, []);

  const addPost = useCallback((post: Post) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  }, []);

  const updatePost = useCallback((updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  }, []);

  const deletePost = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  }, []);
  
  const toggleLike = useCallback((postId: string, userId: string) => {
      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              const isLiked = post.likes.includes(userId);
              const newLikes = isLiked
                  ? post.likes.filter(id => id !== userId)
                  : [...post.likes, userId];
              return { ...post, likes: newLikes };
          }
          return post;
      }));
  }, []);

  const addComment = useCallback((postId: string, comment: Comment) => {
      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              return { ...post, comments: [...post.comments, comment] };
          }
          return post;
      }));
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    setPosts(prevPosts => prevPosts.map(p => {
        const newPost = { ...p };
        if (newPost.user.id === updatedUser.id) {
            newPost.user = updatedUser;
        }
        newPost.comments = newPost.comments.map(c => {
            if (c.user.id === updatedUser.id) {
                return { ...c, user: updatedUser };
            }
            return c;
        });
        return newPost;
    }));

    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  const navigateToProfile = useCallback((userId: string) => {
    setView({ type: 'profile', userId });
    window.scrollTo(0, 0);
  }, []);

  const navigateToFeed = useCallback(() => {
    setView({ type: 'feed' });
    window.scrollTo(0, 0);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser, login, logout,
    posts, addPost, updatePost, deletePost, toggleLike, addComment,
    users, updateUser,
    navigateToProfile, navigateToFeed
  }), [currentUser, posts, users, login, logout, addPost, updatePost, deletePost, toggleLike, addComment, updateUser, navigateToProfile, navigateToFeed]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="bg-gray-50 min-h-screen">
        <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          {view.type === 'feed' && <Feed />}
          {view.type === 'profile' && view.userId && <ProfilePage userId={view.userId} />}
        </main>
        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)} 
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
