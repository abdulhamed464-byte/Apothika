import { useState } from "react";

import BarcodeScanner from "./BarcodeScanner";

import type {
  InventoryProduct
} from "../../services/inventory/ProductService";



interface Props {


  workspaceId:string;


  onProductFound:(

    product:InventoryProduct

  )=>void;


}





function InventoryScannerButton({

  workspaceId,

  onProductFound

}:Props){



  const [open,setOpen] =

    useState(false);







  return (

    <>

      <button

        onClick={()=>setOpen(true)}

        style={{

          padding:"12px 18px",

          borderRadius:"12px",

          border:"none",

          background:"#10b981",

          color:"white",

          cursor:"pointer",

          fontWeight:600

        }}

      >

        📷 Scan Product

      </button>







      {

        open &&


        <BarcodeScanner


          workspaceId={workspaceId}



          onProductFound={(product)=>{


            onProductFound(product);


            setOpen(false);


          }}



          onClose={()=>{


            setOpen(false);


          }}


        />


      }


    </>

  );

}



export default InventoryScannerButton;
