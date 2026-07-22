import { supabase } from "../../lib/supabase";

export interface Product {
  id?: string;

  workspace_id: string;

  product_name: string;

  description?: string;

  sku: string;

  barcode?: string;

  category?: string;

  brand?: string;

  unit?: string;

  purchase_price: number;

  selling_price: number;

  tax_rate?: number;

  minimum_stock: number;

  image_url?: string;

  track_inventory?: boolean;

  batch_required?: boolean;

  expiry_required?: boolean;

  status: string;

  created_at?: string;

  updated_at?: string;
}

export const ProductService = {

  async getProducts(workspaceId: string) {

    const { data, error } = await supabase

      .from("products")

      .select("*")

      .eq(
        "workspace_id",
        workspaceId
      )

      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {

      throw error;

    }

    return data as Product[];

  },

  async createProduct(product: Product) {

    const { data, error } = await supabase

      .from("products")

      .insert(product)

      .select()

      .single();

    if (error) {

      throw error;

    }

    return data as Product;

  },

  async getProductCount(workspaceId: string) {

    const { count, error } = await supabase

      .from("products")

      .select("*", {
        count: "exact",
        head: true
      })

      .eq(
        "workspace_id",
        workspaceId
      );

    if (error) {

      throw error;

    }

    return count ?? 0;

  },

  async barcodeExists(
    workspaceId: string,
    barcode: string
  ) {

    if (!barcode.trim()) {

      return false;

    }

    const { data, error } = await supabase

      .from("products")

      .select("id")

      .eq("workspace_id", workspaceId)

      .eq("barcode", barcode)

      .maybeSingle();

    if (error) {

      throw error;

    }

    return !!data;

  },

  async skuExists(
    workspaceId: string,
    sku: string
  ) {

    if (!sku.trim()) {

      return false;

    }

    const { data, error } = await supabase

      .from("products")

      .select("id")

      .eq("workspace_id", workspaceId)

      .eq("sku", sku)

      .maybeSingle();

    if (error) {

      throw error;

    }

    return !!data;

  }

};