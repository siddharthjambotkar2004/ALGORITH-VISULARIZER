import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Activity, Code, ArrowLeft, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

interface Algorithm {
  id: string;
  name: string;
  identifier: string;
  category: 'SORTING' | 'GRAPH';
  description: string;
  pseudocode: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  _count: {
    history: number;
  };
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'algorithms' | 'users'>('algorithms');
  
  // Algorithms state
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAlgorithm, setEditingAlgorithm] = useState<Algorithm | null>(null);
  const [algorithmForm, setAlgorithmForm] = useState<{
    name: string;
    identifier: string;
    category: 'SORTING' | 'GRAPH';
    description: string;
    pseudocode: string[];
    isActive: boolean;
  }>({
    name: '',
    identifier: '',
    category: 'SORTING',
    description: '',
    pseudocode: ['// Step 1', '// Step 2'],
    isActive: true
  });

  // Users state
  const [users, setUsers] = useState<User[]>([]);

  // Load data
  useEffect(() => {
    if (activeTab === 'algorithms') {
      loadAlgorithms();
    } else {
      loadUsers();
    }
  }, [activeTab]);

  const loadAlgorithms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/algorithms`, {
        credentials: 'include'
      });
      const data = await res.json();
      setAlgorithms(data.algorithms || []);
    } catch (err) {
      console.error('Failed to load algorithms:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        credentials: 'include'
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleAlgorithmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAlgorithm
        ? `${API_BASE_URL}/admin/algorithms/${editingAlgorithm.id}`
        : `${API_BASE_URL}/admin/algorithms`;
      const method = editingAlgorithm ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(algorithmForm)
      });
      
      if (res.ok) {
        setIsAddModalOpen(false);
        setEditingAlgorithm(null);
        setAlgorithmForm({
          name: '',
          identifier: '',
          category: 'SORTING',
          description: '',
          pseudocode: ['// Step 1', '// Step 2'],
          isActive: true
        });
        loadAlgorithms();
      }
    } catch (err) {
      console.error('Failed to save algorithm:', err);
    }
  };

  const handleDeleteAlgorithm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this algorithm?')) return;
    try {
      await fetch(`${API_BASE_URL}/admin/algorithms/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      loadAlgorithms();
    } catch (err) {
      console.error('Failed to delete algorithm:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      loadUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/50 to-background" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Simplified Header */}
        <div className="h-20 border-b border-white/10 bg-white/[0.03] backdrop-blur-3xl flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                <Sparkles size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white leading-none tracking-tight">AlgoVisual</span>
                <span className="text-[10px] text-primary-light font-black uppercase tracking-widest mt-1.5 opacity-80">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Admin Panel
              </h1>
              <p className="text-slate-400">Manage algorithms and users</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-white/10">
              <button
                onClick={() => setActiveTab('algorithms')}
                className={`flex items-center gap-2 px-6 py-3 font-medium rounded-t-lg transition-all ${
                  activeTab === 'algorithms'
                    ? 'bg-primary/20 text-primary border-b-2 border-primary'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Code size={20} />
                Algorithms
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-3 font-medium rounded-t-lg transition-all ${
                  activeTab === 'users'
                    ? 'bg-primary/20 text-primary border-b-2 border-primary'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users size={20} />
                Users
              </button>
            </div>

            {/* Algorithms Tab */}
            {activeTab === 'algorithms' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Manage Algorithms</h2>
                  <button
                    onClick={() => {
                      setEditingAlgorithm(null);
                      setAlgorithmForm({
                        name: '',
                        identifier: '',
                        category: 'SORTING',
                        description: '',
                        pseudocode: ['// Step 1', '// Step 2'],
                        isActive: true
                      });
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-lg shadow-primary/25"
                  >
                    <Plus size={20} />
                    Add Algorithm
                  </button>
                </div>

                <div className="space-y-4">
                  {(algorithms || []).map((algo) => (
                    <div key={algo.id} className="glass-dark rounded-xl p-6 border border-white/10">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{algo.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              algo.category === 'SORTING' 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {algo.category}
                            </span>
                            {!algo.isActive && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{algo.description}</p>
                          <div className="text-xs text-slate-500">
                            ID: {algo.identifier} • Created: {new Date(algo.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingAlgorithm(algo);
                              setAlgorithmForm(algo);
                              setIsAddModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-yellow-400"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteAlgorithm(algo.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
                
                {users.length === 0 ? (
                  <div className="glass-dark rounded-xl p-8 border border-white/10 text-center">
                    <p className="text-slate-400">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="glass-dark rounded-xl p-6 border border-white/10">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'ADMIN' 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-slate-500/20 text-slate-400'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm mb-2">{user.email}</p>
                            <div className="flex items-center gap-6 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Activity size={14} />
                                {user._count.history} runs
                              </span>
                              <span>
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Algorithm Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingAlgorithm ? 'Edit Algorithm' : 'Add New Algorithm'}
            </h2>
            
            <form onSubmit={handleAlgorithmSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={algorithmForm.name}
                  onChange={(e) => setAlgorithmForm({ ...algorithmForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                  placeholder="e.g., Quick Sort"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Identifier</label>
                <input
                  type="text"
                  required
                  value={algorithmForm.identifier}
                  onChange={(e) => setAlgorithmForm({ ...algorithmForm, identifier: e.target.value })}
                  className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                  placeholder="e.g., quick_sort"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={algorithmForm.category}
                  onChange={(e) => setAlgorithmForm({ ...algorithmForm, category: e.target.value as any })}
                  className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
                >
                  <option value="SORTING">Sorting</option>
                  <option value="GRAPH">Graph</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  required
                  value={algorithmForm.description}
                  onChange={(e) => setAlgorithmForm({ ...algorithmForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Algorithm description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Pseudocode</label>
                <div className="space-y-2">
                  {algorithmForm.pseudocode.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => {
                          const newCode = [...algorithmForm.pseudocode];
                          newCode[i] = e.target.value;
                          setAlgorithmForm({ ...algorithmForm, pseudocode: newCode });
                        }}
                        className="flex-1 px-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary font-mono text-sm"
                        placeholder={`// Step ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newCode = algorithmForm.pseudocode.filter((_, idx) => idx !== i);
                          setAlgorithmForm({ ...algorithmForm, pseudocode: newCode });
                        }}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAlgorithmForm({
                      ...algorithmForm,
                      pseudocode: [...algorithmForm.pseudocode, '']
                    })}
                    className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    Add Line
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={algorithmForm.isActive}
                  onChange={(e) => setAlgorithmForm({ ...algorithmForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-white/30 bg-surface text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-slate-300">Active</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingAlgorithm(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-lg shadow-primary/25"
                >
                  {editingAlgorithm ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
