import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  Package,
  FileText,
  Clock,
  Receipt,
  ShoppingCart,
  Users,
  Truck,
  Factory,
  Settings,
  LogOut,
  UserCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import "../../styles/sidebar.css";


interface SidebarProps {

  modules?: {

    id:string;

    name:string;

    code:string;

  }[];

  open:boolean;

  setOpen:(value:boolean)=>void;

}





function Sidebar({

  modules = [],

  open,

  setOpen

}:SidebarProps) {



console.log(
  "SIDEBAR MODULES:",
  modules
);




const menuItems = [


{
name:"Dashboard",
path:"/dashboard",
icon:LayoutDashboard
},


{
name:"Analytics",
path:"/dashboard/analytics",
icon:BarChart3
},


{
name:"Inventory",
path:"/dashboard/inventory",
icon:Package
},


{
name:"Prescription",
path:"/dashboard/prescription",
icon:FileText
},


{
name:"Batch Tracking",
path:"/dashboard/batch-tracking",
icon:Clock
},


{
name:"Expiry Tracking",
path:"/dashboard/expiry-tracking",
icon:Clock
},


{
name:"Billing",
path:"/dashboard/billing",
icon:Receipt
},


{
name:"Purchase",
path:"/dashboard/purchases",
icon:ShoppingCart
},


{
name:"Customer Management",
path:"/dashboard/customers",
icon:Users
},


{
name:"Vendor Management",
path:"/dashboard/vendors",
icon:Truck
},


{
name:"Manufacturing",
path:"/dashboard/manufacturing",
icon:Factory
},


{
name:"Settings",
path:"/dashboard/settings",
icon:Settings
}


];






return (

<aside

className={
open
?
"sidebar"
:
"sidebar collapsed"
}

>



<button

className="sidebar-toggle"

onClick={()=>setOpen(!open)}

>

{

open

?

<ChevronLeft size={20}/>

:

<ChevronRight size={20}/>

}

</button>





<div className="sidebar-logo">


<h2>

{

open

?

"APOTHIKA"

:

"A"

}

</h2>


{

open &&

<span>

ERP PLATFORM

</span>

}


</div>







<div className="sidebar-section">


{

menuItems.map(item=>{


const Icon=item.icon;



return (

<NavLink

key={item.name}

to={item.path}

className={({isActive})=>

isActive

?

"sidebar-link active"

:

"sidebar-link"

}

>


<Icon size={20}/>


{

open &&

<span>

{item.name}

</span>

}


</NavLink>


);


})


}



</div>







<div className="sidebar-bottom">



<div className="sidebar-link">


<UserCircle size={20}/>


{

open &&

<span>

Profile

</span>

}


</div>





<div className="sidebar-link logout">


<LogOut size={20}/>


{

open &&

<span>

Logout

</span>

}


</div>




</div>





</aside>


);


}



export default Sidebar;