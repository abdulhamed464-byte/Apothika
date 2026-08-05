import { supabase } from "../../lib/supabase";


export interface Product {

  id?: string;

  business_id?: string;

  workspace_id:string;

  product_name:string;

  description?:string | null;

  sku:string;

  barcode?:string | null;

  category?:string | null;

  brand?:string | null;

  unit?:string | null;

  purchase_price:number;

  selling_price:number;

  tax_rate?:number;

  minimum_stock:number;

  image_url?:string | null;

  track_inventory?:boolean;

  batch_required?:boolean;

  expiry_required?:boolean;

  status:string;

  created_at?:string;

  updated_at?:string;

}



export interface InventoryProduct extends Product {


  stock_entries?: {

    quantity:number | null;

  }[];



  stock_out_entries?: {

    quantity:number | null;

  }[];



  stock_adjustments?: {

    quantity:number | null;

    adjustment_type:"ADD"|"REMOVE";

  }[];


}





export const ProductService = {



async getProducts(

  workspaceId:string

):Promise<InventoryProduct[]> {



const {

  data,

  error

}=await supabase


.from("products")


.select(`

  *,

  stock_entries(

    quantity

  ),


  stock_out_entries(

    quantity

  )

`)


.eq(

  "workspace_id",

  workspaceId

)

.eq(

  "status",

  "Active"

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





const productIds =

(data ?? [])

.map(

product => product.id

)

.filter(Boolean);







const {

  data:adjustments,

  error:adjustmentError

}=await supabase


.from("stock_adjustments")


.select(`

  product_id,

  quantity,

  adjustment_type

`)


.in(

  "product_id",

  productIds

);





if(adjustmentError){

  throw adjustmentError;

}







const productsWithAdjustments =

(data ?? [])

.map(product => ({


  ...product,


  stock_adjustments:

  (adjustments ?? [])

  .filter(

    adjustment =>

    adjustment.product_id === product.id

  )


}));






return productsWithAdjustments as InventoryProduct[];



},







async createProduct(

product:Product

){



const {

data,

error

}=await supabase


.from("products")


.insert(product)


.select()


.single();





if(error){

throw error;

}



return data as Product;



},







async updateProduct(

id:string,

product:Partial<Product>

){



const {

data,

error

}=await supabase


.from("products")


.update(product)


.eq(

"id",

id

)


.select()


.single();





if(error){

throw error;

}



return data as Product;



},







async archiveProduct(

id:string

){



const {

error

}=await supabase


.from("products")


.update({

status:"Archived"

})


.eq(

"id",

id

);





if(error){

throw error;

}



},







async restoreProduct(

id:string

){



const {

error

}=await supabase


.from("products")


.update({

status:"Active"

})


.eq(

"id",

id

);





if(error){

throw error;

}



},







async deleteProduct(

id:string

){



const {

error

}=await supabase


.from("products")


.delete()


.eq(

"id",

id

);





if(error){

throw error;

}



}



};