import { useEffect, useState } from "react";
import { PurchaseService } from "../../services/purchase/PurchaseService";
import PurchaseDetails from "./PurchaseDetails";
import {
  Search,
  Eye,
  Receipt,
  Wallet,
  Clock3,
} from "lucide-react";
import "../../styles/purchase-history.css";

function PurchaseHistory() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, status, purchases]);

  async function loadHistory() {
    try {
      setLoading(true);

      const data = await PurchaseService.getPurchaseHistory();

      console.log(
        "FULL PURCHASE HISTORY OBJECT",
        JSON.stringify(data, null, 2)
      );

      setPurchases(data ?? []);
      setFilteredPurchases(data ?? []);
    } catch (error) {
      console.error("Purchase history error", error);
    } finally {
      setLoading(false);
    }
  }

  function filterData() {
    let result = [...purchases];

    if (search.trim()) {
      result = result.filter((purchase) =>
        purchase.invoice_number
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (status !== "All") {
      result = result.filter(
        (purchase) => purchase.payment_status === status
      );
    }

    setFilteredPurchases(result);
  }

  async function handleView(purchaseId: string) {
    try {
      const details =
        await PurchaseService.getPurchaseDetails(purchaseId);

      setSelectedPurchase(details);
    } catch (error) {
      console.error("Purchase details error", error);
    }
  }

  const totalAmount = filteredPurchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.total_amount || 0),
    0
  );

  const pendingAmount = filteredPurchases
    .filter(
      (purchase) => purchase.payment_status === "Pending"
    )
    .reduce(
      (sum, purchase) =>
        sum + Number(purchase.total_amount || 0),
      0
    );

  return (
    <div className="purchase-history">
      <div className="purchase-history-header">
        <h2>Purchase History</h2>
      </div>

      {/* KPI Cards */}
      <div className="purchase-history-summary">
        <div className="history-summary-card">
          <div className="summary-icon">
            <Receipt size={18} />
          </div>

          <div className="summary-content">
            <span>Transactions</span>
            <strong>{filteredPurchases.length}</strong>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="summary-icon green">
            <Wallet size={18} />
          </div>

          <div className="summary-content">
            <span>Total Purchase</span>
            <strong>
              ₹{totalAmount.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="summary-icon orange">
            <Clock3 size={18} />
          </div>

          <div className="summary-content">
            <span>Pending Amount</span>
            <strong>
              ₹{pendingAmount.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="purchase-filters">
        <div className="purchase-search-box">
          <Search size={18} />

          <input
            placeholder="Search invoice..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option>All</option>
          <option>Pending</option>
          <option>Paid</option>
          <option>Partial</option>
        </select>
      </div>

      {loading && <p>Loading purchases...</p>}

      {!loading &&
        filteredPurchases.length === 0 && (
          <p className="purchase-empty">
            No purchase records found
          </p>
        )}

      {filteredPurchases.length > 0 && (
        <div className="purchase-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.invoice_number}</td>

                  <td>
                    {purchase.suppliers?.supplier_name ??
                      "Unknown Supplier"}
                  </td>

                  <td>{purchase.purchase_date}</td>

                  <td>
                    ₹
                    {Number(
                      purchase.total_amount
                    ).toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={
                        purchase.payment_status ===
                        "Paid"
                          ? "status-paid"
                          : "status-pending"
                      }
                    >
                      {purchase.payment_status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="history-view-button"
                      onClick={() =>
                        handleView(purchase.id)
                      }
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPurchase && (
        <PurchaseDetails
          purchase={selectedPurchase}
          onClose={() =>
            setSelectedPurchase(null)
          }
        />
      )}
    </div>
  );
}

export default PurchaseHistory;