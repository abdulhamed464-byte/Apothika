import { useState } from "react";


function LogisticsSection(){

const domains=[


{
name:"Pharmacy ERP",
description:
"Complete pharmacy management with inventory, expiry tracking and intelligent purchasing.",
features:[
"Batch Management",
"Expiry Alerts",
"Prescription Management"
]
},



{
name:"Retail ERP",
description:
"Manage stores, billing, customers and daily operations.",
features:[
"POS Billing",
"Customer Management",
"Sales Analytics"
]
},



{
name:"Supermarket ERP",
description:
"Control large inventory and high volume sales.",
features:[
"Barcode System",
"Stock Control",
"Supplier Management"
]
},



{
name:"Restaurant ERP",
description:
"Manage kitchen, orders and restaurant operations.",
features:[
"Order Management",
"Kitchen Control",
"Inventory"
]
},



{
name:"Warehouse ERP",
description:
"Complete warehouse visibility and stock movement.",
features:[
"Stock Tracking",
"Transfers",
"Reports"
]
},



{
name:"Manufacturing ERP",
description:
"Production planning and raw material management.",
features:[
"Production",
"Material Planning",
"Cost Control"
]
},



{
name:"Hospital ERP",
description:
"Healthcare operations management platform.",
features:[
"Patient Management",
"Inventory",
"Billing"
]
},



{
name:"Electronics ERP",
description:
"Manage products, warranty and service.",
features:[
"Serial Tracking",
"Service Management",
"Inventory"
]
},



{
name:"Construction ERP",
description:
"Manage projects, materials and workforce.",
features:[
"Project Tracking",
"Material Control",
"Cost Analysis"
]
},



{
name:"Logistics ERP",
description:
"Complete transportation management system.",
features:[
"Fleet Tracking",
"Fuel Management",
"Route Optimization"
]
}


];


const [active,setActive]=useState(0);



return (

<section className="domain-section">


<h2>

One ERP.
Every Industry.

</h2>



<div className="domain-slider">


<button
className="slide-btn"
onClick={()=>setActive(
active===0
?
domains.length-1
:
active-1
)}
>
←
</button>



<div className="domain-card">


<h3>

{domains[active].name}

</h3>


<p>

{domains[active].description}

</p>



<div className="grid">


{
domains[active].features.map(item=>(

<div
className="glass-box"
key={item}
>

{item}

</div>

))
}


</div>


</div>



<button
className="slide-btn"
onClick={()=>setActive(
(active+1)
%
domains.length
)}
>

→

</button>



</div>



</section>

);

}


export default LogisticsSection;