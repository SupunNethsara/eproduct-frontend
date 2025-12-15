import Sidebar from "../Dashboards/AdminComponents/Sidebar.jsx";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64">
                <div className="pt-16 mt-8 ">
                    <div className="pl-5">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
