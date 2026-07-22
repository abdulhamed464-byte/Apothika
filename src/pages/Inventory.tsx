import { useEffect, useMemo, useState } from "react";

import { ProductService } from "../services/inventory/ProductService";
import BarcodeLabel from "../components/inventory/BarcodeLabel";


import type {
  Product,
  InventoryProduct
} from "../services/inventory/ProductService";


import InventoryStats from "../components/inventory/InventoryStats";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryReports from "../components/inventory/InventoryReports";
import ProductForm from "../components/inventory/ProductForm";
import InventorySidePanel from "../components/inventory/InventorySidePanel";
import SearchFilterBar from "../components/shared/SearchFilterBar";
import InventoryScannerButton from "../components/inventory/InventoryScannerButton";


import "../styles/inventory.css";



const WORKSPACE_ID =
  "4e24cab5-087c-4004-8d80-1098dbbe3ade";



function Inventory(){


  const [products,setProducts] =
    useState<InventoryProduct[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [saving,setSaving] =
    useState(false);



  const [message,setMessage] =
    useState("");



  const [editingProduct,setEditingProduct] =
    useState<Product|null>(null);



  const [selectedProduct,setSelectedProduct] =
    useState<InventoryProduct|null>(null);





  const [search,setSearch] =
    useState("");



  const [category,setCategory] =
    useState("");



  const [brand,setBrand] =
    useState("");



  const [stockStatus,setStockStatus] =
    useState("");





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

      console.error(error);

    }
    finally{

      setLoading(false);

    }

  }







  const categories =
    useMemo(()=>[

      ...new Set(

        products

        .map(product=>product.category)

        .filter(Boolean)

      )

    ] as string[],[products]);






  const brands =
    useMemo(()=>[

      ...new Set(

        products

        .map(product=>product.brand)

        .filter(Boolean)

      )

    ] as string[],[products]);







  const filteredProducts =

    useMemo(()=>{


      return products.filter(product=>{


        const text =
          search.toLowerCase();



        const matchesSearch =

          !text ||

          product.product_name
          .toLowerCase()
          .includes(text)

          ||

          product.sku
          .toLowerCase()
          .includes(text)

          ||

          (product.barcode ?? "")
          .toLowerCase()
          .includes(text);





        const matchesCategory =

          !category ||

          product.category === category;




        const matchesBrand =

          !brand ||

          product.brand === brand;





        const stock =

          product.stock_entries?.reduce(

            (total,entry)=>

              total + Number(entry.quantity || 0),

            0

          ) || 0;




        const matchesStock =

          stockStatus === ""

          ?

          true

          :

          stockStatus === "low"

          ?

          stock <= Number(product.minimum_stock)

          :

          stock > Number(product.minimum_stock);





        return (

          matchesSearch &&

          matchesCategory &&

          matchesBrand &&

          matchesStock

        );


      });


    },[

      products,

      search,

      category,

      brand,

      stockStatus

    ]);









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

      type==="checkbox"

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

      ...product

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


      setEditingProduct(null);

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


    if(!window.confirm(

      `Delete ${product.product_name}?`

    )) return;



    await ProductService.deleteProduct(

      product.id!

    );


    await loadProducts();

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



        <InventoryScannerButton

          workspaceId={WORKSPACE_ID}

          onProductFound={(product)=>{

            setSelectedProduct(product);

          }}

        />


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

          editing={!!editingProduct}

          handleChange={handleProductChange}

          handleSubmit={handleProductSubmit}

          handleCancel={()=>{

            setEditingProduct(null);

          }}

        />


      </div>







      <div className="inventory-main-card">


        <SearchFilterBar

          search={search}

          setSearch={setSearch}

          category={category}

          setCategory={setCategory}

          brand={brand}

          setBrand={setBrand}

          stockStatus={stockStatus}

          setStockStatus={setStockStatus}

          categories={categories}

          brands={brands}

        />





        {

          loading

          ?

          <p>
            Loading...
          </p>


          :


          <InventoryTable

            products={filteredProducts}

            onEdit={prepareEdit}

            onDelete={handleDeleteProduct}

            onView={setSelectedProduct}

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

    {
      selectedProduct.barcode &&

      <BarcodeLabel

        productName={selectedProduct.product_name}

        sku={selectedProduct.sku}

        barcode={selectedProduct.barcode}

        sellingPrice={selectedProduct.selling_price}

      />

    }

    <button
      onClick={()=>setSelectedProduct(null)}
    >
      Close
    </button>

  </div>
}


    </div>

  );

}


export default Inventory;

