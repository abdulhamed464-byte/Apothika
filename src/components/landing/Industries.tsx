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


<div className="grid">


{
industries.map(item=>(

<div className="glass-box" key={item}>

{item}

</div>

))

}


</div>


</section>

);

}


export default Industries;