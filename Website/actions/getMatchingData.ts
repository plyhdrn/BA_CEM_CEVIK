"use server";

import Log from "@/models/Log";

export const getMatchingData = async () => {
  const res = await Log.find({
    type: "matching",
  })
    .sort({ startDateTime: -1 })
    .limit(10);
  return res;
};
