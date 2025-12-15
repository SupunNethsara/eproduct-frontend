import Navbar from "../UserInterFaceComponents/Common/Navbar.jsx";
import Footer from "../UserInterFaceComponents/Common/Footer.jsx";

const NormalLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default NormalLayout;
