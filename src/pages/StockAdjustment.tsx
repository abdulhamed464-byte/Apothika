import { useEffect, useState } from "react";

import { ProductService } 
from "../services/inventory/ProductService";

import type { InventoryProduct } 
from "../services/inventory/ProductService";

import { StockAdjustmentService }
from "../services/inventory/StockAdjustmentService";


const WORKSPACE_ID =
"4e24cab5-087c-4004-8d80-1098dbbe3ade";



function StockAdjustment(){


const [products,setProducts] =
useState<InventoryProduct[]>([]);


const [selectedProduct,setSelectedProduct] =
useState("");


const [type,setType] =
useState<"ADD"|"REMOVE">("ADD");


const [quantity,setQuantity] =
useState("");


const [reason,setReason] =
useState("");




useEffect(()=>{

loadProducts();

},[]);





async function loadProducts(){

const data =
await ProductService.getProducts(
WORKSPACE_ID
);


console.log(
"PRODUCT DATA:",
data
);


setProducts(data);

}




async function saveAdjustment(){


if(!selectedProduct){

alert("Please select a product");

return;

}



if(!quantity || Number(quantity)<=0){

alert("Enter valid quantity");

return;

}



try{


await StockAdjustmentService.createAdjustment({

business_id: WORKSPACE_ID,

product_id: selectedProduct,

quantity:Number(quantity),

adjustment_type:type,

reason:reason

});



alert("Stock adjustment saved");



setQuantity("");

setReason("");



loadProducts();


}

catch(error){

console.error(
"Adjustment failed",
error
);


alert("Failed to save adjustment");

}


}







const product =
products.find(
item =>
item.id === selectedProduct
);





const stockIn =
product?.stock_entries?.reduce(

(total,item)=>

total + Number(item.quantity || 0),

0

) || 0;





const stockOut =
product?.stock_out_entries?.reduce(

(total,item)=>

total + Number(item.quantity || 0),

0

) || 0;





const currentStock =
stockIn - stockOut;







return(


<div className="inventory-container">


<div className="inventory-header">


<h1>
Stock Adjustment
</h1>


<p>
Correct inventory quantity with proper audit history.
</p>


</div>





<div className="inventory-main-card">


<h2>
New Adjustment
</h2>





<div className="product-field">


<label>
Product
</label>



<select

value={selectedProduct}

onChange={(e)=>
setSelectedProduct(e.target.value)
}

>


<option value="">
Select Product
</option>



{

products.map(product=>(

<option

key={product.id}

value={product.id}

>

{product.product_name}

</option>

))

}


</select>


</div>






<div style={{marginTop:"20px"}}>


<strong>
Current Stock:
</strong>


{" "}

{currentStock}


</div>







<hr

style={{

margin:"20px 0"

}}

/>







<div className="product-field">


<label>
Adjustment Type
</label>



<select

value={type}

onChange={(e)=>

setType(

e.target.value as "ADD"|"REMOVE"

)

}

>


<option value="ADD">
Add Stock
</option>


<option value="REMOVE">
Remove Stock
</option>


</select>


</div>







<div className="product-field">


<label>
Quantity
</label>



<input

type="number"

value={quantity}

onChange={(e)=>

setQuantity(e.target.value)

}

/>


</div>







<div className="product-field">


<label>
Reason
</label>



<input

value={reason}

onChange={(e)=>

setReason(e.target.value)

}

/>


</div>






<button

type="button"

onClick={saveAdjustment}

style={{

marginTop:"20px",

padding:"10px 20px",

background:"#2563eb",

color:"white",

border:"none",

borderRadius:"8px",

cursor:"pointer"

}}

>

Save Adjustment

</button>






</div>


</div>


);


}



export default StockAdjustment;