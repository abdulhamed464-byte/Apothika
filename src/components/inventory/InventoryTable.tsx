interface Props {

  products:any[];

}



function InventoryTable({

  products

}:Props){



return(

<div className="inventory-table-wrapper">


<table className="inventory-table">


<thead>

<tr>

<th>
Product
</th>

<th>
SKU
</th>

<th>
Category
</th>

<th>
Stock
</th>

<th>
Value
</th>

<th>
Status
</th>

</tr>

</thead>




<tbody>


{

products.map(

(product:any)=>{


const stock =

product.stock_entries?.reduce(

(total:number,entry:any)=>

total +

Number(entry.quantity || 0),

0

)

||0;



const value =

stock *

Number(product.purchase_price || 0);




return(


<tr key={product.id}>


<td>

{product.product_name}

</td>



<td>

{product.sku}

</td>



<td>

{product.category || "-"}

</td>




<td>

{stock}

</td>




<td>

₹{value.toLocaleString()}

</td>





<td>


<span

className={

stock <= Number(product.minimum_stock)

?

"inventory-low"

:

"inventory-good"

}

>


{

stock <= Number(product.minimum_stock)

?

"Low Stock"

:

"Healthy"

}


</span>


</td>




</tr>


);


}


)


}



</tbody>


</table>


</div>

);


}



export default InventoryTable;