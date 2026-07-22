import {
    TrendingUp,
    Users,
    Brain,
    Lightbulb
} from "lucide-react";


interface Props {

    purchases:any[];

}



function PurchaseAnalytics({

    purchases

}:Props){



const supplierMap:any = {};



purchases.forEach(

purchase => {


const supplier =

purchase.suppliers?.supplier_name ||

"Unknown Supplier";



if(!supplierMap[supplier]){

supplierMap[supplier]=0;

}



supplierMap[supplier] +=

Number(
purchase.total_amount || 0
);



}

);







const topSupplier =

Object.keys(supplierMap).sort(

(a,b)=>

supplierMap[b]-supplierMap[a]

)[0]

||

"No Data";






const topSupplierAmount =

supplierMap[topSupplier] || 0;







const totalPurchase =

purchases.reduce(

(sum,purchase)=>

sum +

Number(
purchase.total_amount || 0
),

0

);







const supplierDependency =

totalPurchase > 0

?

Math.round(

(topSupplierAmount / totalPurchase) * 100

)

:

0;







let purchasePattern =

"Waiting for more transactions";



if(purchases.length >= 5){

purchasePattern =

"Regular purchasing behaviour";

}

else if(purchases.length > 0){

purchasePattern =

"Growing purchase activity";

}








let recommendation =

"Create more purchase history to generate insights.";





if(supplierDependency > 70){

recommendation =

"High supplier dependency detected. Consider evaluating alternative suppliers.";

}

else if(supplierDependency > 40){

recommendation =

"Supplier concentration is moderate. Monitor pricing trends.";

}

else if(purchases.length >= 5){

recommendation =

"Purchase activity is stable. Maintain current buying pattern.";

}








return(


<div className="purchase-analytics">





<div className="analytics-title">


<h2>

Purchase Intelligence

</h2>


<p>

Business purchasing behaviour analysis

</p>


</div>







<div className="analytics-grid">






<div className="analytics-card">


<div className="analytics-icon green">

<Users size={22}/>

</div>


<div>

<span>

Top Supplier

</span>


<strong>

{topSupplier}

</strong>


</div>


</div>









<div className="analytics-card">


<div className="analytics-icon blue">

<TrendingUp size={22}/>

</div>


<div>

<span>

Supplier Contribution

</span>


<strong>

{supplierDependency}%

</strong>


</div>


</div>









<div className="analytics-card">


<div className="analytics-icon orange">

<Brain size={22}/>

</div>


<div>

<span>

Purchase Pattern

</span>


<strong>

{purchasePattern}

</strong>


</div>


</div>









<div className="analytics-card">


<div className="analytics-icon purple">

<Lightbulb size={22}/>

</div>


<div>

<span>

Recommendation

</span>


<strong>

Review Buying

</strong>


</div>


</div>








</div>







<div className="analytics-summary">


<div>


<span>

AI Suggestion

</span>


<strong>

{recommendation}

</strong>


</div>


</div>







</div>


);


}



export default PurchaseAnalytics;