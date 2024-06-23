import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import React from "react";

const CompanyAnalytics = async () => {
  await dbConnect();

  const data = await Company.countDocuments();

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Total Company Count</span>
        <span className="text-4xl font-medium">{data}</span>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
