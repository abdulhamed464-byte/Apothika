import { supabase } from "../../lib/supabase";

import type {
  StockEntry,
  StockInPayload
} from "../../types/stock";

import { BatchService } from "./BatchService";



export const StockService = {



async stockIn(

  payload: StockInPayload

): Promise<StockEntry> {



  /*
    Check product batch requirement first
  */


  const {

    data:product,

    error:productError

  } = await supabase


    .from("products")


    .select(`

      batch_required,

      expiry_required

    `)


    .eq(

      "id",

      payload.product_id

    )


    .single();




  if(productError){

    throw productError;

  }




  /*
    Validate batch information
    before creating stock entry
  */


  if(product?.batch_required){


    if(!payload.batch_number){

      throw new Error(

        "Batch number is required for this product"

      );

    }



    if(

      product.expiry_required &&

      !payload.expiry_date

    ){

      throw new Error(

        "Expiry date is required for this product"

      );

    }


  }






  /*
    Create Stock Entry
  */


  const {

    data,

    error

  } = await supabase


    .from("stock_entries")


    .insert({


      business_id:

        payload.business_id,


      supplier_id:

        payload.supplier_id ?? null,


      product_id:

        payload.product_id,


      quantity:

        payload.quantity,


      purchase_price:

        payload.purchase_price,


      invoice_number:

        payload.invoice_number ?? null,


      entry_date:

        payload.entry_date ??

        new Date()

          .toISOString()

          .split("T")[0]


    })


    .select()


    .single();




  if(error){

    throw error;

  }






  /*
    Create Batch
  */


  if(product?.batch_required){



    await BatchService.createBatch({


      business_id:

        payload.business_id,


      product_id:

        payload.product_id,


      stock_entry_id:

        data.id,


      batch_number:

        payload.batch_number!,


      manufacturing_date:

        payload.manufacturing_date,


      expiry_date:

        payload.expiry_date,


      quantity_received:

        payload.quantity,


      purchase_price:

        payload.purchase_price


    });


  }




  return data as StockEntry;



},







async getAllStockEntries(

  businessId:string

):Promise<StockEntry[]> {



const {

data,

error

}=await supabase


.from("stock_entries")


.select("*")


.eq(

"business_id",

businessId

)


.order(

"created_at",

{

ascending:false

}

);




if(error){

throw error;

}



return (

data ??

[]

) as StockEntry[];



},






calculateCurrentStock(

  product:any

):number {


  const stockIn =

    product.stock_entries?.reduce(

      (

        total:number,

        item:any

      ) =>

        total + Number(item.quantity || 0),

      0

    ) || 0;



  const stockOut =

    product.stock_out_entries?.reduce(

      (

        total:number,

        item:any

      ) =>

        total + Number(item.quantity || 0),

      0

    ) || 0;



  const adjustmentAdd =

    product.stock_adjustments

    ?.filter(

      (item:any)=>

        item.adjustment_type === "ADD"

    )

    .reduce(

      (

        total:number,

        item:any

      ) =>

        total + Number(item.quantity || 0),

      0

    ) || 0;




  const adjustmentRemove =

    product.stock_adjustments

    ?.filter(

      (item:any)=>

        item.adjustment_type === "REMOVE"

    )

    .reduce(

      (

        total:number,

        item:any

      ) =>

        total + Number(item.quantity || 0),

      0

    ) || 0;



  return (

    stockIn

    - stockOut

    + adjustmentAdd

    - adjustmentRemove

  );


},






calculateInventoryValue(

  product:any

):number {


  const stock =

    StockService.calculateCurrentStock(

      product

    );



  return (

    stock *

    Number(

      product.purchase_price || 0

    )

  );


},





isLowStock(

  product:any

):boolean {


  const stock =

    StockService.calculateCurrentStock(

      product

    );



  return (

    stock > 0 &&

    stock <=

    Number(

      product.minimum_stock || 0

    )

  );


},





isOutOfStock(

  product:any

):boolean {


  return (

    StockService.calculateCurrentStock(

      product

    ) <= 0

  );


},

getStockStatus(
  product:any
):"OUT_OF_STOCK" | "LOW_STOCK" | "IN_STOCK" {

  if (StockService.isOutOfStock(product)) {
    return "OUT_OF_STOCK";
  }

  if (StockService.isLowStock(product)) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";

}


};