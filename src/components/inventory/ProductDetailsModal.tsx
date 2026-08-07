import { useEffect, useState } from "react";

import type { InventoryProduct }
from "../../services/inventory/ProductService";

import { StockService }
from "../../services/inventory/StockService";

import type { InventoryBatch }
from "../../types/batch";

import { BatchService }
from "../../services/inventory/BatchService";


interface Props {

  product: InventoryProduct;

  onClose: () => void;

}



function ProductDetailsModal({

  product,

  onClose

}: Props) {



const [batches,setBatches] =

useState<InventoryBatch[]>([]);




useEffect(()=>{


loadBatches();


},[product.id]);






async function loadBatches(){


if(!product.id)

return;



try{


const data =

await BatchService.getProductBatches(

product.id

);



setBatches(data);



}

catch(error){


console.error(

"Batch loading failed",

error

);


}


}






const currentStock =

StockService.calculateCurrentStock(

product

);





const totalStockIn =

product.stock_entries?.reduce(

(total,item)=>

total + Number(item.quantity || 0),

0

) || 0;





const totalStockOut =

product.stock_out_entries?.reduce(

(total,item)=>

total + Number(item.quantity || 0),

0

) || 0;





const stockValue =

StockService.calculateInventoryValue(

product

);





const stockStatus =

StockService.getStockStatus(

product

);








return (


<div

style={{

position:"fixed",

inset:0,

background:"rgba(0,0,0,0.55)",

display:"flex",

justifyContent:"center",

alignItems:"center",

zIndex:3000

}}

>



<div

style={{

background:"#ffffff",

borderRadius:"18px",

padding:"24px",

width:"420px",

maxWidth:"95%",

maxHeight:"90vh",

overflowY:"auto",

boxShadow:"0 20px 50px rgba(0,0,0,.25)"

}}

>



<h2

style={{

marginTop:0,

color:"#111827"

}}

>

Product Details

</h2>






<div

style={{

display:"grid",

gap:"12px",

color:"#111827"

}}

>


<div>

<strong>Name:</strong> {product.product_name}

</div>


<div>

<strong>SKU:</strong> {product.sku}

</div>


<div>

<strong>Barcode:</strong> {product.barcode || "-"}

</div>


<div>

<strong>Category:</strong> {product.category || "-"}

</div>


<div>

<strong>Brand:</strong> {product.brand || "-"}

</div>


<div>

<strong>Selling Price:</strong> ₹{product.selling_price}

</div>


<div>

<strong>Status:</strong> {product.status}

</div>


</div>







<hr style={{margin:"20px 0"}} />





<h3 style={{color:"#111827"}}>

Inventory Summary

</h3>





<div

style={{

display:"grid",

gap:"12px",

color:"#111827"

}}

>



<div>

<strong>Total Stock In:</strong> {totalStockIn}

</div>



<div>

<strong>Total Stock Out:</strong> {totalStockOut}

</div>



<div>

<strong>Current Stock:</strong> {currentStock}

</div>



<div>

<strong>Inventory Value:</strong> ₹{stockValue}

</div>




<div>

<strong>Status:</strong>{" "}


{

stockStatus === "OUT_OF_STOCK"

?

"Out of Stock"

:

stockStatus === "LOW_STOCK"

?

"Low Stock"

:

"Healthy"

}


</div>


</div>








<hr style={{margin:"20px 0"}} />





<h3 style={{color:"#111827"}}>

Inventory Batches

</h3>







{

batches.length === 0



?


<p style={{color:"#374151"}}>

No batch records available.

</p>



:



batches.map(batch=>(



<div

key={batch.id}

style={{

border:"1px solid #e5e7eb",

borderRadius:"10px",

padding:"12px",

marginBottom:"10px",

color:"#111827"

}}

>



<div>

<strong>Batch:</strong> {batch.batch_number}

</div>



<div>

<strong>Quantity Received:</strong> {batch.quantity_received}

</div>



<div>

<strong>Quantity Available:</strong> {batch.quantity_available}

</div>



<div>

<strong>Expiry:</strong> {batch.expiry_date || "-"}

</div>



<div>

<strong>Status:</strong> {batch.status}

</div>



</div>



))


}







<div

style={{

display:"flex",

justifyContent:"flex-end",

marginTop:"24px"

}}

>



<button onClick={onClose}>

Close

</button>



</div>





</div>


</div>


);


}



export default ProductDetailsModal;