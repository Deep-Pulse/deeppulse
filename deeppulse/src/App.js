import './App.css';
import React, { useState } from "react";

function ResponseDashboard() {
  // State for filters
  const [trigger, setTrigger] = useState("Overall");
  const [category, setCategory] = useState("All");
  const [timePeriod, setTimePeriod] = useState("Overall");

  // Mock categories for different triggers (no type annotation in JS)
  const categoriesByTrigger = {
    Overall: ["All", "Work Environment", "Leadership", "Growth"],
    "Role Change": ["Training", "Clarity", "Resources"],
    "Manager Change": ["Leadership Style", "Support", "Communication"],
    Promotion: ["Fairness", "Career Growth", "Satisfaction"],
  };

  // KPI Data (dummy for now)
  const summary = {
    totalResponses: 150,
    satisfactionRate: 82,
    positiveSentiment: 68,
  };

  const kpis = [
    { title: "Engagement Score", value: "7.5/10" },
    { title: "Retention Risk", value: "12%" },
    { title: "Avg Feedback Score", value: "4.2/5" },
    { title: "High Performers Happy", value: "78%" },
  ];

  const insights = [
    "Employees promoted recently show higher satisfaction.",
    "Manager change feedback indicates communication issues.",
    "Role change employees request better onboarding support.",
  ];

  const handleApplyFilters = () => {
    // TODO: fetch filtered data from backend here
    console.log("Applied Filters:", { trigger, category, timePeriod });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h3 className="text-gray-600">Total Responses</h3>
          <p className="text-2xl font-bold">{summary.totalResponses}</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h3 className="text-gray-600">Satisfaction Rate</h3>
          <p className="text-2xl font-bold">{summary.satisfactionRate}%</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h3 className="text-gray-600">Positive Sentiment</h3>
          <p className="text-2xl font-bold">{summary.positiveSentiment}%</p>
        </div>
      </div>

      {/* Filters & KPI Tile */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Filter Employee Feedback
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Trigger */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Trigger</label>
            <select
              value={trigger}
              onChange={(e) => {
                setTrigger(e.target.value);
                setCategory("All");
              }}
              className="border rounded-lg p-2"
            >
              {Object.keys(categoriesByTrigger).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2"
            >
              {categoriesByTrigger[trigger].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Time Period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="border rounded-lg p-2"
            >
              <option>Overall</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>

          {/* Go Button */}
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border rounded-2xl p-4 text-center shadow-sm"
            >
              <h3 className="text-sm text-gray-500">{kpi.title}</h3>
              <p className="text-xl font-semibold">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="bg-gray-50 border rounded-2xl p-4 shadow-sm">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Insights</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResponseDashboard;