import { useEffect, useState } from "react";

import { ProductService } from "../services/inventory/ProductService";
import type { Product } from "../services/inventory/ProductService";

import InventoryStats from "../components/inventory/InventoryStats";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryReports from "../components/inventory/InventoryReports";
import ProductForm from "../components/inventory/ProductForm";
import InventorySidePanel from "../components/inventory/InventorySidePanel";

import "../styles/inventory.css";


function Inventory() {


  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");



  const [productForm, setProductForm] = useState<any>({

    product_name: "",
    description: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    unit: "",
    purchase_price: "",
    selling_price: "",
    tax_rate: "0",
    minimum_stock: "",
    image_url: "",
    track_inventory: true,
    batch_required: false,
    expiry_required: false,
    status: "Active"

  });



  useEffect(() => {

    loadProducts();

  }, []);




  async function loadProducts() {

    try {


      const workspaceId =
        "4e24cab5-087c-4004-8d80-1098dbbe3ade";


      const data =
        await ProductService.getProducts(workspaceId);


      setProducts(data);


    } catch(error) {


      console.error(
        "Inventory loading failed",
        error
      );


    } finally {


      setLoading(false);


    }

  }





  function handleProductChange(

    e: React.ChangeEvent<

      HTMLInputElement |

      HTMLSelectElement |

      HTMLTextAreaElement

    >

  ) {


    const {name,value,type} = e.target;


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






  async function handleProductSubmit(

    e: React.FormEvent

  ) {


    e.preventDefault();


    try {


      setSaving(true);



      await ProductService.createProduct({


        ...productForm,


        workspace_id:
          "4e24cab5-087c-4004-8d80-1098dbbe3ade",


        purchase_price:
          Number(productForm.purchase_price),


        selling_price:
          Number(productForm.selling_price),


        minimum_stock:
          Number(productForm.minimum_stock),


        tax_rate:
          Number(productForm.tax_rate)


      });



      setMessage(
        "Product created successfully"
      );



      await loadProducts();



    } catch(error) {


      console.error(error);


      setMessage(
        "Product creation failed"
      );



    } finally {


      setSaving(false);


    }

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

          Add New Product

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


          products.length === 0


          ?


          <p>

            No products found.

          </p>


          :


          <InventoryTable

            products={products}

          />


        }



      </div>





      <InventoryReports

        products={products}

      />





      <InventorySidePanel />



    </div>

  );

}


export default Inventory;