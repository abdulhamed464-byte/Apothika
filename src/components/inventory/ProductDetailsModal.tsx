import type { InventoryProduct } from "../../services/inventory/ProductService";

interface Props {
  product: InventoryProduct;
  onClose: () => void;
}

function ProductDetailsModal({
  product,
  onClose
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3000
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "24px",
          width: "420px",
          maxWidth: "95%",
          boxShadow: "0 20px 50px rgba(0,0,0,.25)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Product Details
        </h2>

        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.product_name}
            style={{
              width: "180px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "12px",
              display: "block",
              margin: "0 auto 20px"
            }}
          />
        )}

        <p><strong>Name:</strong> {product.product_name}</p>
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Barcode:</strong> {product.barcode || "-"}</p>
        <p><strong>Category:</strong> {product.category || "-"}</p>
        <p><strong>Brand:</strong> {product.brand || "-"}</p>
        <p><strong>Selling Price:</strong> ₹{product.selling_price}</p>
        <p><strong>Status:</strong> {product.status}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px"
          }}
        >
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
