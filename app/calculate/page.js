"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Calculator() {
  const [year, setYear] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch available years from the backend
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await fetch("/api/getYears");
        const data = await res.json();
        setAvailableYears(data); // Set the fetched years to state
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };
    fetchYears();
  }, []);

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
    <div className=" pt-2 pl-4 grid place-content-start bg-slate-200 min-h-screen">
      <div className="">
        <Link
          href="\"
          className=" mt-3 bg-slate-500 px-4 py-2 text-white rounded-md flex items-center justify-center gap-2 w-fit"
        >
          <span className="text-lg">Tax & NI Parameters</span>
          <span className="text-2xl"> ➡️</span>
        </Link>
      </div>
      <Link
        className=" mt-2 underline underline-offset-4"
        href="/complextaxtabs"
      >
        Tabs
      </Link>

      <div className=" grid place-content-center">
        <h1 className="text-lg font-bold mt-3">Basic Tax & NI Calculator</h1>
        <p className="text-xs mb-4">Excludes Scotland & Special Allowances</p>

        {/* Year Dropdown */}
        <select
          className="border p-2 pr-6 mr-2 mb-3 rounded-md appearance-none"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        <input
          className="border p-2 mr-2 mb-3 rounded-md"
          placeholder="Annual Income"
          onChange={(e) => setIncome(e.target.value)}
        />
        <button
          className="bg-slate-500 text-white px-4 py-2 rounded-md w-fit"
          onClick={calculate}
        >
          Calculate
        </button>
        {result && (
          <div className="mt-4">
            <p className="ml-1 font-bold text-slate-700">Annual Income Tax</p>
            <div className="bg-stone-100 border border-slate-200 rounded-md p-3 mb-4 shadow-2xl">
              <p>@ 20% = £{result.tax20.toFixed(2)}</p>
              <p>@ 40% = £{result.tax40.toFixed(2)}</p>
              <p>@ 45% = £{result.tax45.toFixed(2)}</p>
              <p className="mt-1">Total = £{result.incomeTax.toFixed(2)}</p>
            </div>

            <p className="ml-1 font-bold text-slate-700">
              Annual National Insurance
            </p>
            <div className="bg-stone-100 border border-slate-200 rounded-md p-3 mb-4 shadow-2xl">
              <p>Employed: £{result.nationalInsurance.toFixed(2)}</p>
              <p>Self Employed: £{result.senationalInsurance.toFixed(2)}</p>
              <p>Pensioner: £0</p>
            </div>

            <p className="ml-1 font-bold text-slate-700">Annual Deductions</p>
            <div className="bg-stone-100 border border-slate-200 rounded-md p-3 mb-4 shadow-2xl">
              <p>
                Employed: £
                {(result.incomeTax + result.nationalInsurance).toFixed(2)}
              </p>
              <p>
                Self-Employed: £
                {(result.incomeTax + result.senationalInsurance).toFixed(2)}
              </p>
              <p>Pensioner: £{result.incomeTax.toFixed(2)}</p>
            </div>

            <p className="ml-1 font-bold text-slate-700">
              Net Income per month
            </p>
            <div className="bg-stone-100 border border-slate-200 rounded-md p-3 mb-4 shadow-2xl">
              <p>
                Employed: £
                {(
                  (result.income -
                    result.incomeTax -
                    result.nationalInsurance) /
                  12
                ).toFixed(2)}
              </p>
              <p>
                Self-Employed: £
                {(
                  (result.income -
                    result.incomeTax -
                    result.senationalInsurance) /
                  12
                ).toFixed(2)}
              </p>
              <p>
                Pensioner: £
                {((result.income - result.incomeTax) / 12).toFixed(2)}
              </p>
            </div>

            <p className="ml-1 font-bold text-slate-700">Effective Tax Rate</p>
            <div className="bg-stone-100 border border-slate-200 rounded-md p-3 mb-10 shadow-2xl">
              <p>
                Employed:{" "}
                {(
                  ((result.incomeTax + result.nationalInsurance) / income) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p>
                Self-Employed:{" "}
                {(
                  ((result.incomeTax + result.senationalInsurance) / income) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p>
                Pensioner: {((result.incomeTax / income) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
