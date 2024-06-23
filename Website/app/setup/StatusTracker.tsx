"use client";

import { useEffect } from "react";

const StatusTracker = ({
  children,
  test,
}: {
  children: React.ReactNode;
  test: () => void;
}) => {
  // Run every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      test();
    }, 2000);
    return () => clearInterval(interval);
  }, [test]);
  return <div>{children}</div>;
};

export default StatusTracker;
