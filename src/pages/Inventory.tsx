import { useEffect, useState } from "react";

import { ProductService } from "../services/inventory/ProductService";
import type {
  Product,
  InventoryProduct
} from "../services/inventory/ProductService";

import InventoryStats from "../components/inventory/InventoryStats";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryReports from "../components/inventory/InventoryReports";
import ProductForm from "../components/inventory/ProductForm";
import InventorySidePanel from "../components/inventory/InventorySidePanel";

import "../styles/inventory.css";


const WORKSPACE_ID =
  "4e24cab5-087c-4004-8d80-1098dbbe3ade";



function Inventory() {


  const [products,setProducts] =
    useState<InventoryProduct[]>([]);


  const [loading,setLoading] =
    useState(true);


  const [saving,setSaving] =
    useState(false);


  const [message,setMessage] =
    useState("");



  const [editingProduct,setEditingProduct] =
    useState<Product | null>(null);




  const [selectedProduct,setSelectedProduct] =
    useState<InventoryProduct | null>(null);





  const [productForm,setProductForm] =
    useState<any>({

      product_name:"",
      description:"",
      sku:"",
      barcode:"",
      category:"",
      brand:"",
      unit:"",
      purchase_price:"",
      selling_price:"",
      tax_rate:"0",
      minimum_stock:"",
      image_url:"",
      track_inventory:true,
      batch_required:false,
      expiry_required:false,
      status:"Active"

    });






  useEffect(()=>{

    loadProducts();

  },[]);






  async function loadProducts(){


    try{


      const data =
        await ProductService.getProducts(
          WORKSPACE_ID
        );


      setProducts(data);


    }
    catch(error){


      console.error(
        "Inventory loading failed",
        error
      );


    }
    finally{


      setLoading(false);


    }


  }







  function resetForm(){


    setProductForm({

      product_name:"",
      description:"",
      sku:"",
      barcode:"",
      category:"",
      brand:"",
      unit:"",
      purchase_price:"",
      selling_price:"",
      tax_rate:"0",
      minimum_stock:"",
      image_url:"",
      track_inventory:true,
      batch_required:false,
      expiry_required:false,
      status:"Active"

    });


    setEditingProduct(null);


  }







  function handleProductChange(

    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >

  ){


    const {
      name,
      value,
      type
    } = e.target;



    setProductForm({

      ...productForm,


      [name]:

      type === "checkbox"

      ?

      (e.target as HTMLInputElement).checked

      :

      value

    });


  }








  function prepareEdit(

    product:InventoryProduct

  ){


    setEditingProduct(product);



    setProductForm({

      product_name:product.product_name,

      description:product.description ?? "",

      sku:product.sku,

      barcode:product.barcode ?? "",

      category:product.category ?? "",

      brand:product.brand ?? "",

      unit:product.unit ?? "",

      purchase_price:product.purchase_price,

      selling_price:product.selling_price,

      tax_rate:product.tax_rate ?? 0,

      minimum_stock:product.minimum_stock,

      image_url:product.image_url ?? "",

      track_inventory:product.track_inventory ?? true,

      batch_required:product.batch_required ?? false,

      expiry_required:product.expiry_required ?? false,

      status:product.status

    });


  }








  async function handleProductSubmit(

    e:React.FormEvent

  ){


    e.preventDefault();



    try{


      setSaving(true);



      const payload = {


        ...productForm,


        workspace_id:WORKSPACE_ID,


        purchase_price:Number(
          productForm.purchase_price
        ),


        selling_price:Number(
          productForm.selling_price
        ),


        minimum_stock:Number(
          productForm.minimum_stock
        ),


        tax_rate:Number(
          productForm.tax_rate
        )

      };





      if(editingProduct?.id){


        await ProductService.updateProduct(

          editingProduct.id,

          payload

        );


        setMessage(
          "Product updated successfully"
        );


      }
      else{


        await ProductService.createProduct(

          payload

        );


        setMessage(
          "Product created successfully"
        );


      }





      resetForm();


      await loadProducts();



    }
    catch(error){


      console.error(error);


      setMessage(
        "Product operation failed"
      );


    }
    finally{


      setSaving(false);


    }


  }








  async function handleDeleteProduct(

    product:InventoryProduct

  ){


    const confirmDelete =
      window.confirm(

        `Delete ${product.product_name}?`

      );



    if(!confirmDelete){

      return;

    }



    try{


      await ProductService.deleteProduct(

        product.id!

      );


      setMessage(
        "Product deleted successfully"
      );


      await loadProducts();


    }
    catch(error){


      console.error(error);


      setMessage(
        "Delete failed"
      );


    }


  }








  function handleViewProduct(

    product:InventoryProduct

  ){


    setSelectedProduct(product);


  }








  return (

    <div className="inventory-container">


      <div className="inventory-header">


        <div>

          <h1>
            Inventory
          </h1>

          <p>
            Manage products, stock and inventory intelligence.
          </p>

        </div>


      </div>





      <InventoryStats

        products={products}

      />





      <div className="inventory-main-card">


        <h2>

          {
            editingProduct

            ?

            "Edit Product"

            :

            "Add New Product"
          }

        </h2>



        <ProductForm

          form={productForm}

          loading={saving}

          message={message}

          handleChange={handleProductChange}

          handleSubmit={handleProductSubmit}

        />


      </div>






      <div className="inventory-main-card">


        <h2>
          Product Inventory
        </h2>



        {
          loading

          ?

          <p>
            Loading inventory...
          </p>


          :

          <InventoryTable

            products={products}

            onEdit={prepareEdit}

            onDelete={handleDeleteProduct}

            onView={handleViewProduct}

          />

        }


      </div>






      <InventoryReports

        products={products}

      />






      <InventorySidePanel />





      {
        selectedProduct &&

        <div className="inventory-main-card">

          <h3>
            Product Details
          </h3>

          <p>
            Name: {selectedProduct.product_name}
          </p>

          <p>
            SKU: {selectedProduct.sku}
          </p>

          <p>
            Barcode: {selectedProduct.barcode || "-"}
          </p>

          <button

            onClick={() =>
              setSelectedProduct(null)
            }

          >

            Close

          </button>

        </div>

      }



    </div>

  );

}


export default Inventory;
