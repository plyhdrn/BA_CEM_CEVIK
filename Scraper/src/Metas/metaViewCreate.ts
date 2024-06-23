import mongoose from "mongoose";

export const createMetaView = async (): Promise<void> => {
  await mongoose.connection.db.createCollection("metaView", {
    viewOn: "tedMeta",
    pipeline: [
      {
        $unionWith: {
          coll: "beschaMeta",
        },
      },
    ],
  });
};
