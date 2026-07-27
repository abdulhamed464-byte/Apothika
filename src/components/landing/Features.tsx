function Features(){


const features=[

{
icon:"📦",
title:"Inventory Management",
desc:"Real-time stock tracking, batch control, expiry management and intelligent replenishment."
},

{
icon:"💳",
title:"Sales & Billing",
desc:"Fast billing, invoices, payments and complete sales visibility."
},

{
icon:"🏬",
title:"Warehouse Control",
desc:"Manage multiple warehouses, locations and stock movement."
},

{
icon:"🤝",
title:"Supplier Management",
desc:"Control suppliers, purchase orders and procurement workflows."
},

{
icon:"🧠",
title:"Customer Intelligence",
desc:"Understand customer behaviour and improve business decisions."
},

{
icon:"📊",
title:"Reports & Analytics",
desc:"Powerful dashboards with real-time business insights."
}

];



return(

<section className="section features-section">


<h2>

Enterprise Features

</h2>



<p className="section-subtitle">

Everything your business needs in one intelligent ERP platform.

</p>




<div className="feature-grid">


{

features.map((item)=>(


<div

className="feature-card"

key={item.title}

>


<div className="feature-icon">

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


export default Features;