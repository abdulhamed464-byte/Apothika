interface Props {

    purchases:any[];

}



function PurchaseReports({

    purchases

}:Props){



const totalPurchase =

purchases.reduce(

(sum,p)=>

sum + Number(p.total_amount || 0),

0

);





const transactions =

purchases.length;





const pendingAmount =

purchases

.filter(

p => p.payment_status === "Pending"

)

.reduce(

(sum,p)=>

sum + Number(p.total_amount || 0),

0

);





const averagePurchase =

transactions

?

totalPurchase / transactions

:

0;





const highestPurchase =

purchases.length

?

Math.max(

...purchases.map(

p => Number(p.total_amount || 0)

)

)

:

0;







return (

<div className="purchase-reports">



<h2>

Purchase Reports

</h2>



<p className="report-subtitle">

Purchase performance overview

</p>





<div className="reports-grid">





<div className="report-card">

<span>

Total Purchase

</span>


<strong>

₹{totalPurchase.toLocaleString()}

</strong>

</div>






<div className="report-card">

<span>

Transactions

</span>


<strong>

{transactions}

</strong>

</div>






<div className="report-card">

<span>

Pending Amount

</span>


<strong>

₹{pendingAmount.toLocaleString()}

</strong>

</div>






<div className="report-card">

<span>

Average Purchase

</span>


<strong>

₹{averagePurchase.toFixed(0)}

</strong>

</div>






</div>






<div className="report-summary">



<div>

Highest Purchase

<strong>

₹{highestPurchase.toLocaleString()}

</strong>

</div>



<div>

Business Insight

<strong>

Purchase activity tracking enabled

</strong>

</div>



</div>





</div>

);


}


export default PurchaseReports;