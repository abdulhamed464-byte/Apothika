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

).filter(Boolean)

)

.size;







const totalStock =

products.reduce(

(sum,product)=>{


const stockIn =

product.stock_entries?.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;




const stockOut =

product.stock_out_entries?.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;




const adjustmentAdd =

product.stock_adjustments

?.filter(

(item:any)=>

item.adjustment_type==="ADD"

)

.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;





const adjustmentRemove =

product.stock_adjustments

?.filter(

(item:any)=>

item.adjustment_type==="REMOVE"

)

.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;





return (

sum +

stockIn

-

stockOut

+

adjustmentAdd

-

adjustmentRemove

);


},

0

);









const lowStock =

products.filter(product=>{


const stockIn =

product.stock_entries?.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;



const stockOut =

product.stock_out_entries?.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;



const stock =

stockIn-stockOut;



return (

stock <= Number(product.minimum_stock)

);


})

.length;








const inventoryValue =

products.reduce(

(sum,product)=>{


const stockIn =

product.stock_entries?.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;



const stockOut =

product.stock_out_entries?.reduce(

(total:any,item:any)=>

total + Number(item.quantity || 0),

0

) || 0;



const stock =

stockIn-stockOut;



return (

sum +

(

stock *

Number(product.purchase_price || 0)

)

);


},

0

);







const batchProducts =

products.filter(

product=>

product.batch_required

)

.length;








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
Total Products
</span>

<strong>
{products.length}
</strong>

</div>






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
Total Stock
</span>

<strong>
{totalStock}
</strong>

</div>







<div className="inventory-report-card">

<span>
Low Stock Items
</span>

<strong>
{lowStock}
</strong>

</div>







<div className="inventory-report-card">

<span>
Inventory Value
</span>

<strong>

₹{inventoryValue.toLocaleString()}

</strong>

</div>







<div className="inventory-report-card">

<span>
Batch Tracking
</span>

<strong>

{batchProducts}

</strong>

</div>






</div>





</div>


);


}



export default InventoryReports;