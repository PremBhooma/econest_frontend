import React from 'react'
import Footer from '../../../components/footer/Footer.jsx'
import Sidebarwrapper from '../../../components/sidebar/Sidebarwrapper.jsx'
import Navbar from '../../../components/header/Navbar.jsx'
import SingleEmployeeview from '../../../components/employee/employees/SingleEmployeeview.jsx'

function Singleemployee() {
    return (
        <>


            <div className="flex flex-col min-h-screen">
                {/* Fixed Header */}
                <div className="fixed top-0 w-full z-50">
                    <Navbar />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 mt-[64px] mb-[60px] p-4 overflow-y-auto">
                    <SingleEmployeeview />
                </main>

                {/* Fixed Footer */}
                <div className=" w-full z-50">
                    <Footer />
                </div>
            </div>

        </>
    )
}

export default Singleemployee