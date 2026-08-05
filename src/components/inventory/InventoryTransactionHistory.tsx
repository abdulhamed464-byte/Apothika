import { useMemo, useState } from "react";

import type {
  InventoryTransaction
} from "../../services/inventory/StockHistoryService";


interface Props {

  transactions: InventoryTransaction[];

}



function InventoryTransactionHistory({

transactions

}: Props) {


const [search,setSearch] =
useState("");


const [type,setType] =
useState("");


const [selectedTransaction,setSelectedTransaction] =
useState<string | null>(null);






const filteredTransactions =

useMemo(()=>{


return transactions.filter(item=>{


const text =
search.toLowerCase();




const matchesSearch =

!text

||

(item.invoice ?? "")
.toLowerCase()
.includes(text)

||

(item.reason ?? "")
.toLowerCase()
.includes(text)

||

item.type
.toLowerCase()
.includes(text);





const matchesType =

!type

||

item.type === type;



return (

matchesSearch

&&

matchesType

);


});


},[
transactions,
search,
type
]);







const transactionTypes =

[

...new Set(

transactions.map(
item=>item.type
)

)

];








return (


<div

className="inventory-main-card"

style={{

background:"#111827",

borderRadius:"14px",

padding:"24px",

fontFamily:"Inter, Arial, sans-serif",

color:"#F9FAFB"

}}

>


<h2

style={{

fontSize:"22px",

fontWeight:"700",

marginBottom:"20px",

color:"#F9FAFB"

}}

>

Inventory Transaction History

</h2>








<div

style={{

display:"flex",

gap:"12px",

marginBottom:"20px",

alignItems:"center",

flexWrap:"wrap"

}}

>


<input

type="text"

placeholder="Search transaction..."

value={search}

onChange={e=>setSearch(e.target.value)}

style={{

width:"280px",

padding:"10px 12px",

border:"1px solid #374151",

borderRadius:"8px",

background:"#1F2937",

color:"#F9FAFB",

fontSize:"14px"

}}

/>








<select

value={type}

onChange={e=>setType(e.target.value)}

style={{

padding:"10px 12px",

border:"1px solid #374151",

borderRadius:"8px",

background:"#1F2937",

color:"#F9FAFB",

fontSize:"14px"

}}

>


<option value="">

All Transactions

</option>



{

transactionTypes.map(item=>(

<option

key={item}

value={item}

>

{item}

</option>

))

}


</select>


</div>









<div

style={{

overflowX:"auto"

}}

>


<table

style={{

width:"100%",

borderCollapse:"separate",

borderSpacing:"0",

fontSize:"14px"

}}

>


<thead>


<tr

style={{

background:"#1F2937",

color:"#CBD5E1"

}}

>


<th style={headerStyle}>
Date
</th>


<th style={headerStyle}>
Transaction
</th>


<th style={headerStyle}>
Reference
</th>


<th style={headerStyle}>
Quantity
</th>


<th style={headerStyle}>
Action
</th>


</tr>


</thead>







<tbody>


{

filteredTransactions.map(item=>(


<>

<tr

key={item.id}

style={{

borderBottom:"1px solid #374151",

cursor:"pointer"

}}

onClick={()=>


setSelectedTransaction(

selectedTransaction === item.id

?

null

:

item.id

)

}

>


<td style={cellStyle}>

{item.date}

</td>





<td style={cellStyle}>

{item.type}

</td>





<td style={cellStyle}>

{

item.invoice

||

item.reason

||

"-"

}

</td>





<td

style={{

...cellStyle,

fontWeight:"700",

color:

item.type.includes("OUT")

?

"#EF4444"

:

"#22C55E"

}}

>

{

item.type.includes("OUT")

?

"-"

:

"+"

}

{item.quantity}

</td>






<td

style={{

...cellStyle,

color:"#60A5FA",

fontWeight:"600"

}}

>

{

selectedTransaction === item.id

?

"Close"

:

"View"

}

</td>


</tr>








{

selectedTransaction === item.id &&

(


<tr>


<td

colSpan={5}

style={{

background:"#0F172A",

padding:"20px",

color:"#CBD5E1",

borderBottom:"1px solid #374151"

}}

>


<div

style={{

display:"grid",

gridTemplateColumns:"repeat(2,1fr)",

gap:"12px"

}}

>


<div>

<strong style={{color:"#F9FAFB"}}>
Transaction Type:
</strong>

{" "}

{item.type}

</div>




<div>

<strong style={{color:"#F9FAFB"}}>
Date:
</strong>

{" "}

{item.date}

</div>





<div>

<strong style={{color:"#F9FAFB"}}>
Quantity:
</strong>

{" "}

{item.quantity}

</div>





<div>

<strong style={{color:"#F9FAFB"}}>
Reference:
</strong>

{" "}

{item.invoice || item.reason || "-"}

</div>





<div>

<strong style={{color:"#F9FAFB"}}>
Transaction ID:
</strong>

{" "}

{item.id}

</div>


</div>


</td>


</tr>


)


}



</>

))

}





{

filteredTransactions.length===0 &&

(

<tr>

<td

colSpan={5}

style={{

padding:"25px",

textAlign:"center",

color:"#CBD5E1"

}}

>

No transactions available.

</td>

</tr>

)

}



</tbody>


</table>


</div>


</div>


);


}







const headerStyle = {

padding:"15px",

textAlign:"left" as const,

fontWeight:"700",

color:"#CBD5E1",

borderBottom:"1px solid #374151"

};




const cellStyle = {

padding:"15px",

color:"#F9FAFB",

borderBottom:"1px solid #1F2937"

};




export default InventoryTransactionHistory;