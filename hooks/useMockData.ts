import { useMemo } from 'react';
import { User, Post, Comment } from '../types';

export const useMockData = () => {
  const data = useMemo(() => {
    const users: User[] = [
      { id: 'u1', name: 'Alice', avatarUrl: 'https://picsum.photos/id/237/200', bio: 'Photographer & artist. Capturing moments and creating art. 📸✨' },
      { id: 'u2', name: 'Bob', avatarUrl: 'https://picsum.photos/id/238/200', bio: 'Beach lover and sunset chaser. Living life one wave at a time.' },
      { id: 'u3', name: 'Charlie', avatarUrl: 'https://picsum.photos/id/239/200', bio: 'Urban explorer and coffee enthusiast. Always on the lookout for the next great café.' },
      { id: 'u4', name: 'Diana', avatarUrl: 'https://picsum.photos/id/240/200', bio: 'WFH pro, tech geek, and interior design hobbyist. Building my dream workspace.' },
    ];

    const initialPosts: Post[] = [
      {
        id: 'p1',
        user: users[1],
        content: 'Just enjoying a beautiful sunset at the beach. Feeling grateful for moments like these! #sunset #beachlife #grateful',
        imageUrl: 'https://picsum.photos/id/1015/600/400',
        timestamp: '2 hours ago',
        likes: ['u1', 'u3', 'u4'],
        comments: [
          { id: 'c1', user: users[0], text: 'Wow, that looks amazing!' },
          { id: 'c2', user: users[3], text: 'So jealous! Wish I was there.' },
        ],
      },
      {
        id: 'p2',
        user: users[0],
        content: 'I baked a lemon tart today! It turned out better than I expected. 🍋',
        imageUrl: 'https://picsum.photos/id/1080/600/400',
        timestamp: '5 hours ago',
        likes: ['u2', 'u3'],
        comments: [
            { id: 'c3', user: users[1], text: 'That looks delicious! Can I have the recipe?' },
        ],
      },
      {
        id: 'p3',
        user: users[2],
        content: 'Exploring the city streets and found this hidden gem of a coffee shop. ☕️',
        imageUrl: 'https://picsum.photos/id/1060/600/400',
        timestamp: '1 day ago',
        likes: ['u1', 'u2', 'u3', 'u4'],
        comments: [],
      },
       {
        id: 'p4',
        user: users[3],
        content: 'My new workspace setup is finally complete! Ready to be productive. #wfh #homeoffice',
        imageUrl: 'https://picsum.photos/id/2/600/400',
        timestamp: '2 days ago',
        likes: ['u1'],
        comments: [
          { id: 'c4', user: users[0], text: 'Love the clean setup!' },
          { id: 'c5', user: users[2], text: 'Looks great! What monitor is that?' },
        ],
      }
    ];

    return { users, initialPosts };
  }, []);

  return data;
};
