import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [brands, setBrands] = useState([]);
  const [spend, setSpend] = useState([]);

  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingSpend, setLoadingSpend] = useState(true);

  const [errorBrands, setErrorBrands] = useState(null);
  const [errorSpend, setErrorSpend] = useState(null);

  const [brandFilter, setBrandFilter] = useState("");

  // 1) /api/brands → BrandDetail
  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => {
        setBrands(data);
        setLoadingBrands(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorBrands(err.message);
        setLoadingBrands(false);
      });
  }, []);

  // 2) /api/daily-spend → DailySpend
  useEffect(() => {
    fetch("http://localhost:5000/api/daily-spend")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch daily spend");
        return res.json();
      })
      .then((data) => {
        setSpend(data);
        setLoadingSpend(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorSpend(err.message);
        setLoadingSpend(false);
      });
  }, []);

  // --- Simple BI-style summaries ---

  const totalSpend = spend.reduce(
    (sum, row) => sum + (row.SpendAmount || row.Spendamount || row.SpendAmount === 0 ? Number(row.SpendAmount) || 0 : 0),
    0
  );

  const uniqueBrandsCount = new Set(spend.map((row) => row.BrandName)).size;
  const uniqueStatesCount = new Set(spend.map((row) => row.StateAbbr)).size;

  // Brand name filter
  const filteredSpend = spend.filter((row) =>
    brandFilter
      ? row.BrandName &&
        row.BrandName.toLowerCase().includes(brandFilter.toLowerCase())
      : true
  );

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Dewey BI Dashboard</h1>
      <p>Azure SQL → Flask (localhost:5000) → React (localhost:3000)</p>

      {/* --- KPI cards --- */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px 16px",
            minWidth: "180px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#666" }}>Total Spend (sample)</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            ${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px 16px",
            minWidth: "180px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#666" }}>Unique Brands</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            {uniqueBrandsCount}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px 16px",
            minWidth: "180px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#666" }}>States Covered</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            {uniqueStatesCount}
          </div>
        </div>
      </div>

      {/* --- BrandDetail table --- */}
      <section style={{ marginTop: "8px" }}>
        <h2>BrandDetail (Brands)</h2>

        {loadingBrands && <p>Loading brand data...</p>}
        {errorBrands && <p style={{ color: "red" }}>Error: {errorBrands}</p>}

        {!loadingBrands && !errorBrands && (
          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
            <table
              border="1"
              cellPadding="6"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>BrandId</th>
                  <th>BrandName</th>
                  <th>BrandType</th>
                  <th>BrandUrl</th>
                  <th>IndustryName</th>
                  <th>SubindustryId</th>
                  <th>SubindustryName</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.BrandId}>
                    <td>{b.BrandId}</td>
                    <td>{b.BrandName}</td>
                    <td>{b.BrandType}</td>
                    <td>{b.BrandUrl}</td>
                    <td>{b.IndustryName}</td>
                    <td>{b.SubindustryId}</td>
                    <td>{b.SubindustryName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* --- DailySpend table with filter --- */}
      <section style={{ marginTop: "32px" }}>
        <h2>DailySpend</h2>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Filter by BrandName:{" "}
            <input
              type="text"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              placeholder="e.g. Walmart"
              style={{ padding: "4px 8px" }}
            />
          </label>
        </div>

        {loadingSpend && <p>Loading daily spend data...</p>}
        {errorSpend && <p style={{ color: "red" }}>Error: {errorSpend}</p>}

        {!loadingSpend && !errorSpend && (
          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
            <table
              border="1"
              cellPadding="6"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>BrandId</th>
                  <th>BrandName</th>
                  <th>SpendAmount</th>
                  <th>StateAbbr</th>
                  <th>TransCount</th>
                  <th>TransDate</th>
                  <th>Version</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpend.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.BrandId}</td>
                    <td>{row.BrandName}</td>
                    <td>{row.SpendAmount}</td>
                    <td>{row.StateAbbr}</td>
                    <td>{row.TransCount}</td>
                    <td>{row.TransDate}</td>
                    <td>{row.Version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
