"use client";

import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/toastProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type MasterKey = "navision_notify_customer" | "navision_salesperson_list" | "navision_vendor_master" | "navision_customer_master" | "navision_retail_master";

const TABS: { key: MasterKey; label: string; api: string; idField: string }[] = [
  { key: "navision_notify_customer", label: "Notify Customers", api: "/nextapi/master/navision_notify_customer", idField: "no" },
  { key: "navision_salesperson_list", label: "Salespersons", api: "/nextapi/master/navision_salesperson_list", idField: "code" },
  { key: "navision_vendor_master", label: "Vendors", api: "/nextapi/master/navision_vendor_master", idField: "no" },
  { key: "navision_customer_master", label: "Customers", api: "/nextapi/master/navision_customer_master", idField: "no" },
  { key: "navision_retail_master", label: "Retailers", api: "/nextapi/master/navision_retail_master", idField: "no" },
];

export default function MasterReportPage() {
  const [active, setActive] = useState<MasterKey>(TABS[0].key);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [navid, setNavid] = useState("");
  const [onboardingMap, setOnboardingMap] = useState<Record<string, boolean>>({});
  const [onboarding, setOnboarding] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, page, limit]);

  async function fetchData() {
    setLoading(true);
    try {
      const tab = TABS.find(t => t.key === active)!;
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (navid) params.set("navid", navid);

      const res = await fetch(`${tab.api}?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setData(json.data || []);
        setTotal(json.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (e) {
      setData([]);
      setTotal(0);
    }
    setLoading(false);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchData();
  }

  async function handleOnboard(id: string) {
    try {
      const tabConfig = TABS.find(t => t.key === active);
      if (!tabConfig) return;

      // Map active tab to onboard type
      const typeMap: Record<MasterKey, "retailer" | "distributor" | "salesperson"> = {
        navision_notify_customer: "retailer",
        navision_customer_master: "retailer",
        navision_retail_master: "retailer",
        navision_vendor_master: "distributor",
        navision_salesperson_list: "salesperson",
      };

      const onboardType = typeMap[active];
      if (!onboardType) {
        showErrorToast("Invalid master type for onboarding");
        return;
      }

      setOnboarding(prev => ({ ...prev, [id]: true }));

      const res = await fetch("/nextapi/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: onboardType, navisionId: id }),
      });

      const json = await res.json();

      setOnboarding(prev => ({ ...prev, [id]: false }));
      console.log("Onboard response:", json);
      if (res.ok && json.success) {
        // Update the data to mark as onboarded
        setData(prev =>
          prev.map(row =>
            (row[getIdField()] === id) ? { ...row, onboarded: true } : row
          )
        );
        showSuccessToast(json.message || `Successfully onboarded ${onboardType}`);
      } else {
        showErrorToast(json.error || `Failed to onboard ${onboardType}`);
      }
    } catch (error) {
      setOnboarding(prev => ({ ...prev, [id]: false }));
      showErrorToast("Error onboarding record");
      console.error(error);
    }
  }

  function showSuccessToast(message: string) {
    // Using a simple alert for now, you can integrate proper toast if available
    import("react-toastify").then(({ toast }) => {
      toast.success(message);
    });
  }

  function getIdField() {
    return TABS.find(t => t.key === active)?.idField || "no";
  }

  function OnboardedCell({ value, rowId }: { value: boolean; rowId: string }) {
    const isLoading = onboarding[rowId];
    
    if (value) {
      return (
        <div className="badge badge-success gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Onboarded
        </div>
      );
    }
    return (
      <button
        onClick={() => handleOnboard(rowId)}
        disabled={isLoading}
        className={`btn btn-xs btn-outline btn-primary ${isLoading ? "loading" : ""}`}
      >
        {isLoading ? "Onboarding..." : "Onboard"}
      </button>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Master Report</h1>

        <div className="tabs mb-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActive(tab.key); setPage(1); }}
              className={`tab tab-lifted ${active === tab.key ? 'tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSearch} className="flex gap-2 mb-4">
          <input
            placeholder="Filter by Navision ID / Code"
            value={navid}
            onChange={(e) => setNavid(e.target.value)}
            className="input input-bordered w-64"
          />
          <button className="btn btn-primary" type="submit">Search</button>
          <button type="button" className="btn" onClick={() => { setNavid(''); setPage(1); fetchData(); }}>Clear</button>
        </form>

        <div className="card bg-base-200 p-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => {
                      const idField = getIdField();
                      const rowId = row[idField] || String(idx);
                      return (
                        <tr key={idx}>
                          <td><span className="font-mono text-sm">{rowId}</span></td>
                          <td>{row.name || '-'}</td>
                          <td>{row.whatsappNo || row.whatsappMobileNumber || row.whatsappNo1 || '-'}</td>
                          <td>
                            <OnboardedCell value={row.onboarded} rowId={rowId} />
                          </td>
                          <td>
                            <button className="btn btn-xs btn-ghost">View</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>Showing page {page} — total {total}</div>
                <div className="btn-group">
                  <button className="btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
                  <button className="btn" onClick={() => setPage(page + 1)} disabled={page * limit >= total}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}
