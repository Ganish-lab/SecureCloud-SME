import { useState } from "react";

export default function AddAssets() {
  const [assets, setAssets] = useState({
    website: "",
    ip: "",
    api: "",
    internalIps: "",
    onPrem: "",
    configFiles: "",
  });

  const handleChange = (e) => {
    setAssets({ ...assets, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assets submitted:", assets);
    // TODO: Send to backend
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Assets for Scanning</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow">
        <input
          type="text"
          name="website"
          placeholder="Public Website / Domain (e.g. ganira.co.ke)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="ip"
          placeholder="Public IP Address (e.g. 41.xxx.xxx.xx)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="api"
          placeholder="Web Applications / APIs (e.g. api.ganira.co.ke)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="internalIps"
          placeholder="Internal IP ranges (optional, e.g. 192.168.x.x)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="onPrem"
          placeholder="On-premise servers / applications (optional)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="configFiles"
          placeholder="Config files info (optional)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center">
          <input type="checkbox" required className="mr-2" />
          I confirm I own these assets and authorize scanning
        </label>

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Assets
        </button>
      </form>
    </div>
  );
}