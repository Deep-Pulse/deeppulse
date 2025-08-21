import React from "react";

const SubmittedQuery = ({ data }) => {
  return (
    <div className="submitted-query">
      <h2>Fetched Response</h2>
      <pre>{data?.response || "No response available"}</pre>
    </div>
  );
};

export default SubmittedQuery;
