import { useEffect, useState } from "react";

import StockInForm from "../components/inventory/StockInForm";

import { ProductService } from "../services/inventory/ProductService";
import { StockService } from "../services/inventory/StockService";

import { supabase } from "../lib/supabase";

import type { StockInPayload } from "../types/stock";


const BUSINESS_ID =
"4e24cab5-087c-4004-8d80-1098dbbe3ade";



function StockIn(){


const [products,setProducts] =
useState<any[]>([]);


const [suppliers,setSuppliers] =
useState<any[]>([]);


const [loading,setLoading] =
useState(false);


const [message,setMessage] =
useState("");





useEffect(()=>{

loadData();

},[]);






async function loadData(){


try{


const productData =
await ProductService.getProducts(
BUSINESS_ID
);


setProducts(productData);





const {
data,
error
}
=
await supabase

.from("suppliers")

.select("*")

.eq(
"business_id",
BUSINESS_ID
)

.eq(
"status",
"Active"
);



if(error){

throw error;

}



setSuppliers(
data ?? []
);



}

catch(error){

console.error(
"Stock In loading error",
error
);

}



}








async function handleStockIn(

payload:StockInPayload

){


try{


setLoading(true);

setMessage("");





await StockService.stockIn({

...payload,

business_id:
BUSINESS_ID

});





setMessage(

"Stock added successfully"

);



}


catch(error){


console.error(error);


setMessage(

"Stock entry failed"

);



}


finally{


setLoading(false);


}



}









return (

<div className="inventory-container">


<div className="inventory-header">


<div>

<h1>

Stock In

</h1>


<p>

Add incoming stock into inventory.

</p>


</div>


</div>







<div className="inventory-main-card">


<StockInForm

products={products}

suppliers={suppliers}

onSubmit={handleStockIn}

loading={loading}

/>



{

message &&

<p className="product-message">

{message}

</p>

}



</div>




</div>

);


}


export default StockIn;