function Industries(){


const industries=[

{
name:"Pharmacy",
icon:"💊",
desc:"Medicine inventory, expiry tracking and automated stock control."
},

{
name:"Retail",
icon:"🛒",
desc:"Sales, billing and customer management for retail businesses."
},

{
name:"Supermarket",
icon:"🏪",
desc:"High volume inventory and multi-location operations."
},

{
name:"Restaurant",
icon:"🍽️",
desc:"Ingredient tracking, purchasing and operational control."
},

{
name:"Warehouse",
icon:"📦",
desc:"Warehouse movement, locations and stock optimisation."
},

{
name:"Manufacturing",
icon:"🏭",
desc:"Production planning, materials and workflow management."
},

{
name:"Hospital",
icon:"🏥",
desc:"Healthcare inventory and resource management."
},

{
name:"Electronics",
icon:"💻",
desc:"Product lifecycle, serial tracking and sales control."
},

{
name:"Construction",
icon:"🏗️",
desc:"Project materials, suppliers and cost management."
},

{
name:"Logistics",
icon:"🚚",
desc:"Fleet, delivery and transportation intelligence."
}

];



return (

<section className="section industries-section">


<h2>

One ERP. Every Industry.

</h2>



<p className="section-subtitle">

A unified business operating system built for multiple industries.

</p>




<div className="industry-grid">


{

industries.map((item)=>(


<div

className="industry-card"

key={item.name}

>


<div className="industry-icon">

{item.icon}

</div>



<h3>

{item.name}

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


export default Industries;