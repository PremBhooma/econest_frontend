import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Customer from './pages/customer/Customer'
import Dashboard from './pages/dashboard/Dashboard'
import Employee from './pages/employee/employees/Employee'
import Rolesandpermission from './pages/employee/rolesandpermissions/Rolesandpermission'
import Setting from './pages/setting/Settings'
import Customerview from './pages/customer/Customerview'
import Addcustomer from './pages/customer/Addcustomer'
import Flats from './pages/flats/Flats'
import Addflatpage from './pages/flats/Addflatpage'
import Singleemployee from './pages/employee/employees/Singleemployee'
import Editcustomer from './pages/customer/Editcustomer'
import Editflatpage from './pages/flats/Editflatpage'
import Viewflatpage from './pages/flats/Viewflatpage'
import Allpaymentspage from './pages/payments/Allpaymentspage'
import Addnewpaymentpage from './pages/payments/Addnewpaymentpage'
import Editpaymentpage from './pages/payments/Editpaymentpage'
import Paymentview from './pages/payments/Paymentview'
import Onboarding from './pages/customer/Onboarding'
import Viewbulkpayments from './pages/payments/Viewbulkpayments'
import Searchpage from './pages/search/Searchpage'
import Lead from './pages/leads/Lead'
import Addlead from './pages/leads/Addlead'
import Viewlead from './pages/leads/Viewlead'
import Editlead from './pages/leads/Editlead'
import Backup from './pages/backup/Backup'

import { useEmployeeDetails } from './components/zustand/useEmployeeDetails'
import Convertleadtocustomer from './pages/leads/Convertleadtocustomer'

const ProtectedRoute = ({ element }) => {
  const isLogged = useEmployeeDetails(state => state?.isLogged);
  return isLogged ? element : <Navigate to="/" replace />;
}

const PublicRoute = ({ element }) => {
  const isLogged = useEmployeeDetails((state) => state?.isLogged);
  return !isLogged ? element : <Navigate to="/dashboard" replace />;
};

function Approuter() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/employees" element={<ProtectedRoute element={<Employee />} />} />
      <Route path="/roles" element={<ProtectedRoute element={<Rolesandpermission />} />} />
      <Route path="/customers" element={<ProtectedRoute element={<Customer />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Setting />} />} />
      <Route path="/customers/addnew" element={<ProtectedRoute element={<Addcustomer />} />} />
      <Route path="/customers/:customer_uuid" element={<ProtectedRoute element={<Customerview />} />} />
      <Route path="/customers/onboarding" element={<ProtectedRoute element={<Onboarding />} />} />
      <Route path="/flats" element={<ProtectedRoute element={<Flats />} />} />
      <Route path="/single-employee-view/:userId" element={<ProtectedRoute element={<Singleemployee />} />} />
      <Route path="/flats/add-flat" element={<ProtectedRoute element={<Addflatpage />} />} />
      <Route path="/flats/edit-flat/:uuid" element={<ProtectedRoute element={<Editflatpage />} />} />
      <Route path="/flats/view-flat/:uuid" element={<ProtectedRoute element={<Viewflatpage />} />} />
      <Route path="/single-employee-view" element={<ProtectedRoute element={<Singleemployee />} />} />
      <Route path="/customers/editcustomer/:single_customer_id" element={<ProtectedRoute element={<Editcustomer />} />} />
      <Route path="/payments" element={<ProtectedRoute element={<Allpaymentspage />} />} />
      <Route path="/payments/addnew" element={<ProtectedRoute element={<Addnewpaymentpage />} />} />
      <Route path="/payments/edit/:payment_uid" element={<ProtectedRoute element={<Editpaymentpage />} />} />
      <Route path="/singlepaymentview/:payment_uid" element={<ProtectedRoute element={<Paymentview />} />} />
      <Route path="/payments/view-bulk-payments" element={<ProtectedRoute element={<Viewbulkpayments />} />} />
      <Route path="/search" element={<ProtectedRoute element={<Searchpage />} />} />

      <Route path="/leads" element={<ProtectedRoute element={<Lead />} />} />
      <Route path="/lead/add-lead" element={<ProtectedRoute element={<Addlead />} />} />
      <Route path="/lead/edit-lead/:single_lead_id" element={<ProtectedRoute element={<Editlead />} />} />
      <Route path="/lead/:lead_uuid" element={<ProtectedRoute element={<Viewlead />} />} />
      <Route path="/lead/convert-lead-to-customer/:lead_uuid" element={<ProtectedRoute element={<Convertleadtocustomer />} />} />

      {/* <Route path="/backup" element={<Backup />} /> */}
    </Routes>
  )
}

export default Approuter