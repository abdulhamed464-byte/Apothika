import { useEffect, useState } from "react";

import {
  Package,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Users,
  Activity,
  FileText,
  CheckCircle
} from "lucide-react";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


import { DashboardService } from "../services/dashboard/DashboardService";
import { WorkspaceService } from "../services/workspace/WorkspaceService";



function Dashboard(){


const [loading,setLoading] =
useState(true);



const [stats,setStats] =
useState<any>({

totalProducts:0,
todaySales:0,
inventoryValue:0,
lowStock:0,
customers:0,
inventory:[],
recentSales:[],
salesChart:[]

});





useEffect(()=>{

loadDashboard();

},[]);





async function loadDashboard(){


try{


const workspace =
await WorkspaceService.getUserWorkspace();



if(!workspace)
return;



const data =
await DashboardService.getDashboardStats(
workspace.workspace_id
);



console.log(
"DASHBOARD DATA:",
data
);



setStats(data);



}
catch(error){

console.error(
"Dashboard Error:",
error
);

}
finally{

setLoading(false);

}


}








const cards=[


{
title:"Total Products",
value:stats.totalProducts,
icon:Package,
color:"green"
},


{
title:"Today's Sales",
value:`₹${stats.todaySales}`,
icon:IndianRupee,
color:"blue"
},


{
title:"Inventory Value",
value:`₹${stats.inventoryValue}`,
icon:TrendingUp,
color:"green"
},


{
title:"Low Stock",
value:stats.lowStock,
icon:AlertTriangle,
color:"red"
}


];









return (

<div className="dashboard-page">





<div className="dashboard-hero">


<div>

<h1>
Welcome to APOTHIKA
</h1>


<p>
One platform. Multiple domains. Infinite possibilities.
</p>


</div>


<Activity
size={55}
className="hero-icon"
/>


</div>







<div className="kpi-grid">


{

cards.map(card=>{


const Icon=card.icon;


return(

<div
key={card.title}
className={`kpi-card ${card.color}`}
>


<Icon size={32}/>


<div>


<h3>

{
loading
?
"..."
:
card.value
}

</h3>


<p>
{card.title}
</p>


</div>


</div>


);


})


}


</div>









<div className="dashboard-grid">





<div className="glass-panel">


<h2>
Sales Analytics
</h2>


<div
style={{
height:"300px"
}}
>


<ResponsiveContainer
width="100%"
height="100%"
>


<LineChart
data={stats.salesChart}
>


<CartesianGrid
strokeDasharray="3 3"
stroke="#334155"
/>


<XAxis
dataKey="date"
stroke="white"
/>


<YAxis
stroke="white"
/>


<Tooltip />


<Line

type="monotone"

dataKey="amount"

stroke="#22c55e"

strokeWidth={3}

/>


</LineChart>


</ResponsiveContainer>


</div>


</div>









<div className="glass-panel">


<h2>
Quick Actions
</h2>


<button>
<ShoppingCart size={20}/>
Create Sale
</button>


<button>
<Package size={20}/>
Add Product
</button>


<button>
<Users size={20}/>
Customers ({stats.customers})
</button>


</div>



</div>









<div className="glass-panel modules-panel">


<h2>
Inventory Overview
</h2>




{

stats.inventory.length === 0

?

<p>
No inventory found
</p>


:

stats.inventory.map((item:any)=>(


<div
key={item.id}
className="sale-row"
>


<Package size={22}/>


<div>


<strong>
{item.product_name}
</strong>


<p>
Stock: {item.stock} units
</p>


<p>
Value: ₹{item.value}
</p>


</div>



<div>


{
item.stock > item.minimum_stock

?

<CheckCircle
color="lime"
/>

:

<AlertTriangle
color="red"
/>

}



</div>


</div>


))


}



</div>









<div className="glass-panel modules-panel">


<h2>
Recent Sales
</h2>



{

stats.recentSales.map((sale:any)=>(


<div
key={sale.id}
className="sale-row"
>


<FileText size={20}/>


<div>


<strong>
{sale.invoice_number}
</strong>


<p>
₹{sale.total_amount} • {sale.payment_status}
</p>


</div>


</div>


))


}



</div>







</div>

);


}



export default Dashboard;