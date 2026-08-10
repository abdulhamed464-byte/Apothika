import { useEffect, useState } from "react";

import { ProductService } from "../services/inventory/ProductService";
import { StockOutService } from "../services/inventory/StockOutService";

import type { InventoryProduct } from "../services/inventory/ProductService";
import type { StockOutPayload } from "../types/stockOut";

const WORKSPACE_ID =
"4e24cab5-087c-4004-8d80-1098dbbe3ade";


const BUSINESS_ID =
"0a3fc44c-c85a-44dd-9791-b9a44eec2aed";

function StockOut(){

const [products,setProducts]=
useState<InventoryProduct[]>([]);

const [loading,setLoading]=
useState(false);

const [message,setMessage]=
useState("");

const [form,setForm]=
useState({

product_id:"",

quantity:"",

selling_price:"",

invoice_number:"",

entry_date:
new Date()
.toISOString()
.split("T")[0]

});



useEffect(()=>{

loadProducts();

},[]);



async function loadProducts(){

const data=
await ProductService.getProducts(
WORKSPACE_ID
);

setProducts(data);

}



function change(
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement
  >
) {

  const { name, value } = e.target;

  setForm({

    ...form,

    [name]: value,

  });

}



async function save(

e:React.FormEvent

){

e.preventDefault();

try{

setLoading(true);

const payload:StockOutPayload={

business_id:
BUSINESS_ID,


product_id:
form.product_id,

quantity:
Number(form.quantity),

selling_price:
Number(form.selling_price),

invoice_number:
form.invoice_number,

entry_date:
form.entry_date

};

await StockOutService.createStockOut(
payload
);

setMessage(
"Stock Out saved successfully."
);

setForm({

product_id:"",

quantity:"",

selling_price:"",

invoice_number:"",

entry_date:
new Date()
.toISOString()
.split("T")[0]

});

}

catch{

setMessage(
"Failed to save Stock Out."
);

}

finally{

setLoading(false);

}

}



return(

<div className="inventory-container">

<div className="inventory-header">

<div>

<h1>

Stock Out

</h1>

<p>

Record products leaving inventory.

</p>

</div>

</div>



<div className="inventory-main-card">

<h2>

Stock Out Entry

</h2>



<form
onSubmit={save}
className="product-form"
>

<div className="product-field">

<label>

Product

</label>

<select

name="product_id"

value={form.product_id}

onChange={change}

required

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
{" - "}
{product.sku}

</option>

))

}

</select>

</div>



<div className="product-field">

<label>

Quantity

</label>

<input

type="number"

name="quantity"

value={form.quantity}

onChange={change}

required

/>

</div>



<div className="product-field">

<label>

Selling Price

</label>

<input

type="number"

name="selling_price"

value={form.selling_price}

onChange={change}

required

/>

</div>



<div className="product-field">

<label>

Invoice Number

</label>

<input

name="invoice_number"

value={form.invoice_number}

onChange={change}

/>

</div>



<div className="product-field">

<label>

Date

</label>

<input

type="date"

name="entry_date"

value={form.entry_date}

onChange={change}

/>

</div>



<button

className="product-button"

disabled={loading}

>

{

loading

?

"Saving..."

:

"Save Stock Out"

}

</button>



{

message &&

<p>

{message}

</p>

}

</form>

</div>

</div>

);

}

export default StockOut;