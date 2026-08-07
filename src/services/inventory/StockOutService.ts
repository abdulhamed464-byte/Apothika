import { supabase } from "../../lib/supabase";

import type { StockOutPayload } from "../../types/stockOut";


export const StockOutService = {


  async createStockOut(

    payload: StockOutPayload

  ){


    /*
      Find available batches
    */

    const {

      data:batches,

      error:batchFetchError

    } = await supabase

      .from("inventory_batches")

      .select("*")

      .eq(

        "product_id",

        payload.product_id

      )

      .eq(

        "status",

        "ACTIVE"

      )

      .gt(

        "quantity_available",

        0

      )

      .order(

        "created_at",

        {
          ascending:true
        }

      );



    if(batchFetchError){

      throw batchFetchError;

    }



    let remainingQuantity =
      payload.quantity;



    /*
      Reduce batch quantities FIFO
    */


    for(const batch of batches ?? []){


      if(remainingQuantity <= 0){

        break;

      }


      const deductQuantity = Math.min(

        remainingQuantity,

        Number(batch.quantity_available)

      );



      const updatedQuantity =

        Number(batch.quantity_available)

        -

        deductQuantity;



      const {

        error:updateError

      } = await supabase

        .from("inventory_batches")

        .update({

          quantity_available:
            updatedQuantity

        })

        .eq(

          "id",

          batch.id

        );



      if(updateError){

        throw updateError;

      }



      remainingQuantity -= deductQuantity;


    }



    if(remainingQuantity > 0){

      throw new Error(

        "Insufficient batch quantity"

      );

    }





    /*
      Create stock out transaction
    */


    const {

      data,

      error

    } = await supabase

      .from("stock_out_entries")

      .insert({

        business_id:

          payload.business_id,


        product_id:

          payload.product_id,


        quantity:

          payload.quantity,


        selling_price:

          payload.selling_price,


        customer_id:

          payload.customer_id ?? null,


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



    return data;


  }


};