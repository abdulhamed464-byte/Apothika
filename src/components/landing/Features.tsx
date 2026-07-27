function Features(){

const features=[

"Inventory Management",
"Sales & Billing",
"Warehouse Control",
"Supplier Management",
"Customer Intelligence",
"Reports & Analytics"

];


return (

<section className="section">


<h2>
Enterprise Features
</h2>



<div className="grid">


{
features.map(feature=>(

<div
className="glass-box"
key={feature}
>

<h3>
{feature}
</h3>


<p>
Powerful tools built for modern enterprises.
</p>


</div>

))
}


</div>


</section>

);

}


export default Features;