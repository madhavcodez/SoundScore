import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, MoreVertical, Edit, Trash2 } from 'react-feather';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const List = ({ list, isOwner, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setIsLiked(list.likes.includes(localStorage.getItem('userId')));
    setLikesCount(list.likes.length);
    setComments(list.comments || []);
  }, [list]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/lists/${list._id}/like`);
      setLikesCount(response.data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/api/lists/${list._id}/comments`, {
        text: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await axios.delete(`/api/lists/${list._id}`);
        onDelete(list._id);
        toast.success('List deleted successfully');
      } catch (error) {
        console.error('Error deleting list:', error);
        toast.error('Failed to delete list');
      }
    }
  };

  return (
    <div className="bg-[#2C382E]/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">{list.title}</h2>
          <p className="text-[#8BA888] text-sm">
            by{' '}
            <span
              className="hover:text-white cursor-pointer"
              onClick={() => navigate(`/profile/${list.creator.username}`)}
            >
              {list.creator.username}
            </span>
          </p>
        </div>
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-[#8BA888] hover:text-white"
            >
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2C382E] rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/lists/${list._id}/edit`);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-[#8BA888] hover:bg-[#8BA888]/10"
                >
                  <Edit size={16} className="mr-2" />
                  Edit List
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#8BA888]/10"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete List
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {list.description && (
        <p className="text-[#8BA888] mb-6">{list.description}</p>
      )}

      {/* Albums */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {list.items.map((item, index) => (
          <div
            key={item.albumId}
            className="bg-[#2C382E]/50 rounded-lg p-3 hover:bg-[#2C382E]/70 transition-colors cursor-pointer"
            onClick={() => navigate(`/album/${item.albumId}`)}
          >
            <div className="relative">
              <img
                src={item.album?.images[0]?.url}
                alt={item.album?.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
            <h3 className="font-medium text-white truncate">{item.album?.name}</h3>
            <p className="text-[#8BA888] text-sm truncate">
              {item.album?.artists[0]?.name}
            </p>
            {item.notes && (
              <p className="text-[#8BA888] text-xs mt-2 italic">{item.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Interactions */}
      <div className="flex items-center space-x-4 border-t border-[#8BA888]/20 pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? 'text-red-400' : 'text-[#8BA888]'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-[#8BA888]"
        >
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-[#8BA888]/20 pt-4">
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-[#2C382E]/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888] placeholder-[#8BA888]/50"
            />
          </form>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <img
                  src={comment.user.profileImage || '/default-avatar.png'}
                  alt={comment.user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-white hover:text-[#8BA888] cursor-pointer"
                      onClick={() => navigate(`/profile/${comment.user.username}`)}
                    >
                      {comment.user.username}
                    </span>
                    <span className="text-[#8BA888] text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#8BA888]">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default List; 