"use client";
import { useState } from "react";
import Link from "next/link";

export default function Calculator() {
  const [year, setYear] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  const calculate = async () => {
    const res = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, income }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-4 mt-3 grid place-content-center">
      <Link
        href="\"
        className="ml-4 bg-blue-500 px-6 py-3 text-white rounded-md flex items-center justify-center gap-2 w-fit"
      >
        <span className="text-lg">Tax & NI Parameters</span>
        <span className="text-4xl"> ➡️</span>
      </Link>
      <Link
        className="ml-4 mt-2 underline underline-offset-4"
        href="/complextaxtabs"
      >
        Tabs
      </Link>

      <div className="ml-4 grid place-content-center">
        <h1 className="text-lg font-bold mt-3 mb-2">
          Employee Tax & NI Calculator
        </h1>

        <input
          className="border p-2 mr-2 mb-3 rounded-md"
          placeholder="Year"
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          className="border p-2 mr-2 mb-3 rounded-md"
          placeholder="Annual Income"
          onChange={(e) => setIncome(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={calculate}
        >
          Calculate
        </button>
        {result && (
          <div className="mt-4">
            <p className="mb-1 font-bold">Annual Income Tax...</p>
            <p>@ 20% = £{result.tax20.toFixed(2)}</p>
            <p>@ 40% = £{result.tax40.toFixed(2)}</p>
            <p>@ 45% = £{result.tax45.toFixed(2)}</p>

            <p className="mt-1 mb-3">Total = £{result.incomeTax.toFixed(2)}</p>

            <p>
              <span className="font-bold mb-3">
                Annual National Insurance...
              </span>
              <br></br>£{result.nationalInsurance.toFixed(2)}
            </p>
            <p className="font-bold mt-3">Annual Deductions...</p>
            <p className="mb-3">
              £{(result.incomeTax + result.nationalInsurance).toFixed(2)}
            </p>
            <p className="mt-3 font-bold">Take home pay per month...</p>
            <p className="mb-3">
              £
              {(
                (result.income - result.incomeTax - result.nationalInsurance) /
                12
              ).toFixed(2)}
            </p>
            <p className="mt-3 font-bold">Effective Tax Rate...</p>
            <p>
              {(
                ((result.incomeTax + result.nationalInsurance) / income) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
