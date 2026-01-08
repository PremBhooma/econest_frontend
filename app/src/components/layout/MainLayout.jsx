import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex bg-neutral-50 h-screen w-full overflow-hidden">
            {/* Sidebar - Persistent on Desktop, Toggable on Mobile */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full w-full min-w-0 relative">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
