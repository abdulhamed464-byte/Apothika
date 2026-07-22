import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import "../../styles/dashboard.css";


function DashboardLayout() {


  const [sidebarOpen, setSidebarOpen] = useState(true);


  const [modules, setModules] = useState<any[]>([]);



  useEffect(() => {


    /*
      Temporary module data restoration.

      Later this will come from:
      workspace_modules
      +
      modules table

      through Supabase.
    */


    setModules([

      {
        id:"1",
        name:"Inventory",
        code:"inventory"
      },

      {
        id:"2",
        name:"Billing",
        code:"billing"
      },

      {
        id:"3",
        name:"Purchase",
        code:"purchase"
      },

      {
        id:"4",
        name:"Customer Management",
        code:"customers"
      },

      {
        id:"5",
        name:"Vendor Management",
        code:"vendors"
      },

      {
        id:"6",
        name:"Prescription",
        code:"prescription"
      },

      {
        id:"7",
        name:"Batch Tracking",
        code:"batch"
      },

      {
        id:"8",
        name:"Expiry Tracking",
        code:"expiry"
      }

    ]);


  },[]);





  return (


    <div className="dashboard-layout">


      <Sidebar

        modules={modules}

        open={sidebarOpen}

        setOpen={setSidebarOpen}

      />



      <main

        className={

          sidebarOpen

          ?

          "dashboard-content"

          :

          "dashboard-content expanded"

        }

      >


        <Outlet />


      </main>


    </div>


  );


}



export default DashboardLayout;