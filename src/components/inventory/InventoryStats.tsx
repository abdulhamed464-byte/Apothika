interface Props {
  products: any[];
}


function InventoryStats({
  products
}: Props) {


  const totalProducts =
    products.length;



  const calculateStock = (product: any) => {


    const stockIn =
      product.stock_entries?.reduce(
        (total: number, entry: any) =>
          total + Number(entry.quantity || 0),
        0
      ) || 0;



    const stockOut =
      product.stock_out_entries?.reduce(
        (total: number, entry: any) =>
          total + Number(entry.quantity || 0),
        0
      ) || 0;



    return stockIn - stockOut;

  };






  const totalStock =

    products.reduce(
      (sum, product) => {

        return sum + calculateStock(product);

      },
      0
    );







  const inventoryValue =

    products.reduce(
      (sum, product) => {


        const stock =
          calculateStock(product);



        return (

          sum +

          (
            stock *
            Number(product.purchase_price || 0)
          )

        );


      },
      0
    );







  const lowStock =

    products.filter(
      product => {


        const stock =
          calculateStock(product);



        return (

          stock <=
          Number(product.minimum_stock || 0)

        );


      }

    ).length;







  return (

    <div className="inventory-stats">


      <div className="inventory-stat-card">

        <span>
          Total Products
        </span>

        <strong>
          {totalProducts}
        </strong>

      </div>




      <div className="inventory-stat-card">

        <span>
          Stock Quantity
        </span>

        <strong>
          {totalStock}
        </strong>

      </div>





      <div className="inventory-stat-card">

        <span>
          Inventory Value
        </span>

        <strong>
          ₹{inventoryValue.toLocaleString()}
        </strong>

      </div>





      <div className="inventory-stat-card">

        <span>
          Low Stock
        </span>

        <strong>
          {lowStock}
        </strong>

      </div>



    </div>

  );

}


export default InventoryStats;