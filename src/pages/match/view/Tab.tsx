import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["Overview", "Settings"];

const TabContent = ({ index }: { index: number }) => {
    return (
        <div className="flex items-center justify-center h-64 text-xl text-gray-700">
            {index === 0 ? "Welcome to the Overview Tab" : "Settings go here"}
        </div>
    );
};

const TwoTabApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) =>
        Math.abs(offset) * velocity;

    const handleSwipe = (offsetX: number, velocityX: number) => {
        const swipe = swipePower(offsetX, velocityX);
        if (swipe < -swipeConfidenceThreshold && activeTab < tabs.length - 1) {
            setActiveTab((prev) => prev + 1);
        } else if (swipe > swipeConfidenceThreshold && activeTab > 0) {
            setActiveTab((prev) => prev - 1);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-2xl">
            {/* Tab Headers */}
            <div className="flex mb-4 bg-gray-100 rounded-xl p-1">
                {tabs.map((label, idx) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === idx
                            ? "bg-white shadow text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Swipeable Content */}
            <div className="relative h-64 overflow-hidden rounded-xl">
                <AnimatePresence initial={false} custom={activeTab}>
                    <motion.div
                        key={activeTab}
                        className="absolute top-0 left-0 w-full h-full"
                        custom={activeTab}
                        initial={{ x: activeTab === 1 ? "100%" : "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: activeTab === 1 ? "-100%" : "100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0} // Removes the bounce
                        onDragEnd={(_: any, { offset, velocity }) =>
                            handleSwipe(offset.x, velocity.x)
                        }
                    >
                        <TabContent index={activeTab} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TwoTabApp;
