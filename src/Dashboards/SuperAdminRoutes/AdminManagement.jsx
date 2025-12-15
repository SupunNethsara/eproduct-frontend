import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Mail,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    Eye,
    X,
    Save,
    Loader,
    Key
} from 'lucide-react';

function AdminManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
        status: 'active'
    });

    const validRoles = ['admin', 'super_admin'];

    const adminUsers = Array.isArray(admins) ? admins.filter(user =>
        user.role === 'admin' || user.role === 'super_admin'
    ) : [];

    const stats = [
        {
            label: 'Total Admins',
            value: adminUsers.length,
            change: '+2',
            trend: 'up'
        },
        {
            label: 'Active Admins',
            value: adminUsers.filter(a => a.status === 'active').length,
            change: '+1',
            trend: 'up'
        },
        {
            label: 'Pending Approval',
            value: adminUsers.filter(a => a.status === 'pending').length,
            change: '-1',
            trend: 'down'
        },
        {
            label: 'Inactive Admins',
            value: adminUsers.filter(a => a.status === 'inactive').length,
            change: '0',
            trend: 'neutral'
        }
    ];

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            const response = await axios.get('http://127.0.0.1:8000/api/superadmin/admins', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            setAdmins(response.data.admins || response.data || []);
        } catch (err) {
            console.error('Error fetching admins:', err);
            setError(err.response?.data?.message || 'Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            const submitData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                role: formData.role,
                status: formData.status
            };
            const response = await axios.post('http://127.0.0.1:8000/api/superadmin/add-admin', submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setIsAddModalOpen(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: 'admin',
                    status: 'active'
                });
                fetchAdmins();
            }
        } catch (err) {
            console.error('Error adding admin:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.errors?.password?.[0] ||
                err.response?.data?.errors?.role?.[0] ||
                'Failed to add admin';
            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            const submitData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status
            };

            if (formData.password) {
                submitData.password = formData.password;
                submitData.password_confirmation = formData.password_confirmation;
            }

            const response = await axios.put(`http://127.0.0.1:8000/api/superadmin/admins/${selectedAdmin.id}`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setIsEditModalOpen(false);
                setSelectedAdmin(null);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: 'admin',
                    status: 'active'
                });
                fetchAdmins();
            }
        } catch (err) {
            console.error('Error updating admin:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.errors?.password?.[0] ||
                err.response?.data?.errors?.role?.[0] ||
                'Failed to update admin';
            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');

            await axios.delete(`http://127.0.0.1:8000/api/superadmin/admins/${adminId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            fetchAdmins();
        } catch (err) {
            console.error('Error deleting admin:', err);
            setError(err.response?.data?.message || 'Failed to delete admin');
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            password: '',
            password_confirmation: '',
            role: admin.role,
            status: admin.status
        });
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedAdmin(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'admin',
            status: 'active'
        });
        setError('');
    };

    const filteredAdmins = adminUsers.filter(admin => {
        const matchesSearch = searchTerm === '' ||
            (admin.name && admin.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const toggleSelectAdmin = (id) => {
        setSelectedAdmins(prev =>
            prev.includes(id)
                ? prev.filter(adminId => adminId !== id)
                : [...prev, id]
        );
    };

    const selectAllAdmins = () => {
        setSelectedAdmins(selectedAdmins.length === filteredAdmins.length ? [] : filteredAdmins.map(admin => admin.id));
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Eye }
        };
        const config = statusConfig[status] || statusConfig.active;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon size={12} className="mr-1" />
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6 p-5">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading admins...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-5">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <XCircle className="text-red-600 mr-2" size={20} />
                            <p className="text-red-800">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                    <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Add New Admin
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <div className="flex items-baseline mt-2">
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <span className={`ml-2 text-sm font-medium ${
                                stat.trend === 'up' ? 'text-green-600' :
                                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search admins by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>

                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <Filter size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedAdmins.length === filteredAdmins.length && filteredAdmins.length > 0}
                                    onChange={selectAllAdmins}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Admin
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Active
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAdmins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedAdmins.includes(admin.id)}
                                        onChange={() => toggleSelectAdmin(admin.id)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-white font-medium text-sm">
                                                {admin.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                                <Mail size={12} className="mr-1" />
                                                {admin.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Shield size={16} className="text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-900 capitalize">
                                            {admin.role?.replace('_', ' ') || 'admin'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(admin.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar size={14} className="mr-1" />
                                        {admin.lastActive || admin.created_at || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => openEditModal(admin)}
                                            className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            disabled={actionLoading}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredAdmins.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Shield size={48} className="mx-auto" />
                        </div>
                        <p className="text-gray-500 text-lg">No admins found</p>
                        <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                            Showing <span className="font-medium">{filteredAdmins.length}</span> of{' '}
                            <span className="font-medium">{adminUsers.length}</span> admins
                        </p>

                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                Previous
                            </button>
                            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedAdmins.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-green-800 font-medium">
                            {selectedAdmins.length} admin{selectedAdmins.length > 1 ? 's' : ''} selected
                        </p>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                Activate Selected
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                                Deactivate Selected
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                Export Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Admin</h3>
                            <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter password (min 8 characters)"
                                    minLength="8"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Confirm password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {validRoles.map(role => (
                                        <option key={role} value={role}>
                                            {role.replace('_', ' ').toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {actionLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                    {actionLoading ? 'Adding...' : 'Add Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Admin</h3>
                            <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {validRoles.map(role => (
                                        <option key={role} value={role}>
                                            {role.replace('_', ' ').toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {actionLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                    {actionLoading ? 'Updating...' : 'Update Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminManagement;
