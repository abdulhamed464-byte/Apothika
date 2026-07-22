import { supabase } from "../../lib/supabase";



export interface Product {


  id?:string;


  workspace_id:string;


  product_name:string;


  description?:string;


  sku:string;


  barcode?:string;


  category?:string;


  brand?:string;


  unit?:string;


  purchase_price:number;


  selling_price:number;


  tax_rate?:number;


  minimum_stock:number;


  image_url?:string;


  track_inventory?:boolean;


  batch_required?:boolean;


  expiry_required?:boolean;


  status:string;


  created_at?:string;


  updated_at?:string;


}







export interface InventoryProduct extends Product {


  stock_entries?:{


    quantity:number;

  }[];


}








export const ProductService = {



  async getProducts(

    workspaceId:string

  ){


    const {data,error}=

      await supabase

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









  async createProduct(

    product:Product

  ){



    const skuExists =

      await this.skuExists(

        product.workspace_id,

        product.sku

      );




    if(skuExists){


      throw new Error(

        "SKU already exists"

      );


    }







    if(product.barcode){


      const barcodeExists =

        await this.barcodeExists(

          product.workspace_id,

          product.barcode

        );



      if(barcodeExists){


        throw new Error(

          "Barcode already exists"

        );


      }


    }









    const {data,error}=


      await supabase

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



    if(product.workspace_id && product.sku){



      const skuExists =

        await this.skuExistsExcept(

          product.workspace_id,

          product.sku,

          id

        );




      if(skuExists){


        throw new Error(

          "SKU already exists"

        );


      }


    }









    if(

      product.workspace_id &&

      product.barcode

    ){



      const barcodeExists =

        await this.barcodeExistsExcept(

          product.workspace_id,

          product.barcode,

          id

        );





      if(barcodeExists){


        throw new Error(

          "Barcode already exists"

        );


      }



    }









    const {data,error}=


      await supabase

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



    const {error}=


      await supabase

      .from("products")

      .delete()

      .eq(

        "id",

        id

      );





    if(error){

      throw error;

    }


  },









  async getProductCount(

    workspaceId:string

  ){


    const {count,error}=


      await supabase

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

    barcode:string

  ){


    if(!barcode.trim()){

      return false;

    }





    const {data,error}=


      await supabase

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



    return !!data;


  },









  async barcodeExistsExcept(

    workspaceId:string,

    barcode:string,

    id:string

  ){



    const {data,error}=


      await supabase

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

      .neq(

        "id",

        id

      )

      .maybeSingle();






    if(error){

      throw error;

    }



    return !!data;


  },









  async skuExists(

    workspaceId:string,

    sku:string

  ){



    if(!sku.trim()){

      return false;

    }





    const {data,error}=


      await supabase

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



    return !!data;


  },









  async skuExistsExcept(

    workspaceId:string,

    sku:string,

    id:string

  ){



    const {data,error}=


      await supabase

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

      .neq(

        "id",

        id

      )

      .maybeSingle();






    if(error){

      throw error;

    }



    return !!data;


  }


};
