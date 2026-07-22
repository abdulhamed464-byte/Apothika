import type { InventoryProduct } from "../../services/inventory/ProductService";


interface Props {

  products: InventoryProduct[];

  onEdit?: (
    product: InventoryProduct
  ) => void;

  onDelete?: (
    product: InventoryProduct
  ) => void;

  onView?: (
    product: InventoryProduct
  ) => void;

}



function InventoryTable({

  products,

  onEdit,

  onDelete,

  onView

}: Props) {



  return (

    <div className="inventory-table-wrapper">


      <table className="inventory-table">


        <thead>

          <tr>

            <th>
              Image
            </th>

            <th>
              Product
            </th>

            <th>
              SKU
            </th>

            <th>
              Category
            </th>

            <th>
              Stock
            </th>

            <th>
              Value
            </th>

            <th>
              Status
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>



        <tbody>


          {

            products.map(

              (product) => {


                const stock =

                  product.stock_entries?.reduce(

                    (
                      total,
                      entry
                    ) =>

                      total +

                      Number(
                        entry.quantity || 0
                      ),

                    0

                  ) || 0;




                const value =

                  stock *

                  Number(
                    product.purchase_price || 0
                  );





                return (

                  <tr

                    key={product.id}

                  >



                    <td>


                      {

                        product.image_url

                        ?

                        <img

                          src={product.image_url}

                          alt={product.product_name}

                          style={{

                            width:"45px",

                            height:"45px",

                            objectFit:"cover",

                            borderRadius:"8px"

                          }}

                        />


                        :

                        <span>
                          -
                        </span>

                      }


                    </td>





                    <td>

                      {product.product_name}

                    </td>




                    <td>

                      {product.sku || "-"}

                    </td>




                    <td>

                      {product.category || "-"}

                    </td>




                    <td>

                      {stock}

                    </td>




                    <td>

                      ₹
                      {value.toLocaleString()}

                    </td>




                    <td>


                      <span

                        className={

                          stock <= Number(
                            product.minimum_stock
                          )

                          ?

                          "inventory-low"

                          :

                          "inventory-good"

                        }

                      >


                        {

                          stock <= Number(
                            product.minimum_stock
                          )

                          ?

                          "Low Stock"

                          :

                          "Healthy"

                        }


                      </span>


                    </td>




                    <td>


                      <div

                        style={{

                          display:"flex",

                          gap:"8px"

                        }}

                      >


                        <button

                          type="button"

                          onClick={() =>
                            onView?.(product)
                          }

                        >

                          View

                        </button>





                        <button

                          type="button"

                          onClick={() =>
                            onEdit?.(product)
                          }

                        >

                          Edit

                        </button>





                        <button

                          type="button"

                          onClick={() =>
                            onDelete?.(product)
                          }

                          style={{

                            background:"#ef4444",

                            color:"#ffffff"

                          }}

                        >

                          Delete

                        </button>



                      </div>


                    </td>




                  </tr>

                );


              }

            )

          }


        </tbody>


      </table>


    </div>

  );


}



export default InventoryTable;
