import type { InventoryProduct } from "../../services/inventory/ProductService";
import { StockService } from "../../services/inventory/StockService";


interface Props {

  products: InventoryProduct[];

  onEdit?: (
    product: InventoryProduct
  ) => void;


  onDelete?: (
    product: InventoryProduct
  ) => void;


  onView?: (
    product: InventoryProduct
  ) => void;

}



function InventoryTable({

  products,

  onEdit,

  onDelete,

  onView

}:Props){


return (

<div className="inventory-table-wrapper">


<table className="inventory-table">


<thead>

<tr>

<th>
Image
</th>

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

<th>
Actions
</th>

</tr>

</thead>



<tbody>


{

products.map((product)=>{


const stock =

  StockService.calculateCurrentStock(

    product

  );
  
  const value =

stock *

Number(product.purchase_price || 0);

const stockStatus =
  StockService.getStockStatus(product);


return (

<tr key={product.id}>


<td>

{

product.image_url ?

<img

src={product.image_url}

alt={product.product_name}

style={{

width:"45px",

height:"45px",

objectFit:"cover",

borderRadius:"8px"

}}

/>

:

"-"

}

</td>




<td>

{product.product_name}

</td>




<td>

{product.sku || "-"}

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

stockStatus === "OUT_OF_STOCK"

?

"inventory-out"

:

stockStatus === "LOW_STOCK"

?

"inventory-low"

:

"inventory-good"

}

>

{

stockStatus === "OUT_OF_STOCK"

?

"Out of Stock"

:

stockStatus === "LOW_STOCK"

?

"Low Stock"

:

product.status

}

</span>

</td>





<td>


<div

style={{

display:"flex",

gap:"8px"

}}

>



<button

type="button"

onClick={()=>onView?.(product)}

>

View

</button>




<button

type="button"

onClick={()=>onEdit?.(product)}

>

Edit

</button>




{

product.status !== "Archived"

?

<button

type="button"

onClick={()=>onDelete?.(product)}

style={{

background:"#ef4444",

color:"white"

}}

>

Archive

</button>


:

<span

style={{

color:"#f59e0b",

fontWeight:"600"

}}

>

Archived

</span>

}



</div>


</td>



</tr>


);


})


}


</tbody>


</table>


</div>


);


}


export default InventoryTable;