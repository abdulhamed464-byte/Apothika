import PurchaseSummary from "./PurchaseSummary";


interface Props {

    suppliers:any[];

    products:any[];

    form:any;

    loading:boolean;

    message:string;

    handleChange:any;

    handleSubmit:any;

}



function PurchaseForm({

    suppliers,

    products,

    form,

    loading,

    message,

    handleChange,

    handleSubmit


}:Props){



const selectedProduct =

    products.find(

        product => product.id === form.product_id

    );





return (


<form

onSubmit={handleSubmit}

className="purchase-form"

>



<div className="purchase-section">


<h3>
Purchase Information
</h3>



<div className="purchase-grid">



<div className="purchase-field">


<label>
Supplier
</label>



<select

name="supplier_id"

value={form.supplier_id}

onChange={handleChange}

>


<option value="">

Select Supplier

</option>



{

suppliers.map(

supplier => (

<option

key={supplier.id}

value={supplier.id}

>

{supplier.supplier_name}

</option>

)

)

}


</select>


</div>






<div className="purchase-field">


<label>
Product
</label>



<select

name="product_id"

value={form.product_id}

onChange={handleChange}

>


<option value="">

Select Product

</option>



{

products.map(

product => (

<option

key={product.id}

value={product.id}

>

{product.product_name}

</option>

)

)

}


</select>


</div>



</div>


</div>







<div className="purchase-section">


<h3>
Stock Details
</h3>



<div className="purchase-grid">



<div className="purchase-field">


<label>
Quantity
</label>


<input

type="number"

name="quantity"

value={form.quantity}

onChange={handleChange}

/>


</div>





<div className="purchase-field">


<label>
Purchase Price
</label>


<input

type="number"

name="purchase_price"

value={form.purchase_price}

onChange={handleChange}

/>


</div>



</div>


</div>







<div className="purchase-section">


<h3>
Invoice Details
</h3>



<div className="purchase-grid">



<div className="purchase-field">


<label>
Invoice Number
</label>


<input

name="invoice_number"

value={form.invoice_number}

onChange={handleChange}

/>


</div>






<div className="purchase-field">


<label>
Purchase Date
</label>


<input

type="date"

name="purchase_date"

value={form.purchase_date}

onChange={handleChange}

/>


</div>



</div>


</div>








<div className="purchase-summary">


<h3>
Purchase Summary
</h3>



<PurchaseSummary

product={selectedProduct}

quantity={form.quantity}

price={form.purchase_price}

/>



</div>







<button

type="submit"

className="purchase-button"

disabled={loading}

>


{

loading

?

"Saving..."

:

"+ Save Purchase"

}


</button>






{

message &&


<p className="purchase-message">

{message}

</p>


}



</form>


);


}



export default PurchaseForm;