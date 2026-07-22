import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


interface Props {

    purchase:any;

    onClose:()=>void;

}



function PurchaseDetails({

    purchase,

    onClose

}:Props){



if(!purchase){

    return null;

}







function exportExcel(){


const rows = [

    {
        Product:"",
        Quantity:"",
        Price:"",
        Amount:""
    },

    ...(purchase.purchase_items || []).map(
        (item:any)=>({

            Product:
            item.products?.product_name || "",

            Quantity:
            item.quantity,

            Price:
            item.purchase_price,

            Amount:
            Number(item.quantity) *
            Number(item.purchase_price)

        })
    ),


    {
        Product:"Grand Total",

        Quantity:"",

        Price:"",

        Amount:
        purchase.total_amount

    }

];



const worksheet =
XLSX.utils.json_to_sheet(rows);



const workbook =
XLSX.utils.book_new();



XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Purchase Invoice"

);



XLSX.writeFile(

    workbook,

    `purchase-${purchase.invoice_number}.xlsx`

);



}


















function downloadPDF(){


const doc =
new jsPDF();



doc.setFontSize(18);


doc.text(

"APOTHIKA ERP",

14,

20

);



doc.setFontSize(12);


doc.text(

`Purchase Invoice : ${purchase.invoice_number}`,

14,

35

);



doc.text(

`Supplier : ${purchase.suppliers?.supplier_name || ""}`,

14,

45

);



doc.text(

`Date : ${purchase.purchase_date}`,

14,

55

);





autoTable(doc,{

startY:70,


head:[

[

"Product",

"Qty",

"Price",

"Total"

]

],


body:

purchase.purchase_items?.map(

(item:any)=>

[

item.products?.product_name || "",

item.quantity,

`₹${item.purchase_price}`,

`₹${item.quantity * item.purchase_price}`

]

)

});




doc.save(

`purchase-${purchase.invoice_number}.pdf`

);



}


function printInvoice(){


window.print();


}











return(


<div className="purchase-details-overlay">


<div className="purchase-details-card">





<div className="purchase-details-header">


<div>


<p className="invoice-brand">

APOTHIKA ERP

</p>


<h2>

Purchase Invoice

</h2>


<p>

Invoice:

<strong>

{purchase.invoice_number}

</strong>

</p>


</div>





<div className="invoice-actions">


<button

className="small-action pdf"

onClick={downloadPDF}

>

PDF

</button>



<button

className="small-action excel"

onClick={exportExcel}

>

Excel

</button>



<button

className="small-action print"

onClick={printInvoice}

>

Print

</button>



<button

className="close-btn"

onClick={onClose}

>

✕

</button>


</div>




</div>









<div className="supplier-box">


<h3>

Supplier

</h3>


<p>

<strong>

{purchase.suppliers?.supplier_name || "-"}

</strong>

</p>


<p>

{purchase.suppliers?.mobile || "-"}

</p>


<p>

GST:
{purchase.suppliers?.gst_number || "-"}

</p>



</div>









<div className="purchase-summary-box">


<div>

<span>

Date

</span>


<strong>

{purchase.purchase_date}

</strong>


</div>



<div>

<span>

Status

</span>


<strong>

{purchase.payment_status}

</strong>


</div>



<div>

<span>

Total

</span>


<strong>

₹
{Number(
purchase.total_amount
).toLocaleString()}

</strong>


</div>


</div>









<h3 className="items-title">

Items

</h3>




<table className="purchase-items-table">


<thead>


<tr>


<th>

Product

</th>


<th>

Qty

</th>


<th>

Price

</th>


<th>

Amount

</th>


</tr>


</thead>




<tbody>


{

purchase.purchase_items?.map(

(item:any)=>(


<tr key={item.id}>


<td>

{item.products?.product_name || "-"}

</td>



<td>

{item.quantity}

</td>



<td>

₹{item.purchase_price}

</td>



<td>

₹
{
Number(item.quantity) *
Number(item.purchase_price)
}

</td>


</tr>


)


)

}



</tbody>


</table>









<div className="purchase-total-box">


<span>

Grand Total

</span>


<h1>

₹
{
Number(
purchase.total_amount
)
.toLocaleString()

}

</h1>


</div>








</div>


</div>


);


}


export default PurchaseDetails;