import { useEffect, useState } from "react";

import { StockService } from "../services/inventory/StockService";

import type {
  StockEntry
} from "../types/stock";



export function useStock(

  businessId:string

){



  const [

    entries,

    setEntries

  ] = useState<StockEntry[]>([]);



  const [

    loading,

    setLoading

  ] = useState(true);





  async function loadStock(){


    try{


      setLoading(true);



      const data =

        await StockService

        .getAllStockEntries(

          businessId

        );



      setEntries(data);



    }

    catch(error){

      console.error(

        "Stock loading error",

        error

      );

    }

    finally{

      setLoading(false);

    }


  }







  useEffect(()=>{


    if(businessId){

      loadStock();

    }


  },[businessId]);








  return {


    entries,


    loading,


    refreshStock:

      loadStock


  };


}