import { supabase } from "../../lib/supabase";
import { WorkspaceService } from "../workspace/WorkspaceService";

export class PurchaseService {

  static async getBusinessId() {

    return await WorkspaceService.getBusinessId();

  }


  static async getSuppliers() {

    const businessId =
      await this.getBusinessId();

    const {
      data,
      error
    } =
      await supabase
        .from("suppliers")
        .select("*")
        .eq(
          "business_id",
          businessId
        )
        .order(
          "supplier_name",
          {
            ascending: true
          }
        );

    if (error)
      throw error;

    return data ?? [];
  }


  static async getProducts() {

    const workspace =
      await WorkspaceService.getUserWorkspace();

    if (!workspace) {

      throw new Error(
        "Workspace not found"
      );

    }

    const {
      data,
      error
    } =
      await supabase
        .from("products")
        .select("*")
        .eq(
          "workspace_id",
          workspace.workspace_id
        )
        .order(
          "product_name",
          {
            ascending: true
          }
        );

    if (error)
      throw error;

    return data ?? [];
  }


  static async savePurchase(
    payload: any
  ) {

    const businessId =
      await this.getBusinessId();

    const totalAmount =
      Number(payload.quantity) *
      Number(payload.purchase_price);


    const {
      data: purchase,
      error: purchaseError
    } =
      await supabase
        .from("purchases")
        .insert({

          business_id:
            businessId,

          supplier_id:
            payload.supplier_id,

          invoice_number:
            payload.invoice_number,

          purchase_date:
            payload.purchase_date,

          total_amount:
            totalAmount,

          payment_status:
            "Pending"

        })
        .select()
        .single();


    if (purchaseError)
      throw purchaseError;


    const {
      error: itemError
    } =
      await supabase
        .from("purchase_items")
        .insert({

          purchase_id:
            purchase.id,

          product_id:
            payload.product_id,

          quantity:
            Number(payload.quantity),

          purchase_price:
            Number(payload.purchase_price)

        });


    if (itemError)
      throw itemError;


    const {
      error: stockError
    } =
      await supabase
        .from("stock_entries")
        .insert({

          business_id:
            businessId,

          supplier_id:
            payload.supplier_id,

          product_id:
            payload.product_id,

          quantity:
            Number(payload.quantity),

          purchase_price:
            Number(payload.purchase_price),

          invoice_number:
            payload.invoice_number,

          entry_date:
            payload.purchase_date

        });


    if (stockError)
      throw stockError;


    return purchase;
  }


  static async getPurchaseHistory() {

    const businessId =
      await this.getBusinessId();


    const {
      data: purchases,
      error
    } =
      await supabase
        .from("purchases")
        .select("*")
        .eq(
          "business_id",
          businessId
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error)
      throw error;


    const enrichedPurchases =
      await Promise.all(

        (purchases ?? []).map(
          async (purchase) => {

            const {
              data: supplier
            } =
              await supabase
                .from("suppliers")
                .select(
                  "supplier_name,mobile,email"
                )
                .eq(
                  "id",
                  purchase.supplier_id
                )
                .single();


            return {

              ...purchase,

              suppliers:
                supplier

            };

          }
        )

      );


    console.log(
      "PURCHASE HISTORY DATA",
      enrichedPurchases
    );


    return enrichedPurchases;
  }


  static async getPurchaseDetails(
    purchaseId: string
  ) {

    const {
      data: purchase,
      error: purchaseError
    } =
      await supabase
        .from("purchases")
        .select("*")
        .eq(
          "id",
          purchaseId
        )
        .single();


    if (purchaseError)
      throw purchaseError;


    const {
      data: supplier
    } =
      await supabase
        .from("suppliers")
        .select("*")
        .eq(
          "id",
          purchase.supplier_id
        )
        .single();


    const {
      data: items
    } =
      await supabase
        .from("purchase_items")
        .select("*")
        .eq(
          "purchase_id",
          purchaseId
        );


    for (const item of items ?? []) {

      const {
        data: product
      } =
        await supabase
          .from("products")
          .select("*")
          .eq(
            "id",
            item.product_id
          )
          .single();


      item.products =
        product;

    }


    purchase.suppliers =
      supplier;

    purchase.purchase_items =
      items;


    return purchase;
  }


  static async getPurchaseStats() {

    const purchases =
      await this.getPurchaseHistory();


    const total =
      purchases.reduce(
        (sum: any, p: any) =>
          sum +
          Number(
            p.total_amount || 0
          ),
        0
      );


    const pending =
      purchases
        .filter(
          (p: any) =>
            p.payment_status ===
            "Pending"
        )
        .reduce(
          (sum: any, p: any) =>
            sum +
            Number(
              p.total_amount || 0
            ),
          0
        );


    return {

      total,

      count:
        purchases.length,

      pending

    };
  }

}