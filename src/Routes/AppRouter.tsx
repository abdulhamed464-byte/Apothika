import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Purchases from "../pages/Purchases";

import DashboardLayout from "../layouts/dashboard/DashboardLayout";


function AppRouter() {

  return (

    <BrowserRouter>

      <Routes>


        <Route 
          path="/" 
          element={<Login />} 
        />


        <Route 
          path="/register" 
          element={<Register />} 
        />



        <Route 
          path="/dashboard" 
          element={<DashboardLayout />}
        >


          <Route 
            index 
            element={<Dashboard />} 
          />



          <Route 
            path="inventory" 
            element={<Inventory />} 
          />



          <Route 
            path="purchases" 
            element={<Purchases />} 
          />


        </Route>



      </Routes>

    </BrowserRouter>

  );

}


export default AppRouter;