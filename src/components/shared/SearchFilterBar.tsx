interface Props {

  search:string;

  setSearch:(value:string)=>void;


  category:string;

  setCategory:(value:string)=>void;


  brand:string;

  setBrand:(value:string)=>void;


  stockStatus:string;

  setStockStatus:(value:string)=>void;


  status:string;

  setStatus:(value:string)=>void;


  categories:string[];

  brands:string[];

}



function SearchFilterBar({

  search,

  setSearch,

  category,

  setCategory,

  brand,

  setBrand,

  stockStatus,

  setStockStatus,

  status,

  setStatus,

  categories,

  brands

}:Props){


  return (

    <div

      style={{

        display:"grid",

        gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",

        gap:"15px",

        marginBottom:"25px"

      }}

    >


      <input

        type="text"

        placeholder="Search product, SKU or barcode..."

        value={search}

        onChange={(e)=>

          setSearch(e.target.value)

        }

        style={{

          padding:"12px",

          borderRadius:"12px",

          border:"1px solid #374151",

          background:"#111827",

          color:"white"

        }}

      />





      <select

        value={category}

        onChange={(e)=>

          setCategory(e.target.value)

        }

        style={{

          padding:"12px",

          borderRadius:"12px",

          background:"#111827",

          color:"white"

        }}

      >

        <option value="">

          All Categories

        </option>


        {

          categories.map((item)=>(

            <option

              key={item}

              value={item}

            >

              {item}

            </option>

          ))

        }


      </select>







      <select

        value={brand}

        onChange={(e)=>

          setBrand(e.target.value)

        }

        style={{

          padding:"12px",

          borderRadius:"12px",

          background:"#111827",

          color:"white"

        }}

      >

        <option value="">

          All Brands

        </option>


        {

          brands.map((item)=>(

            <option

              key={item}

              value={item}

            >

              {item}

            </option>

          ))

        }


      </select>









      <select

        value={stockStatus}

        onChange={(e)=>

          setStockStatus(e.target.value)

        }

        style={{

          padding:"12px",

          borderRadius:"12px",

          background:"#111827",

          color:"white"

        }}

      >

        <option value="">

          All Stock

        </option>


        <option value="healthy">

          Healthy Stock

        </option>


        <option value="low">

          Low Stock

        </option>


        <option value="out">

          Out of Stock

        </option>


      </select>









      <select

        value={status}

        onChange={(e)=>

          setStatus(e.target.value)

        }

        style={{

          padding:"12px",

          borderRadius:"12px",

          background:"#111827",

          color:"white"

        }}

      >

        <option value="">

          Active Products

        </option>


        <option value="Active">

          Active

        </option>


        <option value="Inactive">

          Inactive

        </option>


        <option value="Archived">

          Archived

        </option>


      </select>



    </div>

  );

}


export default SearchFilterBar;