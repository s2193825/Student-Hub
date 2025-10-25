
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ForumPost, User, ForumReply } from '../types';
import { ArrowUpIcon, UsersIcon } from './icons';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import SkeletonLoader from './SkeletonLoader';

// A simple simulated rich text editor
const RichTextEditor: React.FC<{ value: string, onChange: (v: string) => void }> = ({ value, onChange }) => {
    return (
        <div className="bg-white rounded-lg border border-border-color">
            <div className="p-2 border-b border-border-color flex space-x-2">
                <button className="font-bold w-8 h-8 hover:bg-light-bg rounded">B</button>
                <button className="italic w-8 h-8 hover:bg-light-bg rounded">I</button>
                <button className="underline w-8 h-8 hover:bg-light-bg rounded">U</button>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-32 p-3 focus:outline-none"
                placeholder="Write your reply..."
            />
        </div>
    );
};


const ForumPostDetail: React.FC<{ post: ForumPost, onBack: () => void }> = ({ post, onBack }) => {
    const { user, forumPosts, updateForumPost } = useData();
    const { addNotification } = useNotification();
    const [newReply, setNewReply] = useState('');
    
    const currentPost = forumPosts.find(p => p.id === post.id)!;
    const replies = currentPost.replies;

    const handleUpvote = (replyId: string) => {
        const updatedReplies = replies.map(r => r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r);
        // Optimistic update
        updateForumPost({ ...currentPost, replies: updatedReplies }, true);
    };
    
    const handlePostReply = () => {
        if (!newReply.trim() || !user) return;
        const reply: ForumReply = {
            id: `r-${Date.now()}`,
            author: user,
            content: newReply,
            timestamp: 'Just now',
            upvotes: 0,
        };
        const updatedReplies = [...replies, reply];
        updateForumPost({ ...currentPost, replies: updatedReplies });
        setNewReply('');
        addNotification('success', 'Reply posted!');
    };

    return (
        <div className="p-8">
            <button onClick={onBack} className="text-primary font-semibold mb-6">&larr; Back to All Posts</button>
            <div className="bg-white rounded-xl shadow-lg border border-border-color p-8">
                <div className="border-b border-border-color pb-4 mb-6">
                    <h1 className="text-4xl font-bold text-dark-text">{post.title}</h1>
                    <div className="flex items-center space-x-2 mt-3 text-medium-text">
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-8 h-8 rounded-full" />
                        <span>{post.author.name}</span>
                        <span>&bull;</span>
                        <span>{post.timestamp}</span>
                    </div>
                     <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map(tag => <span key={tag} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">#{tag}</span>)}
                    </div>
                </div>
                <p className="text-lg text-medium-text mb-8">{post.content}</p>

                <h2 className="text-2xl font-bold text-dark-text mb-4">{replies.length} Replies</h2>
                <div className="space-y-6">
                    {replies.sort((a,b) => b.upvotes - a.upvotes).map(reply => (
                        <div key={reply.id} className="flex space-x-4">
                            <div className="flex flex-col items-center">
                                <button onClick={() => handleUpvote(reply.id)} className="p-2 rounded-full hover:bg-green-100 text-green-600">
                                    <ArrowUpIcon className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-green-700">{reply.upvotes}</span>
                            </div>
                            <div className="flex-grow bg-light-bg p-4 rounded-lg">
                                <div className="flex items-center space-x-2 text-sm">
                                    <img src={reply.author.avatarUrl} alt={reply.author.name} className="w-6 h-6 rounded-full" />
                                    <span className="font-semibold text-dark-text">{reply.author.name}</span>
                                    <span className="text-light-text">&bull; {reply.timestamp}</span>
                                 </div>
                                <p className="mt-2 text-medium-text">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-10 pt-6 border-t border-border-color">
                     <h3 className="text-xl font-bold text-dark-text mb-3">Leave a Reply</h3>
                     <RichTextEditor value={newReply} onChange={setNewReply} />
                     <button onClick={handlePostReply} className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-hover transition-colors">
                         Post Reply
                     </button>
                 </div>
            </div>
        </div>
    );
}

const Forums: React.FC = () => {
  const { forumPosts, loading } = useData();
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags: string[] = [...new Set(forumPosts.flatMap(p => p.tags))];
  const filteredPosts = activeTag ? forumPosts.filter(p => p.tags.includes(activeTag)) : forumPosts;

  if (selectedPost) {
    return <ForumPostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
          Create New Post
        </button>
      </div>
      <div className="flex space-x-2 mb-6 border-b border-border-color pb-4">
        <button onClick={() => setActiveTag(null)} className={!activeTag ? 'bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold' : 'bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-300'}>All</button>
        {allTags.map(tag => (
             <button key={tag} onClick={() => setActiveTag(tag)} className={activeTag === tag ? 'bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold' : 'bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-300'}>#{tag}</button>
        ))}
      </div>
      <div className="flex-grow bg-white rounded-xl shadow-lg border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <ul className="divide-y divide-border-color">
            {loading ? (
                Array.from({length: 5}).map((_, i) => (
                    <li key={i} className="p-4 flex items-center space-x-4">
                        <SkeletonLoader className="w-12 h-12 rounded-full" />
                        <div className="flex-grow">
                            <SkeletonLoader className="h-6 w-3/4 mb-2" />
                            <SkeletonLoader className="h-4 w-1/2" />
                        </div>
                        <div className="w-24">
                            <SkeletonLoader className="h-6 w-1/2 mx-auto" />
                        </div>
                    </li>
                ))
            ) : (
                filteredPosts.map(post => (
                <li key={post.id} className="p-4 flex items-center space-x-4 hover:bg-light-bg cursor-pointer" onClick={() => setSelectedPost(post)}>
                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-dark-text hover:text-primary">{post.title}</h3>
                    <p className="text-sm text-medium-text">
                        Posted by <span className="font-medium text-dark-text">{post.author.name}</span> &bull; {post.timestamp}
                    </p>
                    </div>
                    <div className="text-center w-24 flex items-center justify-center text-medium-text">
                    <UsersIcon className="w-5 h-5 mr-2" />
                    <span className="font-bold text-dark-text">{post.replies.length}</span>
                    </div>
                </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Forums;
