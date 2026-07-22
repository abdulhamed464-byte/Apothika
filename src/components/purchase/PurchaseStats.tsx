interface Props {

purchases:any[];

}



function PurchaseStats({

purchases

}:Props){



const total =
purchases.reduce(

(sum,p)=>

sum + Number(p.total_amount || 0),

0

);



const transactions =
purchases.length;



const pending =
purchases.filter(

p=>

p.payment_status==="Pending"

)

.reduce(

(sum,p)=>

sum + Number(p.total_amount || 0),

0

);



const average =
transactions

?

total / transactions

:

0;




return(


<div className="purchase-stats">



<div className="stat-card">

<div>

<h3>
Total Purchases
</h3>


<strong>
₹{total.toLocaleString()}
</strong>

</div>

</div>





<div className="stat-card">

<div>

<h3>
Transactions
</h3>


<strong>
{transactions}
</strong>


</div>

</div>






<div className="stat-card">

<div>

<h3>
Pending Payments
</h3>


<strong>
₹{pending.toLocaleString()}
</strong>


</div>

</div>







<div className="stat-card">

<div>

<h3>
Average Purchase
</h3>


<strong>
₹{average.toFixed(0)}
</strong>


</div>

</div>





</div>


);


}


export default PurchaseStats;