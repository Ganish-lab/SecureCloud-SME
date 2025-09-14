import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import DownloadOptionsModal from "./DownloadOptionsModal";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid
} from "recharts";

export default function ScanReport() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const reportRef = useRef();
  const chartsRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/scan/history")
      .then(res => {
        const found = res.data.find(s => String(s.id) === id);
        setScan(found || null);
      })
      .catch(err => console.error(err));
  }, [id]);

  const getLogoBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const generateQRCode = async (url) => {
    try {
      return await QRCode.toDataURL(url);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const downloadPDF = async ({ includeQR, includeCharts, useColorTheme }) => {
    if (!scan) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const headerColor = useColorTheme ? "#1d3557" : "#333";
    const footerColor = useColorTheme ? "#1d3557" : "#333";
    const severityColors = useColorTheme
      ? { Critical: "#e63946", High: "#f77f00", Medium: "#fcbf49", Low: "#2a9d8f" }
      : { Critical: "#555", High: "#777", Medium: "#999", Low: "#bbb" };

    const logoData = await getLogoBase64("/logo.png");
    const sectionPositions = {};

    // ----------------- Page 1: TOC -----------------
    pdf.setFillColor(headerColor);
    pdf.rect(0, 0, pdfWidth, 40, "F");
    if (logoData) pdf.addImage(logoData, 10, 5, 30, 30);
    pdf.setFontSize(22);
    pdf.setTextColor("#fff");
    pdf.text("SecureCloud SME Scan Report", pdfWidth / 2 + 10, 25, { align: "center" });

    pdf.setFontSize(16);
    pdf.setTextColor("#000");
    pdf.text("Table of Contents", 20, 50);

    const tocEntries = ["Severity Summary", "Charts", "Issues"];
    let y = 70;
    tocEntries.forEach((entry, idx) => {
      pdf.setTextColor("#007bff");
      pdf.text(entry, 30, y);
      sectionPositions[entry] = idx + 2;
      y += 15;
    });

    pdf.addPage();

    // ----------------- Section 1: Severity Summary -----------------
    let currentPage = pdf.getCurrentPageInfo().pageNumber;
    sectionPositions["Severity Summary"] = currentPage;

    pdf.setFillColor(headerColor);
    pdf.rect(0, 0, pdfWidth, 25, "F");
    pdf.setFontSize(18);
    pdf.setTextColor("#fff");
    pdf.text("Severity Summary", 20, 17);

    let x = 20;
    ["Critical", "High", "Medium", "Low"].forEach(level => {
      pdf.setFillColor(severityColors[level]);
      pdf.rect(x, 35, 40, 25, "F");
      pdf.setTextColor("#fff");
      pdf.setFontSize(12);
      pdf.text(level, x + 20, 43, { align: "center" });
      pdf.setFontSize(14);
      pdf.text(`${scan.summary?.[level] || 0}`, x + 20, 53, { align: "center" });
      x += 50;
    });

    // ----------------- Section 2: Charts -----------------
    if (includeCharts) {
      pdf.addPage();
      currentPage = pdf.getCurrentPageInfo().pageNumber;
      sectionPositions["Charts"] = currentPage;

      pdf.setFillColor(headerColor);
      pdf.rect(0, 0, pdfWidth, 25, "F");
      pdf.setFontSize(18);
      pdf.setTextColor("#fff");
      pdf.text("Charts", 20, 17);

      const chartsCanvas = await html2canvas(chartsRef.current, {
        scale: 2,
        style: { filter: useColorTheme ? "none" : "grayscale(100%)" },
      });
      const chartsImgData = chartsCanvas.toDataURL("image/png");
      const chartsHeight = (chartsCanvas.height * pdfWidth) / chartsCanvas.width;
      pdf.addImage(chartsImgData, "PNG", 10, 35, pdfWidth - 20, chartsHeight);
    }

    // ----------------- Section 3: Issues -----------------
    pdf.addPage();
    currentPage = pdf.getCurrentPageInfo().pageNumber;
    sectionPositions["Issues"] = currentPage;

    pdf.setFillColor(headerColor);
    pdf.rect(0, 0, pdfWidth, 25, "F");
    pdf.setFontSize(18);
    pdf.setTextColor("#fff");
    pdf.text("Issues", 20, 17);

    const issuesCanvas = await html2canvas(reportRef.current, { scale: 2 });
    const issuesImgData = issuesCanvas.toDataURL("image/png");
    const issuesHeight = (issuesCanvas.height * pdfWidth) / issuesCanvas.width;
    pdf.addImage(issuesImgData, "PNG", 10, 35, pdfWidth - 20, issuesHeight);

    // ----------------- Footer -----------------
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFillColor(footerColor);
      pdf.rect(0, pdfHeight - 15, pdfWidth, 15, "F");
      pdf.setFontSize(10);
      pdf.setTextColor("#fff");
      pdf.text(`Generated by SecureCloud SME`, 10, pdfHeight - 5);
      pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - 20, pdfHeight - 5);
    }

    // ----------------- Optional QR Code -----------------
    if (includeQR) {
      const scanUrl = `${window.location.origin}/scan/${scan.id}`;
      const qrData = await generateQRCode(scanUrl);
      pdf.setPage(pdf.getNumberOfPages());
      pdf.addImage(qrData, "PNG", pdfWidth - 35, pdfHeight - 40, 25, 25);
      pdf.setFontSize(9);
      pdf.setTextColor("#fff");
      pdf.text("Scan Online", pdfWidth - 35, pdfHeight - 42, { align: "center" });
    }

    // ----------------- TOC Links -----------------
    pdf.setPage(1);
    y = 70;
    tocEntries.forEach(entry => {
      pdf.link(30, y - 5, 50, 10, { pageNumber: sectionPositions[entry] });
      y += 15;
    });

    pdf.save(`ScanReport_${scan.provider}_${scan.id}.pdf`);
  };

  // Chart data for this scan only
  const pieData = scan
    ? Object.entries(scan.summary || {}).map(([name, value]) => ({ name, value }))
    : [];
  const barData = scan
    ? [{
        name: `${scan.provider} Scan ${scan.id}`,
        Critical: scan.summary?.Critical || 0,
        High: scan.summary?.High || 0,
        Medium: scan.summary?.Medium || 0,
        Low: scan.summary?.Low || 0,
      }]
    : [];
  const lineData = scan
    ? [{
        name: `${scan.provider} Scan ${scan.id}`,
        Issues: scan.issues.length,
      }]
    : [];

  if (!scan) {
    return (
      <div className="p-6">
        <Link to="/" className="text-blue-600 underline">&larr; Back to Dashboard</Link>
        <h2 className="text-2xl font-bold mt-4">Scan Report</h2>
        <p className="mt-4 text-gray-500">Loading or not found...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-600 underline">&larr; Back to Dashboard</Link>
      <div ref={reportRef}>
        <h2 className="text-2xl font-bold mt-4">
          {scan.provider} Scan Report (ID: {scan.id})
        </h2>
        <p className="text-gray-600 mt-2">
          Date: {scan.timestamp ? new Date(scan.timestamp).toLocaleString() : "N/A"}
        </p>

        {/* Severity summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {["Critical", "High", "Medium", "Low"].map(level => (
            <div key={level} className={`bg-white rounded-xl shadow p-4 text-center`}>
              <h3 className="font-bold text-lg">{level}</h3>
              <p className="text-2xl">
                {scan.summary?.[level] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Issues list */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Issues Found</h3>
          {scan.issues.length === 0 ? (
            <p className="text-gray-500">No issues detected 🎉</p>
          ) : (
            <ul className="space-y-3">
              {scan.issues.map((issue, idx) => (
                <li key={idx} className="p-3 border rounded-lg hover:bg-gray-50">
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Charts for this scan */}
      <div ref={chartsRef} className="grid grid-cols-3 gap-6 mt-6">
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

      {/* Download PDF Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Download PDF
      </button>
      <DownloadOptionsModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onDownload={downloadPDF}
      />
    </div>
  );
}