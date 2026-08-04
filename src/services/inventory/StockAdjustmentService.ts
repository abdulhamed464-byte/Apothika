import { supabase } from "../../lib/supabase";

import type {
StockAdjustmentPayload
}
from "../../types/stockAdjustment";


export const StockAdjustmentService = {


async createAdjustment(
payload:StockAdjustmentPayload
){


const {
data,
error
}=await supabase

.from("stock_adjustments")

.insert({

business_id:
payload.business_id,

product_id:
payload.product_id,

quantity:
payload.quantity,

adjustment_type:
payload.adjustment_type,

reason:
payload.reason ?? null

})

.select()

.single();



if(error){

throw error;

}


return data;


}


};
