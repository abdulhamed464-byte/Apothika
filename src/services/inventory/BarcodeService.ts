import { supabase } from "../../lib/supabase";

import {
  isValidBarcode,
  barcodeType
} from "../../utils/barcode/barcodeValidator";


export const BarcodeService = {


  /**
   * Validate barcode format
   */
  validate(
    barcode:string
  ) {

    return isValidBarcode(
      barcode
    );

  },



  /**
   * Detect barcode type
   */
  getType(
    barcode:string
  ) {

    return barcodeType(
      barcode
    );

  },



  /**
   * Generate internal barcode
   * Used when business does not have existing barcode
   */
  generate() {


    const prefix = "890";


    const random =

      Math.floor(

        100000000 +

        Math.random() *

        900000000

      );



    return `${prefix}${random}`;

  },



  /**
   * Check duplicate barcode
   */
  async checkDuplicate(

    barcode:string,

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
        "barcode",
        barcode
      )

      .maybeSingle();



    if(error){

      throw error;

    }


    return data;

  },



  /**
   * Find product using barcode
   */
  async findProduct(

    barcode:string,

    workspaceId:string

  ) {


    const { data,error } = await supabase

      .from("products")

      .select("*")

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


    return data;

  }


};