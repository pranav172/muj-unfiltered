// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Shield, Users, MessageSquare, TrendingUp, Trash2, Database, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    avgPostsPerUser: '0',
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(usersData);

      // Fetch all posts
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData: any[] = postsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(postsData);

      // Get top posts (most liked)
      const topPostsQuery = query(
        collection(db, 'posts'),
        orderBy('likes', 'desc'),
        limit(5)
      );
      const topPostsSnapshot = await getDocs(topPostsQuery);
      setTopPosts(topPostsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      // Calculate stats
      const totalLikes = postsData.reduce((sum, post) => sum + (post.likes || 0), 0);
      const totalComments = postsData.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
      
      setStats({
        totalUsers: usersData.length,
        totalPosts: postsData.length,
        totalLikes,
        totalComments,
        avgPostsPerUser: usersData.length > 0 ? (postsData.length / usersData.length).toFixed(1) : '0',
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Delete user ${email}? This will NOT delete their posts.`)) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      alert('User deleted successfully!');
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleClearAllPosts = async () => {
    if (!confirm('⚠️ DELETE ALL POSTS? This cannot be undone!')) return;
    if (!confirm('Are you ABSOLUTELY sure? Type YES in the next prompt')) return;
    
    const confirmation = prompt('Type YES to confirm deletion of ALL posts:');
    if (confirmation !== 'YES') {
      alert('Cancelled');
      return;
    }

    try {
      const batch = posts.map(post => deleteDoc(doc(db, 'posts', post.id)));
      await Promise.all(batch);
      alert(`Deleted ${posts.length} posts!`);
      loadDashboardData();
    } catch (error) {
      console.error('Error clearing posts:', error);
      alert('Failed to clear posts');
    }
  };

  const handleClearOldPosts = async () => {
    if (!confirm('Delete posts older than 7 days with <10 likes?')) return;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      let deletedCount = 0;
      const deletePromises = posts
        .filter(post => {
          const postDate = post.createdAt?.toDate?.() || new Date(0);
          return postDate < sevenDaysAgo && (post.likes || 0) < 10;
        })
        .map(async post => {
          await deleteDoc(doc(db, 'posts', post.id));
          deletedCount++;
        });

      await Promise.all(deletePromises);
      alert(`Deleted ${deletedCount} old posts!`);
      loadDashboardData();
    } catch (error) {
      console.error('Error clearing old posts:', error);
      alert('Failed to clear old posts');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">manage users, posts, and view analytics 📊</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={stats.totalUsers}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Total Posts"
            value={stats.totalPosts}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Likes"
            value={stats.totalLikes}
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Total Comments"
            value={stats.totalComments}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Key Insights
            </h3>
            <div className="space-y-3">
              <Insight label="Avg posts per user" value={stats.avgPostsPerUser} />
              <Insight label="Engagement rate" value={`${((stats.totalLikes + stats.totalComments) / stats.totalPosts * 100 || 0).toFixed(1)}%`} />
              <Insight label="Avg likes per post" value={(stats.totalLikes / stats.totalPosts || 0).toFixed(1)} />
              <Insight label="Avg comments per post" value={(stats.totalComments / stats.totalPosts || 0).toFixed(1)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Top 5 Posts
            </h3>
            <div className="space-y-2">
              {topPosts.map((post, i) => (
                <div key={post.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium text-gray-900">#{i + 1}</p>
                    <p className="text-xs text-gray-600 truncate">{post.text}</p>
                  </div>
                  <span className="text-sm font-semibold text-pink-600">{post.likes || 0} ❤️</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Database Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Database Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleClearOldPosts}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Clean Old Posts (7d, &lt;10 likes)
            </button>
            <button
              onClick={handleClearAllPosts}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <AlertTriangle size={18} />
              Delete ALL Posts
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Registered Users ({users.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Verified</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.verified ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
}

function Insight({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
