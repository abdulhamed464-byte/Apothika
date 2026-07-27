function LogisticsSection(){


const operations=[

{
icon:"🏭",
title:"Manufacturing Control",
desc:"Manage production planning, raw materials, workflows and finished goods."
},


{
icon:"📦",
title:"Warehouse Intelligence",
desc:"Control stock movement, locations, transfers and inventory accuracy."
},


{
icon:"🚚",
title:"Logistics Management",
desc:"Track deliveries, routes, vehicles and transportation performance."
},


{
icon:"🛒",
title:"Procurement",
desc:"Manage suppliers, purchase orders and purchasing workflows."
},


{
icon:"🔗",
title:"Supply Chain",
desc:"Connect suppliers, inventory and customers in one ecosystem."
},


{
icon:"🏢",
title:"Enterprise Operations",
desc:"Operate multiple branches, locations and business units."
}

];



return(

<section className="operations-section">


<div className="operations-header">


<div className="operations-badge">

🌐 Business Operations Ecosystem

</div>



<h2>

Everything Connected.

<br/>

<span className="gradient-text">

One Intelligent Platform.

</span>

</h2>



<p>

From manufacturing to delivery,
APOTHIKA connects every operational process
into one unified ERP ecosystem.

</p>


</div>





<div className="operations-grid">


{

operations.map((item)=>(


<div

className="operation-card"

key={item.title}

>


<div className="operation-icon">

{item.icon}

</div>



<h3>

{item.title}

</h3>



<p>

{item.desc}

</p>


</div>


))

}


</div>



</section>

);


}


export default LogisticsSection;