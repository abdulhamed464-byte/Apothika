function Industries(){

const industries=[

"Pharmacy",
"Retail",
"Supermarket",
"Restaurant",
"Warehouse",
"Manufacturing",
"Hospital",
"Electronics",
"Construction",
"Logistics"

];


return (

<section className="section">


<h2>
One ERP. Every Industry.
</h2>


<p className="section-subtitle">
A flexible operating system designed for every business domain.
</p>



<div className="grid">


{
industries.map((item)=>(

<div
className="glass-box"
key={item}
>

<h3>
{item}
</h3>

<p>
Complete business management solution.
</p>


</div>

))
}


</div>


</section>

);

}


export default Industries;