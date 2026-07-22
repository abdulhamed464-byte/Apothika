import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader
} from "@zxing/browser";

import type {
  IScannerControls
} from "@zxing/browser";

interface Props {

  onScan: (
    barcode:string
  ) => void;

  onClose:() => void;

}



function BarcodeScanner({

  onScan,

  onClose

}:Props){


  const videoRef =
    useRef<HTMLVideoElement | null>(null);


  const controlsRef =
    useRef<IScannerControls | null>(null);


  const [error,setError] =
    useState("");



  useEffect(()=>{


    const codeReader =
      new BrowserMultiFormatReader();



    async function startScanner(){


      try{


        const devices =
          await BrowserMultiFormatReader.listVideoInputDevices();



        if(devices.length === 0){

          setError(
            "No camera found"
          );

          return;

        }



        const selectedDevice =
          devices[0].deviceId;



        controlsRef.current =
          await codeReader.decodeFromVideoDevice(

            selectedDevice,

            videoRef.current!,

            (result)=>{


              if(result){


                const value =
                  result.getText();



                onScan(value);



                stopScanner();


              }


            }

          );



      }
      catch(error){

        console.error(
          "Barcode scanner error",
          error
        );


        setError(
          "Camera permission denied"
        );


      }


    }




    startScanner();



    return ()=>{

      stopScanner();

    };


  },[]);





  function stopScanner(){


    if(
      controlsRef.current
    ){

      controlsRef.current.stop();

      controlsRef.current = null;

    }


  }





  return (

    <div
      style={{
        position:"fixed",
        inset:0,
        background:"rgba(0,0,0,.75)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
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
            borderRadius:"15px",
            marginTop:"15px"
          }}

        />



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

          onClick={()=>{

            stopScanner();

            onClose();

          }}

          style={{
            marginTop:"15px",
            width:"100%",
            padding:"12px",
            borderRadius:"12px",
            border:"none",
            background:"#10b981",
            color:"white",
            cursor:"pointer"
          }}

        >

          Close Scanner

        </button>


      </div>


    </div>

  );

}



export default BarcodeScanner;