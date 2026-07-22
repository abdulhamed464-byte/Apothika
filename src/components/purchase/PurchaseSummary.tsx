interface Props {

  product:any;

  quantity:string;

  price:string;

}


function PurchaseSummary({
  product,
  quantity,
  price
}:Props){


  const total =
    Number(quantity || 0) *
    Number(price || 0);



  return (

    <div className="purchase-summary">


      <h2>
        Purchase Summary
      </h2>


      <div className="summary-row">

        <span>
          Product
        </span>

        <strong>
          {
            product
            ?
            product.product_name
            :
            "-"
          }
        </strong>

      </div>




      <div className="summary-row">

        <span>
          Quantity
        </span>

        <strong>
          {quantity || 0}
        </strong>

      </div>




      <div className="summary-row">

        <span>
          Price
        </span>

        <strong>
          ₹ {price || 0}
        </strong>

      </div>




      <hr />



      <div className="summary-total">

        Total:

        ₹ {total}

      </div>


    </div>

  );


}


export default PurchaseSummary;