import { Link } from "react-router-dom";


function Hero() {


return (

<section className="hero">


<div className="hero-content">


<div className="hero-badge">

🚀 AI Powered Enterprise ERP Platform

</div>



<h1>

One Platform.

<br />

<span className="gradient-text">

Every Business.

</span>

</h1>



<p>

APOTHIKA connects inventory, sales, purchasing,
warehouse, manufacturing, pharmacy, retail,
logistics and AI intelligence into one powerful
business operating system.

</p>




<div className="hero-buttons">


<Link
to="/register"
className="primary-btn"
>

Start Free

</Link>



<Link
to="/login"
className="secondary-btn"
>

Login

</Link>


</div>




<div className="hero-trust">


<span>
✓ Multi Industry
</span>


<span>
✓ Cloud ERP
</span>


<span>
✓ AI Ready
</span>


</div>


</div>





<div className="hero-dashboard">


<div className="erp-window">



<div className="window-header">

APOTHIKA Enterprise Control

</div>




<div className="stats">



<div className="stat-card">

<h2>
24,850
</h2>

<p>
Inventory Items
</p>

</div>




<div className="stat-card">

<h2>
£2.4M
</h2>

<p>
Sales Revenue
</p>

</div>




<div className="stat-card">

<h2>
850
</h2>

<p>
Suppliers
</p>

</div>




<div className="stat-card">

<h2>
12
</h2>

<p>
Warehouses
</p>

</div>



</div>






<div className="ai-card">


🤖 APOTHIKA Intelligence


<h3>

AI Demand Forecast Active

</h3>


<p>

Predict stock, analyse sales and optimise business decisions.

</p>


</div>







<div className="operations-card">


🏭 Enterprise Operations


<p>

Manufacturing • Pharmacy • Retail • Hospital • Logistics

</p>


</div>




</div>


</div>




</section>


);

}


export default Hero;