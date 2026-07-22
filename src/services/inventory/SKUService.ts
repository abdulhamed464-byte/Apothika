import {
  generateSKU
} from "../../utils/barcode/skuGenerator";

import { supabase } from "../../lib/supabase";


export const SKUService = {


  /**
   * Generate SKU
   */
  generate(
    category:string,
    brand:string
  ) {

    return generateSKU(
      category,
      brand
    );

  },


  /**
   * Alias for UI components
   * Keeps ProductForm simple
   */
  create(
    category:string,
    brand:string
  ) {

    return this.generate(
      category,
      brand
    );

  },



  /**
   * Check duplicate SKU
   */
  async checkDuplicate(

    sku:string,

    workspaceId:string

  ) {


    const { data,error } = await supabase

      .from("products")

      .select(
        "id,product_name"
      )

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


    return data;

  },



  /**
   * Generate unique SKU
   */
  async generateUnique(

    category:string,

    brand:string,

    workspaceId:string

  ) {


    let sku = "";

    let exists = true;



    while(exists){


      sku = this.generate(

        category,

        brand

      );



      const duplicate =

        await this.checkDuplicate(

          sku,

          workspaceId

        );



      exists = !!duplicate;


    }



    return sku;


  }



};