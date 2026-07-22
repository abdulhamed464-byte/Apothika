interface Props {

products:any[];

}



function InventoryReports({

products

}:Props){



const categories =

new Set(

products.map(

product=>product.category

)

)

.size;





return(

<div className="inventory-reports">



<h2>

Inventory Reports

</h2>



<p>

Stock intelligence overview

</p>





<div className="inventory-report-grid">





<div className="inventory-report-card">


<span>

Categories

</span>


<strong>

{categories}

</strong>


</div>







<div className="inventory-report-card">


<span>

Active Products

</span>


<strong>

{products.length}

</strong>


</div>






<div className="inventory-report-card">


<span>

Tracking

</span>


<strong>

Enabled

</strong>


</div>






</div>




</div>

);


}



export default InventoryReports;