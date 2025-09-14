import { useEffect, useState } from "react";

export default function Dashboard() {
  const [scan, setScan] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/scan/aws/1")
      .then(res => res.json())
      .then(data => setScan(data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {scan ? (
        <div>
          <p><strong>Status:</strong> {scan.status}</p>
          <p><strong>Issues:</strong> {scan.issues.length}</p>
          <pre>{JSON.stringify(scan.issues, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading scan...</p>
      )}
    </div>
  );
}