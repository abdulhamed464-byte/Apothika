import { useEffect, useRef, useState } from "react";

import {
  BrowserMultiFormatReader
} from "@zxing/browser";

import type {
  IScannerControls
} from "@zxing/browser";

import {
  BarcodeLookupService
} from "../../services/inventory/BarcodeLookupService";

import type {
  InventoryProduct
} from "../../services/inventory/ProductService";



interface Props {


  workspaceId?:string;


  onScan?:(
    barcode:string
  )=>void;


  onProductFound?:(
    product:InventoryProduct
  )=>void;


  onClose:()=>void;


}





function BarcodeScanner({

  workspaceId,

  onScan,

  onProductFound,

  onClose

}:Props){



  const videoRef =
    useRef<HTMLVideoElement | null>(null);



  const controlsRef =
    useRef<IScannerControls | null>(null);



  const [error,setError] =
    useState("");



  const [message,setMessage] =
    useState("");



  const [locked,setLocked] =
    useState(false);






  useEffect(()=>{


    const reader =
      new BrowserMultiFormatReader();





    async function start(){


      try{


        const devices =

          await BrowserMultiFormatReader
          .listVideoInputDevices();





        if(!devices.length){


          setError(
            "No camera found"
          );


          return;


        }






        controlsRef.current =

          await reader.decodeFromVideoDevice(

            devices[0].deviceId,

            videoRef.current!,

            async(result)=>{


              if(result && !locked){



                setLocked(true);



                const barcode =

                  result.getText();





                // Keep old ProductForm support

                if(onScan){


                  onScan(barcode);


                  stopScanner();

                  return;


                }





                // New lookup support

                if(

                  workspaceId &&

                  onProductFound

                ){


                  setMessage(

                    "Searching product..."

                  );



                  const product =

                    await BarcodeLookupService
                    .findByBarcode(

                      workspaceId,

                      barcode

                    );




                  if(product){


                    onProductFound(

                      product

                    );


                  }
                  else{


                    setMessage(

                      "Product not found"

                    );


                    setLocked(false);


                  }


                }


              }


            }

          );


      }
      catch(error){


        console.error(error);


        setError(

          "Camera permission denied"

        );


      }


    }





    start();





    return ()=>{


      stopScanner();


    };


  },[locked]);







  function stopScanner(){



    if(controlsRef.current){


      controlsRef.current.stop();


      controlsRef.current=null;


    }


  }








  function close(){


    stopScanner();


    onClose();


  }






  return (

    <div

      style={{

        position:"fixed",

        inset:0,

        background:"rgba(0,0,0,.75)",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        zIndex:2000

      }}

    >


      <div

        style={{

          background:"#111827",

          padding:"25px",

          borderRadius:"20px",

          width:"420px",

          color:"white"

        }}

      >


        <h2>

          Scan Barcode

        </h2>




        <video

          ref={videoRef}

          style={{

            width:"100%",

            borderRadius:"15px"

          }}

        />




        {

          message &&

          <p>

            {message}

          </p>

        }




        {

          error &&

          <p

            style={{

              color:"#ef4444"

            }}

          >

            {error}

          </p>

        }




        <button

          onClick={close}

          style={{

            marginTop:"15px",

            width:"100%",

            padding:"12px",

            background:"#10b981",

            color:"white",

            border:"none",

            borderRadius:"12px"

          }}

        >

          Close Scanner

        </button>


      </div>


    </div>

  );

}



export default BarcodeScanner;
