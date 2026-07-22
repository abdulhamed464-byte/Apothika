import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";


interface Props {

  productName:string;

  sku:string;

  barcode:string;

  sellingPrice?:number;

}



function BarcodeLabel({

  productName,

  sku,

  barcode,

  sellingPrice

}:Props){


  const barcodeRef =
    useRef<SVGSVGElement | null>(null);





  useEffect(()=>{


    if(

      barcodeRef.current &&

      barcode

    ){

      JsBarcode(

        barcodeRef.current,

        barcode,

        {

          format:"CODE128",

          displayValue:true,

          width:2,

          height:60,

          fontSize:14

        }

      );

    }


  },[barcode]);







  function printLabel(){


    window.print();


  }







  return (

    <div

      style={{

        width:"300px",

        background:"#ffffff",

        color:"#000000",

        padding:"20px",

        borderRadius:"12px",

        border:"1px solid #ddd",

        textAlign:"center"

      }}

    >


      <h3>

        {productName}

      </h3>



      <p>

        SKU: {sku}

      </p>





      <svg

        ref={barcodeRef}

      />





      {

        sellingPrice !== undefined &&


        <p>

          Price: ₹{sellingPrice}

        </p>

      }






      <button

        onClick={printLabel}

        style={{

          marginTop:"15px",

          padding:"10px 20px",

          background:"#10b981",

          color:"white",

          border:"none",

          borderRadius:"10px",

          cursor:"pointer"

        }}

      >

        Print Label

      </button>


    </div>

  );

}



export default BarcodeLabel;
