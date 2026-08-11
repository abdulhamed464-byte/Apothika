import { useEffect, useState } from "react";
import StockInForm from "../components/inventory/StockInForm";
import { ProductService } from "../services/inventory/ProductService";
import { StockService } from "../services/inventory/StockService";
import { WorkspaceService } from "../services/workspace/WorkspaceService";
import { supabase } from "../lib/supabase";
import type { StockInPayload } from "../types/stock";

function StockIn() {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [businessId, setBusinessId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const workspace =
        await WorkspaceService.getUserWorkspace();

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const currentBusinessId =
        await WorkspaceService.getBusinessId();

      if (!currentBusinessId) {
        throw new Error("Business not found");
      }

      setBusinessId(currentBusinessId);

      const productData =
        await ProductService.getProducts(
          workspace.workspace_id
        );

      setProducts(productData);

      const {
        data,
        error
      } = await supabase
        .from("suppliers")
        .select("*")
        .eq(
          "business_id",
          currentBusinessId
        )
        .eq(
          "status",
          "Active"
        );

      if (error) {
        throw error;
      }

      setSuppliers(data ?? []);
    } catch (error) {
      console.error(
        "Stock In loading error",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load stock data"
      );
    }
  }

  async function handleStockIn(
    payload: StockInPayload
  ) {
    try {
      setLoading(true);
      setMessage("");

      if (!businessId) {
        throw new Error("Business not found");
      }

      await StockService.stockIn({
        ...payload,
        business_id: businessId
      });

      setMessage(
        "Stock added successfully"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save stock"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StockInForm
        products={products}
        suppliers={suppliers}
        onSubmit={handleStockIn}
        loading={loading}
      />

      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}

export default StockIn;