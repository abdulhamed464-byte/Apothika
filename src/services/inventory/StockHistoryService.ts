import { supabase } from "../../lib/supabase";


export interface InventoryTransaction {

  id:string;

  type:string;

  quantity:number;

  date:string;

  invoice?:string | null;

  reason?:string | null;

}




export const StockHistoryService = {




async getProductHistory(

productId:string

):Promise<InventoryTransaction[]> {



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





const {

data:adjustments,

error:adjustmentError

}=await supabase

.from("stock_adjustments")

.select("*")

.eq(
"product_id",
productId
);



if(adjustmentError){

throw adjustmentError;

}





const history:InventoryTransaction[] = [



...(stockIn || []).map(item=>({

id:item.id,

type:"STOCK IN",

quantity:item.quantity,

date:item.entry_date,

invoice:item.invoice_number ?? null

})),





...(stockOut || []).map(item=>({

id:item.id,

type:"STOCK OUT",

quantity:item.quantity,

date:item.entry_date,

invoice:item.invoice_number ?? null

})),





...(adjustments || []).map(item=>({

id:item.id,

type:

item.adjustment_type === "ADD"

?

"ADJUSTMENT ADD"

:

"ADJUSTMENT REMOVE",

quantity:item.quantity,

date:item.created_at,

reason:item.reason ?? null

}))



];





return history.sort(

(a,b)=>

new Date(b.date).getTime()

-

new Date(a.date).getTime()

);



},







async getAllTransactions(

businessId:string

):Promise<InventoryTransaction[]> {



const {

data:stockIn,

error:stockInError

}=await supabase

.from("stock_entries")

.select("*")

.eq(

"business_id",

businessId

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

"business_id",

businessId

);



if(stockOutError){

throw stockOutError;

}





const {

data:adjustments,

error:adjustmentError

}=await supabase

.from("stock_adjustments")

.select("*")

.eq(

"business_id",

businessId

);



if(adjustmentError){

throw adjustmentError;

}





const history:InventoryTransaction[] = [



...(stockIn || []).map(item=>({

id:item.id,

type:"STOCK IN",

quantity:item.quantity,

date:item.entry_date,

invoice:item.invoice_number ?? null

})),





...(stockOut || []).map(item=>({

id:item.id,

type:"STOCK OUT",

quantity:item.quantity,

date:item.entry_date,

invoice:item.invoice_number ?? null

})),





...(adjustments || []).map(item=>({

id:item.id,

type:

item.adjustment_type === "ADD"

?

"ADJUSTMENT ADD"

:

"ADJUSTMENT REMOVE",

quantity:item.quantity,

date:item.created_at,

reason:item.reason ?? null

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