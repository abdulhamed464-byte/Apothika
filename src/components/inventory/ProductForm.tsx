import { useMemo, useState } from "react";

import type { Product } from "../../services/inventory/ProductService";

import { SKUService } from "../../services/inventory/SKUService";
import { BarcodeService } from "../../services/inventory/BarcodeService";
import ImageUploader from "../shared/ImageUploader";

import BarcodeScanner from "./BarcodeScanner";



interface Props {

  form: Product;

  loading:boolean;

  message:string;

  editing?:boolean;

  handleChange:(

    e:
    React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >

  )=>void;


  handleSubmit:(

    e:React.FormEvent

  )=>void;


  handleCancel?:()=>void;

}






function ProductForm({

  form,

  loading,

  message,

  editing=false,

  handleChange,

  handleSubmit,

  handleCancel

}:Props){



  const [showScanner,setShowScanner] =
    useState(false);





  const barcodeValid = useMemo(()=>{


    if(!form.barcode){

      return true;

    }


    return BarcodeService.validate(

      form.barcode

    );


  },[form.barcode]);







  const barcodeLabel = useMemo(()=>{


    if(!form.barcode){

      return "";

    }


    return BarcodeService.getType(

      form.barcode

    );


  },[form.barcode]);









  function updateField(

    name:string,

    value:string

  ){


    handleChange({

      target:{

        name,

        value,

        type:"text"

      }

    } as React.ChangeEvent<HTMLInputElement>);


  }








  function generateSKU(){


    const sku =

      SKUService.create(

        form.category ?? "",

        form.brand ?? ""

      );



    updateField(

      "sku",

      sku

    );


  }








  function generateBarcode(){


    const barcode =

      BarcodeService.generate();



    updateField(

      "barcode",

      barcode

    );


  }









  function handleBarcodeScan(

    barcode:string

  ){


    updateField(

      "barcode",

      barcode

    );


    setShowScanner(false);


  }









return (

<>


<form

className="product-form"

onSubmit={handleSubmit}

>





<div className="product-section">


<h3>
Product Information
</h3>


<div className="product-grid">



<div className="product-field">


<label>
Product Name
</label>


<input

name="product_name"

value={form.product_name}

onChange={handleChange}

/>


</div>





<div className="product-field">


<label>
Brand
</label>


<input

name="brand"

value={form.brand ?? ""}

onChange={handleChange}

/>


</div>





<div className="product-field">


<label>
Category
</label>


<input

name="category"

value={form.category ?? ""}

onChange={handleChange}

/>


</div>





<div className="product-field">


<label>
Unit
</label>


<input

name="unit"

value={form.unit ?? ""}

onChange={handleChange}

/>


</div>


</div>





<div className="product-field">


<label>
Description
</label>


<textarea

name="description"

value={form.description ?? ""}

onChange={handleChange}

/>


</div>


</div>









<div className="product-section">


<h3>
Product Identity
</h3>





<div className="product-grid">





<div className="product-field">


<label>
SKU
</label>




<div

style={{

display:"flex",

gap:"10px"

}}

>


<input

name="sku"

value={form.sku}

onChange={handleChange}

/>


<button

type="button"

onClick={generateSKU}

>

Generate

</button>


</div>


</div>









<div className="product-field">


<label>
Barcode
</label>



<div

style={{

display:"flex",

gap:"10px"

}}

>


<input

name="barcode"

value={form.barcode ?? ""}

onChange={handleChange}

/>





<button

type="button"

onClick={generateBarcode}

>

Generate

</button>






<button

type="button"

onClick={()=>setShowScanner(true)}

>

📷 Scan

</button>





</div>






{

form.barcode &&


<small

style={{

color:

barcodeValid

?

"#22c55e"

:

"#ef4444"

}}

>


{

barcodeValid

?

`Valid ${barcodeLabel}`

:

"Invalid barcode"

}


</small>


}





</div>




</div>


</div>









<div className="product-section">


<h3>
Pricing
</h3>



<div className="product-grid">



<div className="product-field">


<label>
Purchase Price
</label>


<input

type="number"

name="purchase_price"

value={form.purchase_price}

onChange={handleChange}

/>


</div>






<div className="product-field">


<label>
Selling Price
</label>


<input

type="number"

name="selling_price"

value={form.selling_price}

onChange={handleChange}

/>


</div>






<div className="product-field">


<label>
Tax Rate %
</label>


<input

type="number"

name="tax_rate"

value={form.tax_rate}

onChange={handleChange}

/>


</div>


</div>


</div>









<div className="product-section">


<h3>
Inventory Control
</h3>




<div className="product-field">


<label>
Minimum Stock
</label>


<input

type="number"

name="minimum_stock"

value={form.minimum_stock}

onChange={handleChange}

/>


</div>






<div className="checkbox-group">


<label>

<input

type="checkbox"

name="track_inventory"

checked={form.track_inventory}

onChange={handleChange}

/>

Track Inventory

</label>





<label>

<input

type="checkbox"

name="batch_required"

checked={form.batch_required}

onChange={handleChange}

/>

Batch Tracking

</label>





<label>

<input

type="checkbox"

name="expiry_required"

checked={form.expiry_required}

onChange={handleChange}

/>

Expiry Tracking

</label>



</div>


</div>



<div className="product-section">


<h3>
Product Image
</h3>


<ImageUploader

value={form.image_url ?? ""}

onChange={(url)=>{

  updateField(

    "image_url",

    url

  );

}}

/>


</div>


<div className="product-section">


<h3>
Status
</h3>


<select

name="status"

value={form.status}

onChange={handleChange}

>


<option value="Active">

Active

</option>



<option value="Inactive">

Inactive

</option>



</select>


</div>








<div

style={{

display:"flex",

gap:"12px"

}}

>


<button

className="product-button"

disabled={loading}

>


{

loading

?

"Saving..."

:

editing

?

"Update Product"

:

"Create Product"

}


</button>






{

editing &&

<button

type="button"

onClick={handleCancel}

>

Cancel

</button>

}



</div>







{

message &&

<p className="product-message">

{message}

</p>


}



</form>







{

showScanner &&


<BarcodeScanner

onScan={handleBarcodeScan}

onClose={()=>setShowScanner(false)}

/>


}



</>

);


}



export default ProductForm;
