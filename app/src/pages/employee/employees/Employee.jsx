import React from 'react'
import Sidebarwrapper from '../../../components/sidebar/Sidebarwrapper.jsx'
import Employeewrapper from '../../../components/employee/employees/Employeewrapper.jsx'
import Navbar from '../../../components/header/Navbar.jsx'
import Footer from '../../../components/footer/Footer.jsx'

function Employee() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="fixed top-0 w-full z-50">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 mt-[64px] mb-[60px] p-4 overflow-y-auto">
          <Employeewrapper />
        </main>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 w-full z-50">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Employee
