import React from 'react'
// import Editcustomerwrapper from '../../components/customer/Editcustomerwrapper.jsx'
import Navbar from '../../components/header/Navbar.jsx'
import Footer from '../../components/footer/Footer.jsx'
import Editleadwrapper from '../../components/leads/Editleadwrapper.jsx'

function Editlead() {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="fixed top-0 w-full z-50">
                    <Navbar />
                </div>

                <main className="flex-1 mt-[64px] mb-[60px] p-4 overflow-y-auto">
                    <Editleadwrapper />
                </main>

                <div className=" w-full z-50">
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Editlead