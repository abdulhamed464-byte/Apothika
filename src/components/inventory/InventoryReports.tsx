import { StockService } from "../../services/inventory/StockService";
import { BatchService } from "../../services/inventory/BatchService";


interface Props {

  products:any[];

}



function InventoryReports({

  products

}:Props){



  const categories =

    new Set(

      products.map(

        (product:any)=>

          product.category

      )

      .filter(Boolean)

    )

    .size;





  const totalStock =

    products.reduce(

      (sum:number, product:any)=>

        sum +

        StockService.calculateCurrentStock(product),

      0

    );







  const lowStock =

    products.filter(

      (product:any)=>

        StockService.isLowStock(product)

    )

    .length;







  const inventoryValue =

    products.reduce(

      (sum:number, product:any)=>

        sum +

        StockService.calculateInventoryValue(product),

      0

    );







  const batchProducts =

    products.filter(

      (product:any)=>

        product.batch_required

    )

    .length;









  const expiredBatches =

    products.reduce(

      (count:number, product:any)=>{


        const batches =

          product.inventory_batches || [];



        return (

          count +

          batches.filter(

            (batch:any)=>

              BatchService.isExpired(batch)

          )

          .length

        );


      },

      0

    );









  const expiringSoonBatches =

    products.reduce(

      (count:number, product:any)=>{


        const batches =

          product.inventory_batches || [];



        return (

          count +

          batches.filter(

            (batch:any)=>

              BatchService.isExpiringSoon(batch)

          )

          .length

        );


      },

      0

    );









  return(


    <div className="inventory-reports">



      <h2>

        Inventory Reports

      </h2>



      <p>

        Stock intelligence overview

      </p>









      <div className="inventory-report-grid">





        <div className="inventory-report-card">

          <span>
            Total Products
          </span>

          <strong>
            {products.length}
          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Categories
          </span>

          <strong>
            {categories}
          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Total Stock
          </span>

          <strong>
            {totalStock}
          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Low Stock Items
          </span>

          <strong>
            {lowStock}
          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Inventory Value
          </span>

          <strong>

            ₹{inventoryValue.toLocaleString()}

          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Batch Tracking
          </span>

          <strong>

            {batchProducts}

          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Expired Batches
          </span>

          <strong>

            {expiredBatches}

          </strong>

        </div>







        <div className="inventory-report-card">

          <span>
            Expiring Soon
          </span>

          <strong>

            {expiringSoonBatches}

          </strong>

        </div>







      </div>







    </div>


  );


}



export default InventoryReports;