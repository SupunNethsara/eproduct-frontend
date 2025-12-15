import { Route, Routes } from "react-router-dom";
import HomeSection from "../HomeComponent/HomeSection.jsx";
import ProductShop from "../Shop/ProductShop.jsx";
import CartSection from "../Products/Cart/CartSection.jsx";
import Contact from "../Contact/Contact.jsx";
import About from "../About/About.jsx";
import Quotation from "../Quotations/Quotation.jsx";

function UserInterFace() {
    return (
        <div className="h-auto bg-gray-50 pt-30 pb-12">
            <Routes>
                <Route path="/" element={<HomeSection />} />
                <Route path="/home" element={<HomeSection />} />
                <Route path="/shop" element={<ProductShop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/quotations" element={<Quotation />} />

                <Route path="/cart" element={<CartSection />} />
            </Routes>
        </div>
    );
}

export default UserInterFace;
