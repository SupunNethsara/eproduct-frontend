import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    User,
    Mail,
    Calendar,
    MapPin,
    Phone,
    UserCheck,
    UserX,
    Shield,
    Users,
    Activity,
    X,
    ChevronDown,
    Download
} from 'lucide-react';

function UserManage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [actionMenu, setActionMenu] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/superadmin/all-users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const usersWithProperData = (response.data.users || []).map(user => ({
                    ...user,
                    is_active: user.is_active !== undefined ? user.is_active : true,
                    profile: user.profile || null
                }));

                setUsers(usersWithProperData);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && user.is_active) ||
            (statusFilter === 'inactive' && !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'oldest':
                return new Date(a.created_at) - new Date(b.created_at);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const toggleUserStatus = async (userId, currentStatus) => {
        setUpdatingStatus(userId);
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/admin/deactivate-user/${userId}`
            );

            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, is_active: !currentStatus }
                    : user
            ));

            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, is_active: !currentStatus });
            }

        } catch (err) {
            console.error('Error updating user status:', err);
            setError(err.response?.data?.message || 'Failed to update user status');
        } finally {
            setUpdatingStatus(null);
            setActionMenu(null);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'super_admin':
                return 'bg-red-500/10 text-red-600 border-red-200';
            case 'admin':
                return 'bg-purple-500/10 text-purple-600 border-purple-200';
            case 'User':
                return 'bg-blue-500/10 text-blue-600 border-blue-200';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-200';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'super_admin':
            case 'admin':
                return <Shield size={14} />;
            default:
                return <User size={14} />;
        }
    };

    const getStatusInfo = (isActive) => {
        return {
            color: isActive ? 'bg-green-500/10 text-green-600 border-green-200' : 'bg-red-500/10 text-red-600 border-red-200',
            text: isActive ? 'Active' : 'Inactive',
            icon: isActive ? <UserCheck size={14} /> : <UserX size={14} />
        };
    };

    const stats = [
        {
            label: 'Total Users',
            value: users.length,
            icon: Users,
            color: 'blue',
            change: '+12%'
        },
        {
            label: 'Active Users',
            value: users.filter(user => user.is_active).length,
            icon: UserCheck,
            color: 'green',
            change: '+5%'
        },
        {
            label: 'Inactive Users',
            value: users.filter(user => !user.is_active).length,
            icon: UserX,
            color: 'red',
            change: '-2%'
        },
        {
            label: 'Administrators',
            value: users.filter(user => user.role === 'admin' || user.role === 'super_admin').length,
            icon: Shield,
            color: 'purple',
            change: '+3%'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
            green: 'bg-green-500/10 text-green-600 border-green-200',
            red: 'bg-red-500/10 text-red-600 border-red-200',
            purple: 'bg-purple-500/10 text-purple-600 border-purple-200'
        };
        return colors[color] || colors.blue;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                        <UserX className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Error loading users</h3>
                    <p className="text-gray-600 text-center text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">Manage and monitor all system users</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className={`text-xs mt-1 ${
                                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change} from last month
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full lg:max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="User">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => {
                            const statusInfo = getStatusInfo(user.is_active);
                            return (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">
                                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role.replace('_', ' ')}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                                {statusInfo.icon}
                                                {statusInfo.text}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUserClick(user)}
                                                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {actionMenu === user.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                        <button
                                                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                            disabled={updatingStatus === user.id}
                                                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                                                user.is_active
                                                                    ? 'text-red-600 hover:bg-red-50'
                                                                    : 'text-green-600 hover:bg-green-50'
                                                            } transition-colors`}
                                                        >
                                                            {updatingStatus === user.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                            ) : user.is_active ? (
                                                                <UserX size={16} />
                                                            ) : (
                                                                <UserCheck size={16} />
                                                            )}
                                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-lg">
                                        {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Mail size={16} />
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getRoleColor(selectedUser.role)}`}>
                                            {getRoleIcon(selectedUser.role)}
                                            {selectedUser.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusInfo(selectedUser.is_active).color}`}>
                                            {getStatusInfo(selectedUser.is_active).icon}
                                            {getStatusInfo(selectedUser.is_active).text}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                                        <p className="flex items-center gap-2 text-gray-900">
                                            <Calendar size={16} />
                                            {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedUser.profile && (
                                <div className="border-t pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedUser.profile.phone && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone size={18} className="text-gray-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-medium">{selectedUser.profile.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedUser.profile.gender && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <User size={18} className="text-gray-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Gender</p>
                                                    <p className="font-medium">{selectedUser.profile.gender}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedUser.profile.address && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                                                <MapPin size={18} className="text-gray-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Address</p>
                                                    <p className="font-medium">{selectedUser.profile.address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => toggleUserStatus(selectedUser.id, selectedUser.is_active)}
                                    disabled={updatingStatus === selectedUser.id}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                        selectedUser.is_active
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    {updatingStatus === selectedUser.id ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Updating...
                                        </div>
                                    ) : (
                                        selectedUser.is_active ? 'Deactivate User' : 'Activate User'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManage;
