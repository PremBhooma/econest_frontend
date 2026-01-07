import React from 'react'
import Navbar from '../../components/header/Navbar.jsx'
import Footer from '../../components/footer/Footer.jsx'
import Addnewlead from '../../components/leads/Addnewlead.jsx'


function Addlead() {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="fixed top-0 w-full z-50">
                    <Navbar />
                </div>

                <main className="flex-1 mt-[60px] ] py-4 overflow-y-auto">
                    <Addnewlead />
                </main>

                <div className=" w-full z-50">
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Addlead