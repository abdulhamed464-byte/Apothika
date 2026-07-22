import { useEffect, useState } from "react";

import { PurchaseService } from "../services/purchase/PurchaseService";

import PurchaseForm from "../components/purchase/PurchaseForm";
import PurchaseHistory from "../components/purchase/PurchaseHistory";
import PurchaseStats from "../components/purchase/PurchaseStats";
import PurchaseAnalytics from "../components/purchase/PurchaseAnalytics";
import PurchaseReports from "../components/purchase/PurchaseReports";

import "../styles/purchases.css";



function Purchases(){



const [suppliers,setSuppliers] =
useState<any[]>([]);



const [products,setProducts] =
useState<any[]>([]);



const [purchases,setPurchases] =
useState<any[]>([]);





const [form,setForm] =
useState({

supplier_id:"",

product_id:"",

quantity:"",

purchase_price:"",

invoice_number:"",

purchase_date:

new Date()

.toISOString()

.split("T")[0]

});





const [loading,setLoading] =
useState(false);



const [message,setMessage] =
useState("");






useEffect(()=>{

loadData();

loadPurchases();

},[]);








async function loadData(){


try{


const supplierData =

await PurchaseService.getSuppliers();



const productData =

await PurchaseService.getProducts();




setSuppliers(

supplierData

);



setProducts(

productData

);



}

catch(error){

console.error(error);

}


}








async function loadPurchases(){


try{


const data =

await PurchaseService.getPurchaseHistory();



setPurchases(

data ?? []

);



}

catch(error){


console.error(

"Purchase stats error",

error

);


}



}










function handleChange(

e:

React.ChangeEvent<

HTMLInputElement |

HTMLSelectElement

>

){


setForm({

...form,

[e.target.name]:

e.target.value

});


}










async function handleSubmit(

e:React.FormEvent

){


e.preventDefault();


setMessage("");



try{


setLoading(true);



await PurchaseService.savePurchase(

form

);




setMessage(

"Purchase saved successfully"

);





setForm({

supplier_id:"",

product_id:"",

quantity:"",

purchase_price:"",

invoice_number:"",

purchase_date:

new Date()

.toISOString()

.split("T")[0]

});





await loadPurchases();



}


catch(error:any){


console.error(error);



setMessage(

error.message ||

"Purchase failed"

);



}



finally{


setLoading(false);


}


}









return(



<div className="dashboard-page">


<div className="purchase-container">





{/* PURCHASE KPI */}

<PurchaseStats

purchases={purchases}

/>









{/* PURCHASE ANALYTICS */}

<PurchaseAnalytics

purchases={purchases}

/>











{/* CREATE PURCHASE */}


<div className="purchase-card">


<h1 className="purchase-title">

Create Purchase

</h1>





<PurchaseForm


suppliers={suppliers}


products={products}


form={form}


loading={loading}


message={message}


handleChange={handleChange}


handleSubmit={handleSubmit}


/>



</div>









{/* PURCHASE HISTORY */}


<PurchaseHistory />









{/* PURCHASE REPORTS */}


<PurchaseReports

purchases={purchases}

/>








</div>


</div>


);


}



export default Purchases;