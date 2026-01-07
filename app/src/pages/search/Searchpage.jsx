import React, { useState } from 'react'
import Footer from '../../components/footer/Footer.jsx'
import Searchresults from '../../components/search/Searchresults.jsx'
import { set } from 'date-fns'
import Customernavbar from '../../components/header/Customernavbar.jsx'
import Navbar from '../../components/header/Navbar.jsx'

function Searchpage() {

    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Fixed Header */}
                <div className="fixed top-0 w-full z-50">
                    <Navbar/>
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 mt-[64px] mb-[60px] p-4 overflow-y-auto">
                    <Searchresults />
                </main>

                {/* Fixed Footer */}
                <div className=" w-full z-50">
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Searchpage