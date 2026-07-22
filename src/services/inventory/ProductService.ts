import { supabase } from "../../lib/supabase";


export interface Product {

  id?: string;

  workspace_id: string;

  product_name: string;

  description?: string;

  sku: string;

  barcode?: string;

  category?: string;

  brand?: string;

  unit?: string;

  purchase_price: number;

  selling_price: number;

  tax_rate?: number;

  minimum_stock: number;

  image_url?: string;

  track_inventory?: boolean;

  batch_required?: boolean;

  expiry_required?: boolean;

  status: string;

  created_at?: string;

  updated_at?: string;

}



export interface InventoryProduct extends Product {

  stock_entries?: {

    quantity:number;

  }[];

}




export const ProductService = {


  async getProducts(
    workspaceId:string
  ):Promise<InventoryProduct[]> {


    const { data,error } = await supabase

      .from("products")

      .select(`
        *,
        stock_entries(
          quantity
        )
      `)

      .eq(
        "workspace_id",
        workspaceId
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



    return data as InventoryProduct[];


  },






  async getProductById(
    id:string
  ):Promise<Product>{


    const { data,error } = await supabase

      .from("products")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();



    if(error){

      throw error;

    }



    return data as Product;


  },







  async createProduct(
    product:Product
  ):Promise<Product>{


    const { data,error } = await supabase

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

  ):Promise<Product>{



    const { data,error } = await supabase

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








  async deleteProduct(
    id:string
  ){


    const { error } = await supabase

      .from("products")

      .delete()

      .eq(
        "id",
        id
      );



    if(error){

      throw error;

    }



    return true;


  },









  async getProductCount(
    workspaceId:string
  ){


    const { count,error } = await supabase

      .from("products")

      .select(
        "*",
        {
          count:"exact",
          head:true
        }
      )

      .eq(
        "workspace_id",
        workspaceId
      );



    if(error){

      throw error;

    }



    return count ?? 0;


  },









  async barcodeExists(

    workspaceId:string,

    barcode:string,

    excludeId?:string

  ){



    if(!barcode.trim()){

      return false;

    }



    const { data,error } = await supabase

      .from("products")

      .select("id")

      .eq(
        "workspace_id",
        workspaceId
      )

      .eq(
        "barcode",
        barcode
      )

      .maybeSingle();



    if(error){

      throw error;

    }



    if(!data){

      return false;

    }



    if(
      excludeId &&
      data.id === excludeId
    ){

      return false;

    }



    return true;


  },









  async skuExists(

    workspaceId:string,

    sku:string,

    excludeId?:string

  ){



    if(!sku.trim()){

      return false;

    }



    const { data,error } = await supabase

      .from("products")

      .select("id")

      .eq(
        "workspace_id",
        workspaceId
      )

      .eq(
        "sku",
        sku
      )

      .maybeSingle();



    if(error){

      throw error;

    }



    if(!data){

      return false;

    }



    if(
      excludeId &&
      data.id === excludeId
    ){

      return false;

    }



    return true;


  }



};
