"use client";

import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

const RawView = ({ entry }) => {
  return (
    <JsonView
      className="sm:text-sm text-xs"
      src={entry}
      collapseStringsAfterLength={50}
    />
  );
};

export default RawView;
