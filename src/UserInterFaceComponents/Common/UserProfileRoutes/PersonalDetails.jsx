import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
    User,
    MapPin,
    Edit3,
    Phone,
    Calendar,
    MapPin as LocationIcon,
    Home,
    Mail,
    ShoppingBag,
} from "lucide-react";

function PersonalDetails() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        country: "",
        bio: "",
        birth_date: "",
        gender: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/profile",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );

            if (response.data.profile) {
                setProfile(response.data.profile);
                setFormData((prev) => ({
                    ...prev,
                    ...response.data.profile,
                    birth_date:
                        response.data.profile.birth_date?.split("T")[0] || "",
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            if (error.response?.status === 401) {
                navigate("/");
            } else {
                toast.error("Failed to load profile data");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:8000/api/profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            setProfile(response.data.profile);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNavigateToPreviousPage = () => {
        navigate(-1);
    };

    if (isLoading && !profile) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Profile
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your personal information
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleNavigateToPreviousPage}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ShoppingBag size={16} />
                        Go to Previous Page
                    </button>
                    <button
                        onClick={
                            isEditing
                                ? handleSaveProfile
                                : () => setIsEditing(true)
                        }
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        <Edit3 size={16} />
                        {isLoading
                            ? "Saving..."
                            : isEditing
                              ? "Save Changes"
                              : "Edit Profile"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {user?.name || "User Name"}
                        </h3>

                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-4">
                            <Mail size={14} />
                            <span>{user?.email || "user@example.com"}</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            <span>{profile?.city || "Add location"}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <User size={20} />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter phone number"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-900 p-2">
                                            <Phone
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm">
                                                {profile?.phone ||
                                                    "Not provided"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Birth Date
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={formData.birth_date}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-900 p-2">
                                            <Calendar
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm">
                                                {profile?.birth_date ||
                                                    "Not provided"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                                Female
                                            </option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <div className="text-gray-900 p-2 text-sm">
                                            {profile?.gender || "Not specified"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter your complete address"
                                    />
                                ) : (
                                    <div className="flex items-start gap-2 text-gray-900 p-2">
                                        <Home
                                            size={16}
                                            className="text-gray-400 mt-0.5 flex-shrink-0"
                                        />
                                        <span className="text-sm">
                                            {profile?.address ||
                                                "No address provided"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter city"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-900 p-2">
                                            <LocationIcon
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm">
                                                {profile?.city ||
                                                    "Not provided"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter postal code"
                                        />
                                    ) : (
                                        <div className="text-gray-900 p-2 text-sm">
                                            {profile?.postal_code ||
                                                "Not provided"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter country"
                                        />
                                    ) : (
                                        <div className="text-gray-900 p-2 text-sm">
                                            {profile?.country || "Not provided"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-900 p-2 text-sm">
                                        {profile?.bio || "No bio provided"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalDetails;
