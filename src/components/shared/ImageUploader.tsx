import { useState } from "react";

import { supabase } from "../../lib/supabase";


interface Props {

  value:string;

  onChange:(url:string)=>void;

}



function ImageUploader({

  value,

  onChange

}:Props){


  const [uploading,setUploading] =
    useState(false);



  async function uploadImage(

    e:React.ChangeEvent<HTMLInputElement>

  ){


    const file =
      e.target.files?.[0];


    if(!file){

      return;

    }



    try{


      setUploading(true);



      const fileName =

        `${Date.now()}-${file.name}`;




      const {

        data,

        error

      } = await supabase.storage

        .from("product-images")

        .upload(

          fileName,

          file

        );




      if(error){

        throw error;

      }




      const {

        data:urlData

      } = supabase.storage

        .from("product-images")

        .getPublicUrl(

          data.path

        );




      onChange(

        urlData.publicUrl

      );


    }
    catch(error){


      console.error(

        "Image upload failed",

        error

      );


    }
    finally{


      setUploading(false);


    }


  }







  return (

    <div>


      <input

        type="file"

        accept="image/*"

        onChange={uploadImage}

      />



      {
        uploading &&

        <p>
          Uploading image...
        </p>

      }



      {
        value &&

        <img

          src={value}

          alt="Product"

          style={{

            width:"120px",

            height:"120px",

            objectFit:"cover",

            borderRadius:"12px",

            marginTop:"10px"

          }}

        />

      }



    </div>

  );


}


export default ImageUploader;
