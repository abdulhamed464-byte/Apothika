import type { InventoryProduct } from "../../services/inventory/ProductService";
import { StockService } from "../../services/inventory/StockService";


interface Props {

  products: InventoryProduct[];

}



export default function InventoryIntelligence({

  products

}: Props){



const totalProducts =
products.length;



const healthy =
products.filter(

product =>

StockService.getStockStatus(product)

===

"IN_STOCK"

).length;



const lowStock =
products.filter(

product =>

StockService.getStockStatus(product)

===

"LOW_STOCK"

).length;



const outOfStock =
products.filter(

product =>

StockService.getStockStatus(product)

===

"OUT_OF_STOCK"

).length;




const healthPercentage =

totalProducts === 0

?

0

:

Math.round(

(healthy / totalProducts) * 100

);





const inventoryInvestment =

products.reduce(

(total, product)=>{


const stock =

StockService.calculateCurrentStock(

product

);



return (

total +

(

stock *

Number(product.purchase_price || 0)

)

);



},

0

);






const potentialRevenue =

products.reduce(

(total, product)=>{


const stock =

StockService.calculateCurrentStock(

product

);



return (

total +

(

stock *

Number(product.selling_price || 0)

)

);



},

0

);






const expectedProfit =

potentialRevenue -

inventoryInvestment;




return (

<div className="inventory-intelligence">


<h2>
Inventory Intelligence
</h2>



<div className="intelligence-grid">



<div className="intelligence-card">

<h3>
Inventory Health
</h3>

<p>
{healthPercentage}%
</p>

<span>
Healthy products
</span>

</div>




<div className="intelligence-card">

<h3>
Low Stock
</h3>

<p>
{lowStock}
</p>

<span>
Products need attention
</span>

</div>




<div className="intelligence-card">

<h3>
Out of Stock
</h3>

<p>
{outOfStock}
</p>

<span>
Products unavailable
</span>

</div>




<div className="intelligence-card">

<h3>
Total Products
</h3>

<p>
{totalProducts}
</p>

<span>
Inventory catalogue
</span>

</div>




<div className="intelligence-card">

<h3>
Inventory Investment
</h3>

<p>
₹{inventoryInvestment.toLocaleString()}
</p>

<span>
Money invested
</span>

</div>




<div className="intelligence-card">

<h3>
Potential Revenue
</h3>

<p>
₹{potentialRevenue.toLocaleString()}
</p>

<span>
Possible sales value
</span>

</div>




<div className="intelligence-card">

<h3>
Expected Profit
</h3>

<p>
₹{expectedProfit.toLocaleString()}
</p>

<span>
Estimated margin
</span>

</div>



</div>


</div>

);


}