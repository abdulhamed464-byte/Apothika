import { useState } from "react";


function InventorySidePanel() {


  const [open, setOpen] = useState(false);



  return (

    <>


      <button

        className="inventory-tools-toggle"

        onClick={() => setOpen(!open)}

      >

        {

          open

          ?

          "Close Tools"

          :

          "Inventory Tools"

        }

      </button>





      {

        open &&

        <div className="inventory-side-panel">


          <div className="side-card">


            <h3>

              Barcode Center

            </h3>


            <p>

              Inventory V3 Tools

            </p>


            <button>

              Scan Barcode

            </button>


            <button>

              Generate Labels

            </button>


          </div>





          <div className="side-card">


            <h3>

              Quick Actions

            </h3>



            <div className="side-stat">

              <span>

                SKU Generator

              </span>


              <strong>

                Ready

              </strong>


            </div>



            <div className="side-stat">

              <span>

                Barcode Lookup

              </span>


              <strong>

                Soon

              </strong>


            </div>


          </div>





          <div className="side-card ai-card">


            <h3>

              APOTHIKA Intelligence

            </h3>


            <p>

              Future AI business layer

            </p>


            <ul>

              <li>
                Demand Forecast
              </li>


              <li>
                Smart Purchasing
              </li>


              <li>
                Business Health
              </li>


            </ul>


          </div>



        </div>

      }


    </>

  );

}


export default InventorySidePanel;