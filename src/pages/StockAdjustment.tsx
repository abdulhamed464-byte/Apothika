import { useEffect, useState } from "react";

import { ProductService }
from "../services/inventory/ProductService";

import type { InventoryProduct }
from "../services/inventory/ProductService";

import { StockAdjustmentService }
from "../services/inventory/StockAdjustmentService";

import { WorkspaceService }
from "../services/workspace/WorkspaceService";

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

const [businessId,setBusinessId] =
useState<string>("");

useEffect(()=>{

loadData();

},[]);

async function loadData(){

try{

const workspace =
await WorkspaceService.getUserWorkspace();

if(!workspace){

alert("Workspace not found");

return;

}

const business =
await WorkspaceService.getBusinessId();

if(!business){

alert("Business not found");

return;

}

setBusinessId(business);

const data =
await ProductService.getProducts(
workspace.workspace_id
);

setProducts(data);

}

catch(error){

console.error(
"Stock Adjustment loading error:",
error
);

alert(
"Failed to load inventory data"
);

}

}

async function saveAdjustment(){

if(!businessId){

alert("Business not found");

return;

}

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

business_id:
businessId,

product_id:
selectedProduct,

quantity:
Number(quantity),

adjustment_type:
type,

reason:
reason

});

alert(
"Stock adjustment saved"
);

setQuantity("");

setReason("");

await loadData();

}

catch(error){

console.error(
"Adjustment failed",
error
);

alert(
"Failed to save adjustment"
);

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

total +
Number(
item.quantity || 0
),

0

) || 0;

const stockOut =
product?.stock_out_entries?.reduce(

(total,item)=>

total +
Number(
item.quantity || 0
),

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
setSelectedProduct(
e.target.value
)
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

<div
style={{
marginTop:"20px"
}}
>

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
e.target.value as
"ADD"|"REMOVE"
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
setQuantity(
e.target.value
)
}

min="1"

/>

</div>

<div className="product-field">

<label>
Reason
</label>

<input

value={reason}

onChange={(e)=>
setReason(
e.target.value
)
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
