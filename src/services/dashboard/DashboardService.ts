import { supabase } from "../../lib/supabase";


export const DashboardService = {


async getDashboardStats(workspaceId:string){


const productsResult =
await supabase
.from("products")
.select(
"id,product_name,purchase_price,minimum_stock"
)
.eq(
"workspace_id",
workspaceId
);



const stockResult =
await supabase
.from("stock_entries")
.select(
"business_id,product_id,quantity,purchase_price"
);


console.log(
  "ALL STOCK:",
  stockResult.data
);



const customersResult =
await supabase
.from("customers")
.select("id")
.eq(
"business_id",
workspaceId
);



const salesResult =
await supabase
.from("sales")
.select(
"id,invoice_number,total_amount,payment_status,sale_date"
)
.eq(
"business_id",
workspaceId
)
.order(
"sale_date",
{
ascending:true
}
);



if(productsResult.error)
throw productsResult.error;


if(stockResult.error)
throw stockResult.error;


if(customersResult.error)
throw customersResult.error;


if(salesResult.error)
throw salesResult.error;





const products =
productsResult.data ?? [];


const stockEntries =
stockResult.data ?? [];
console.log(
  "STOCK ENTRIES:",
  stockEntries
);


const customers =
customersResult.data ?? [];



const sales =
salesResult.data ?? [];







const inventory = products.map(product=>{


const stock =
stockEntries
.filter(
entry =>
entry.product_id === product.id
)
.reduce(
(sum,entry)=>
sum + Number(entry.quantity),
0
);



return {


id:product.id,

product_name:
product.product_name,


stock,


value:
stock *
Number(product.purchase_price),


minimum_stock:
product.minimum_stock


};


});







const inventoryValue =

inventory.reduce(

(sum,item)=>

sum + item.value,

0

);







const lowStockProducts =

inventory.filter(

item=>

item.stock <= item.minimum_stock

);






const todaySales =

sales.reduce(

(sum,item)=>

sum + Number(item.total_amount),

0

);






return {


totalProducts:
products.length,


customers:
customers.length,


todaySales,


inventoryValue,


lowStock:
lowStockProducts.length,


lowStockProducts,


inventory,


recentSales:
sales.slice(-5).reverse(),


salesChart:

sales.map(item=>({

date:item.sale_date,

amount:Number(item.total_amount)

}))


};



}


};