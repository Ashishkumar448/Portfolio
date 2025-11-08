'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api';

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  blogId: string;
  blogTitle?: string;
  approved: boolean;
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await adminApi.getComments();
        setComments(response.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveComment(id);
      setComments(comments.map(c => 
        c._id === id ? { ...c, approved: true } : c
      ));
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await adminApi.deleteComment(id);
        setComments(comments.filter(c => c._id !== id));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Comments</h1>
        <p className="text-slate-400">Manage blog comments and moderation</p>
      </div>

      <div className="bg-gray-700 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Blog
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td className="px-6 py-4">
                  <div className="text-sm text-white max-w-xs">
                    {comment.content.length > 100 
                      ? `${comment.content.substring(0, 100)}...` 
                      : comment.content
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {comment.author.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {comment.author.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-400">
                    {comment.blogTitle || comment.blogId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    comment.approved 
                      ? 'bg-green-600 text-green-100' 
                      : 'bg-yellow-600 text-yellow-100'
                  }`}>
                    {comment.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!comment.approved && (
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="text-green-400 hover:text-green-300 mr-4"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {comments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No comments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}