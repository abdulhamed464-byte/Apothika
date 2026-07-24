import { useState } from "react";

import type { StockInPayload } from "../../types/stock";


interface Props {

products:any[];

suppliers:any[];

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

.split("T")[0]

});





function change(

e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

){


setForm({

...form,

[e.target.name]:

e.target.value

});


}







function submit(

e:React.FormEvent

){

console.log("STOCK FORM VALUE:", form.quantity);

e.preventDefault();



if(

Number(form.quantity)<=0

){

alert(

"Quantity must be greater than zero"

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

form.invoice_number,

entry_date:

form.entry_date,

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

>

<option>

Select Product

</option>


{

products.map(product=>(
<option
 key={product.id}
 value={product.id}
>
 {product.product_name} - {product.sku}
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

<option>

Select Supplier

</option>


{

suppliers.map(s=>(

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

/>





<label>

Purchase Price

</label>


<input

type="number"

name="purchase_price"

value={form.purchase_price}

onChange={change}

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

/>





<button

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