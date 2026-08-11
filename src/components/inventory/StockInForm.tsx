import { useState } from "react";

import type { StockInPayload } from "../../types/stock";

interface Props {

products:any;

suppliers:any;

onSubmit:(data:StockInPayload)=>void;

loading:boolean;

}

function StockInForm({

products,

suppliers,

onSubmit,

loading

}:Props){

const [form,setForm]=useState({

product_id:"",

supplier_id:"",

quantity:"",

purchase_price:"",

invoice_number:"",

entry_date:
new Date()
.toISOString()
.split("T")[0],

batch_number:"",

manufacturing_date:"",

expiry_date:""

});

const selectedProduct =

products.find(

(product:any) =>

product.id === form.product_id

);

function change(

e:React.ChangeEvent<
HTMLInputElement |
HTMLSelectElement

>

){

setForm({

...form,

[e.target.name]: e.target.value

});

}

function submit(

e:React.FormEvent

){

e.preventDefault();

if(!form.product_id){

alert(
"Please select a product"
);

return;

}

if(
!form.quantity ||
Number(form.quantity)<=0
){

alert(
"Quantity must be greater than zero"
);

return;

}

if(
!form.purchase_price ||
Number(form.purchase_price)<0
){

alert(
"Please enter a valid purchase price"
);

return;

}

if(
selectedProduct?.batch_required &&
!form.batch_number
){

alert(
"Batch number is required for this product"
);

return;

}

if(
selectedProduct?.batch_required &&
selectedProduct?.expiry_required &&
!form.expiry_date
){

alert(
"Expiry date is required for this product"
);

return;

}

onSubmit({

product_id:
form.product_id,

supplier_id:
form.supplier_id || null,

quantity:
Number(form.quantity),

purchase_price:
Number(form.purchase_price),

invoice_number:
form.invoice_number || null,

entry_date:
form.entry_date,

batch_number:
form.batch_number || undefined,

manufacturing_date:
form.manufacturing_date || undefined,

expiry_date:
form.expiry_date || undefined,

business_id:""

});

}

return (

<form

onSubmit={submit}

className="product-form"

>

<h3>
Stock In
</h3>

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

products.map((product:any)=>(

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

<label>
Supplier
</label>

<select

name="supplier_id"

value={form.supplier_id}

onChange={change}

>

<option value="">
Select Supplier
</option>

{

suppliers.map((s:any)=>(

<option

key={s.id}

value={s.id}

>

{s.supplier_name}

</option>

))

}

</select>

<label>
Quantity
</label>

<input

type="number"

name="quantity"

value={form.quantity}

onChange={change}

min="1"

required

/>

<label>
Purchase Price
</label>

<input

type="number"

name="purchase_price"

value={form.purchase_price}

onChange={change}

min="0"

step="0.01"

required

/>

<label>
Invoice Number
</label>

<input

name="invoice_number"

value={form.invoice_number}

onChange={change}

/>

<label>
Entry Date
</label>

<input

type="date"

name="entry_date"

value={form.entry_date}

onChange={change}

required

/>

{

selectedProduct?.batch_required &&

<>

<hr/>

<h3>
Batch Information
</h3>

<label>
Batch Number *
</label>

<input

name="batch_number"

value={form.batch_number}

onChange={change}

required

/>

<label>
Manufacturing Date
</label>

<input

type="date"

name="manufacturing_date"

value={form.manufacturing_date}

onChange={change}

/>

{

selectedProduct?.expiry_required &&

<>

<label>
Expiry Date *
</label>

<input

type="date"

name="expiry_date"

value={form.expiry_date}

onChange={change}

required

/>

</>

}

</>

}

<button

type="submit"

disabled={loading}

>

{

loading

?

"Saving..."

:

"Save Stock"

}

</button>

</form>

);

}

export default StockInForm;
