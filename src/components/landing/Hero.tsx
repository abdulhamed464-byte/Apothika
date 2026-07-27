import { Link } from "react-router-dom";


function Hero() {


  return (

    <section className="hero">


      <div className="hero-glow gold"></div>
      <div className="hero-glow blue"></div>
      <div className="hero-glow red"></div>



      <div className="hero-content">


        <div className="hero-badge">

          🚀 Multi-Domain Intelligent Business Operating System

        </div>



        <h1>

          One Platform.

          <br />

          <span className="gradient-text">
            Every Business.
          </span>

        </h1>



        <p>

          APOTHIKA unifies Inventory, Sales, Purchase,
          Warehouse, Manufacturing, Logistics and AI
          into one powerful cloud ERP platform.

        </p>




        <div className="hero-buttons">


          <Link
            to="/register"
            className="primary-btn"
          >

            Start Free

          </Link>




          <Link
            to="/login"
            className="secondary-btn"
          >

            Login

          </Link>


        </div>



        <div className="hero-trust">


          <span>
            ✓ Multi Industry
          </span>


          <span>
            ✓ Cloud ERP
          </span>


          <span>
            ✓ AI Ready
          </span>


        </div>


      </div>






      <div className="hero-dashboard">


        <div className="dashboard-card">


          <div className="card-header">

            APOTHIKA Intelligence

          </div>




          <div className="metric">


            <h2>
              £2.4M
            </h2>

            <p>
              Inventory Value
            </p>


          </div>





          <div className="metric-row">


            <div>

              <h3>
                24,850
              </h3>

              <span>
                Products
              </span>

            </div>




            <div>

              <h3>
                11
              </h3>

              <span>
                Modules
              </span>

            </div>


          </div>





          <div className="ai-box">


            🤖 AI Business Intelligence

            <br />

            Predict.
            Analyse.
            Grow.


          </div>



        </div>


      </div>



    </section>


  );

}


export default Hero;