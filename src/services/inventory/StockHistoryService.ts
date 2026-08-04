import { supabase } from "../../lib/supabase";


export const StockHistoryService = {


async getProductHistory(
  productId:string
){


const {

data:stockIn,

error:stockInError

}=await supabase

.from("stock_entries")

.select("*")

.eq(
"product_id",
productId
);



if(stockInError){

throw stockInError;

}




const {

data:stockOut,

error:stockOutError

}=await supabase

.from("stock_out_entries")

.select("*")

.eq(
"product_id",
productId
);



if(stockOutError){

throw stockOutError;

}





const history = [


...(stockIn || []).map(item=>({

id:item.id,

type:"STOCK IN",

quantity:item.quantity,

date:item.entry_date,

invoice:item.invoice_number

})),


...(stockOut || []).map(item=>({

id:item.id,

type:"STOCK OUT",

quantity:item.quantity,

date:item.entry_date,

invoice:item.invoice_number

}))


];




return history.sort(

(a,b)=>

new Date(b.date).getTime()
-
new Date(a.date).getTime()

);


}


};