import React from "react";
import SliderSection from "./SliderSection.jsx";
import TopProduct from "./TopProduct.jsx";
import CategoriesMarquee from "./CategoriesMarquee.jsx";
import Products from "./Products.jsx";
import FeaturedCategories from "./FeaturedCategories.jsx";
import WhyChooseUs from "./WhyChooseUs.jsx";
import Testimonials from "./Testimonials.jsx";

function HomeSection() {
    return (
        <div>
            <div className="max-w-10/12 mx-auto flex flex-col lg:flex-row gap-6 px-0">
                <div className="w-full lg:w-4/6 ]">
                    <SliderSection />
                </div>
                <TopProduct />
            </div>

            <CategoriesMarquee />

            <Products />

            <FeaturedCategories />
            <WhyChooseUs />
            <Testimonials />
        </div>
    );
}

export default HomeSection;
