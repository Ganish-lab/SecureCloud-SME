import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = {
  Critical: "#e63946",
  High: "#f77f00",
  Medium: "#fcbf49",
  Low: "#2a9d8f"
};

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("aws");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchHistory = () => {
    axios.get("http://127.0.0.1:8000/scan/history")
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const runScan = async () => {
    setLoading(true);
    try {
      await axios.get(`http://127.0.0.1:8000/scan/${provider}/1`);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter(scan => scan.provider.toLowerCase() === filter.toLowerCase());

  const severityTotals = filteredHistory.reduce((acc, scan) => {
    if (scan.summary) {
      for (let key of ["Critical", "High", "Medium", "Low"]) {
        acc[key] = (acc[key] || 0) + (scan.summary[key] || 0);
      }
    }
    return acc;
  }, {});

  const pieData = Object.entries(severityTotals).map(([name, value]) => ({ name, value }));

  const barData = filteredHistory.map(scan => ({
    name: `${scan.provider} Scan ${scan.id}`,
    Critical: scan.summary?.Critical || 0,
    High: scan.summary?.High || 0,
    Medium: scan.summary?.Medium || 0,
    Low: scan.summary?.Low || 0,
  }));

  const lineData = filteredHistory.map(scan => ({
    name: `${scan.provider} Scan ${scan.id}`,
    Issues: scan.issues.length,
  }));

  return (
    <div className="p-6">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">SecureCloud SME Dashboard</h2>
        <div className="flex space-x-4">
          <select
            value={provider}
            onChange={e => setProvider(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
            <option value="gcp">GCP</option>
          </select>
          <button
            onClick={runScan}
            disabled={loading}
            className={`px-4 py-2 rounded-lg shadow text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Running Scan..." : `Run ${provider.toUpperCase()} Scan`}
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="mb-6">
        <label className="mr-3 font-semibold">Filter by Provider:</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
          <option value="gcp">GCP</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Severity Breakdown</h3>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Scan Comparison</h3>
          <BarChart width={400} height={300} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Critical" fill={COLORS.Critical} />
            <Bar dataKey="High" fill={COLORS.High} />
            <Bar dataKey="Medium" fill={COLORS.Medium} />
            <Bar dataKey="Low" fill={COLORS.Low} />
          </BarChart>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Issue Trends</h3>
          <LineChart width={400} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Issues" stroke="#1d3557" />
          </LineChart>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="mt-8 bg-white rounded-2xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Scans</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Critical</th>
                <th className="px-4 py-2 text-left">High</th>
                <th className="px-4 py-2 text-left">Medium</th>
                <th className="px-4 py-2 text-left">Low</th>
                <th className="px-4 py-2 text-left">Total Issues</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No scans available
                  </td>
                </tr>
              ) : (
                filteredHistory.map(scan => (
                  <tr
                    key={scan.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/scan/${scan.id}`)}
                  >
                    <td className="px-4 py-2">{scan.id}</td>
                    <td className="px-4 py-2">{scan.provider}</td>
                    <td className="px-4 py-2">
                      {scan.timestamp ? new Date(scan.timestamp).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-red-600 font-semibold">
                      {scan.summary?.Critical || 0}
                    </td>
                    <td className="px-4 py-2 text-orange-600 font-semibold">
                      {scan.summary?.High || 0}
                    </td>
                    <td className="px-4 py-2 text-yellow-600 font-semibold">
                      {scan.summary?.Medium || 0}
                    </td>
                    <td className="px-4 py-2 text-green-600 font-semibold">
                      {scan.summary?.Low || 0}
                    </td>
                    <td className="px-4 py-2 font-bold">{scan.issues.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}