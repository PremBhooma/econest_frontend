import Flatswrapper from '../../components/flats/Flatswrapper.jsx'
import Sidebarwrapper from '../../components/sidebar/Sidebarwrapper.jsx'
import Navbar from '../../components/header/Navbar.jsx'
import Footer from '../../components/footer/Footer.jsx'

function Flats() {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Fixed Header */}
                <div className="fixed top-0 w-full z-50">
                    <Navbar />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 mt-[64px] mb-[60px] p-4 overflow-y-auto">
                    <Flatswrapper />
                </main>

                {/* Fixed Footer */}
                <div className=" w-full z-50">
                    <Footer />
                </div>
            </div>

        </>
    )
}

export default Flats