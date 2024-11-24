//app/page.js
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TaxParameters() {
  const [params, setParams] = useState([]); // Existing tax parameters
  const [newParam, setNewParam] = useState({
    year: "",
    incomeTax: {
      personalAllowance: "",
      basicRate: "",
      higherRate: "",
      additionalRate: "",
      basicThreshold: "",
      higherThreshold: "",
      taperThreshold: "",
    },
    nationalInsurance: {
      primaryThreshold: "",
      upperEarningsLimit: "",
      primaryRate: "",
      upperRate: "",
      selfPrimaryRate: "",
      selfUpperRate: "",
    },
  });

  // Fetch existing parameters
  useEffect(() => {
    fetch("/api/tax-parameters")
      .then((res) => res.json())
      .then(setParams)
      .catch((err) => console.error("Error loading parameters:", err));
  }, []);

  // Add or update parameter
  const handleAddOrUpdate = async () => {
    const method = newParam._id ? "PUT" : "POST";
    const url = newParam._id
      ? `/api/tax-parameters/${newParam._id}` // Target dynamic route for PUT
      : "/api/tax-parameters"; // Standard POST route

    // Ensure all fields are properly structured
    const payload = {
      year: newParam.year,
      incomeTax: {
        personalAllowance: +newParam.incomeTax.personalAllowance || 0,
        basicRate: +newParam.incomeTax.basicRate || 0,
        higherRate: +newParam.incomeTax.higherRate || 0,
        additionalRate: +newParam.incomeTax.additionalRate || 0,
        basicThreshold: +newParam.incomeTax.basicThreshold || 0,
        higherThreshold: +newParam.incomeTax.higherThreshold || 0,
        taperThreshold: +newParam.incomeTax.taperThreshold || 0,
      },
      nationalInsurance: {
        primaryThreshold: +newParam.nationalInsurance.primaryThreshold || 0,
        upperEarningsLimit: +newParam.nationalInsurance.upperEarningsLimit || 0,
        primaryRate: +newParam.nationalInsurance.primaryRate || 0,
        upperRate: +newParam.nationalInsurance.upperRate || 0,
        selfPrimaryRate: +newParam.nationalInsurance.primaryRate || 0,
        selfUpperRate: +newParam.nationalInsurance.upperRate || 0,
      },
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${method}`);
      }

      const updatedParam = await response.json();

      // Update the state with the new or updated parameter
      if (method === "PUT") {
        setParams((prev) =>
          prev.map((param) =>
            param._id === updatedParam._id ? updatedParam : param
          )
        );
      } else {
        setParams((prev) => [...prev, updatedParam]);
      }

      // Reset the form
      setNewParam({
        year: "",
        incomeTax: {
          personalAllowance: "",
          basicRate: "",
          higherRate: "",
          additionalRate: "",
          basicThreshold: "",
          higherThreshold: "",
          taperThreshold: "",
        },
        nationalInsurance: {
          primaryThreshold: "",
          upperEarningsLimit: "",
          primaryRate: "",
          upperRate: "",
          selfPrimaryRate: "",
          selfUpperRate: "",
        },
      });
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  // Delete parameter
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tax-parameters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete parameter");
      }

      setParams((prev) => prev.filter((param) => param._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleReload = () => {
    // Reset the form fields to their default state
    setNewParam({
      _id: "",
      year: "",
      incomeTax: {
        personalAllowance: "",
        basicRate: "",
        higherRate: "",
        additionalRate: "",
        basicThreshold: "",
        higherThreshold: "",
        taperThreshold: "",
      },
      nationalInsurance: {
        primaryThreshold: "",
        upperEarningsLimit: "",
        primaryRate: "",
        upperRate: "",
        selfPrimaryRate: "",
        selfUpperRate: "",
      },
    });
  };

  return (
    <div className="p-4 bg-slate-100 min-h-screen">
      <Link
        href="\calculate"
        className="ml-4 bg-slate-500 px-6 py-3 text-white rounded-md flex items-center justify-center gap-2 w-fit"
      >
        <span className="text-lg">Calculate Tax</span>
        <span className="text-2xl"> ➡️</span>
      </Link>
      <h1 className="text-lg font-bold mt-4 mb-4 ml-4">
        Manage Tax & NI Parameters
      </h1>

      {/* Form Section */}
      <div className="bg-gray-100 p-4 mb-8 rounded">
        <h2 className="font-bold mb-4">
          {newParam._id ? "Edit Tax Parameter" : "Add New Tax Parameter"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Year */}
          <div>
            <label className="block font-bold mb-1 text-sm">Tax Year</label>
            <input
              className="border p-2 w-full text-xs"
              type="number"
              placeholder="Year"
              value={newParam.year}
              onChange={(e) =>
                setNewParam({ ...newParam, year: +e.target.value })
              }
            />
          </div>

          {/* Income Tax Fields */}
          {Object.keys(newParam.incomeTax).map((key) => (
            <div key={key}>
              <label className="block font-bold mb-1 text-sm">
                {key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
                {/*Capitalize the first letter of each word*/}
              </label>
              <input
                className="border p-2 w-full text-xs"
                type="number"
                placeholder={key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                value={newParam.incomeTax[key]}
                onChange={(e) =>
                  setNewParam({
                    ...newParam,
                    incomeTax: {
                      ...newParam.incomeTax,
                      [key]: +e.target.value,
                    },
                  })
                }
              />
            </div>
          ))}

          {/* National Insurance Fields */}
          {Object.keys(newParam.nationalInsurance).map((key) => (
            <div key={key}>
              <label className="block font-bold mb-1 text-sm">
                {key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
                {/*Capitalize the first letter of each word*/}
              </label>
              <input
                className="border p-2 w-full text-xs"
                type="number"
                placeholder={key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                value={newParam.nationalInsurance[key]}
                onChange={(e) =>
                  setNewParam({
                    ...newParam,
                    nationalInsurance: {
                      ...newParam.nationalInsurance,
                      [key]: +e.target.value,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
        <button
          className="bg-slate-500 text-white px-4 py-2 mt-4 rounded-md"
          onClick={handleAddOrUpdate}
        >
          {newParam._id ? "Update Parameter" : "Add Parameter"}
        </button>
        {/* Refresh/Reload Button */}
        <button
          className="bg-slate-500 text-white px-4 py-2 rounded-md ml-3"
          onClick={handleReload}
        >
          Refresh
        </button>
      </div>

      {/* Table Section */}
      <table className="table-auto w-full">
        <thead className="text-left text-sm">
          <tr>
            <th className="border px-4 py-2">Tax Year</th>
            <th className="border px-4 py-2">Income Tax</th>
            <th className="border px-4 py-2">National Insurance</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {params.map((p) => (
            <tr key={p._id}>
              <td className="border px-4 py-2">
                {p.year} / {+p.year + 1}
              </td>
              <td className="border px-4 py-2">
                <ul>
                  {Object.entries(p.incomeTax).map(([key, value]) => (
                    <li key={key}>
                      <strong>
                        {key
                          .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                          .toLowerCase() // Convert the entire string to lowercase
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        :
                      </strong>{" "}
                      {value}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2">
                <ul>
                  {Object.entries(p.nationalInsurance).map(([key, value]) => (
                    <li key={key}>
                      <strong>
                        {key
                          .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                          .toLowerCase() // Convert the entire string to lowercase
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        :
                      </strong>{" "}
                      {value}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border px-4 py-2">
                <div className="flex flex-col">
                  <button
                    className="text-left mb-6"
                    onClick={() => setNewParam(p)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-left"
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑️ Trash
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
