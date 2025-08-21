import { useState } from "react";
import ResponseDashboard from "./components/ResponseDashboard";
// import AnalysisDashboard from "./components/AnalysisDashboard";
import SubmittedQuery from "./components/SubmitQuery";
import "./App.css";
import EmployeeGroups from "./components/employee_groups";
import QuestionGeneration from "./components/QuestionGeneration";

function App() {
  const [query, setQuery] = useState("");
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null)


  const handleResponseDashboard = () => {
    setActiveDashboard("response");
  };

  const handleNavigate = (page, groupId = null) => {
    setActiveDashboard(page)
    setSelectedGroupId(groupId)  // store groupId when navigating
  }

  const handleAnalysisDashboard = () => {
    setActiveDashboard("submitted");
  };

  //  Reload Data
  const handleReloadData = () => {
    setActiveDashboard("EmployeeGroups");  // redirect to ResponseDashboard
    console.log("Reloading data...");
  };



  const handleSubmit = async () => {
    setSubmittedQuery(query);
    setActiveDashboard("submitted"); // switch to submitted screen

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error calling MCP:", error);
      setResponse({ error: "Failed to connect to MCP" });
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 style={{ color: "white" }}>Query System</h2>
        <div className="button-container">
          <button onClick={handleResponseDashboard}>Response Dashboard</button>
          {<button onClick={handleAnalysisDashboard}>Query Dashboard</button>}

        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query here..."
          rows="10"
          className="query-editor"
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleSubmit} className="submit-button">
            Submit Query
          </button>

          <button onClick={handleReloadData} className="reload-button">
            Reload Data
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeDashboard === "response" && <ResponseDashboard />}
        {/* {activeDashboard === "EmployeeGroups" && <EmployeeGroups />} */}
        {/* {activeDashboard === "analysis" && <AnalysisDashboard />} */}



        {activeDashboard === "EmployeeGroups" && (
          <EmployeeGroups onNavigate={handleNavigate} />
        )}

        {activeDashboard === "QuestionGeneration" && (
          <QuestionGeneration
            groupId={selectedGroupId}   // ✅ pass groupId here
            onNavigate={handleNavigate}
          />
        )}



        {activeDashboard === "submitted" && (
          <SubmittedQuery data={response} />
        )}
      </div>
    </div>
  );
}

export default App;
