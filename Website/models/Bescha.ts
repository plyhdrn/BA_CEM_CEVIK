import mongoose, { Schema } from "mongoose";

export type IBescha = {
  publishedDate: Date;
  releases: {
    id: string;
    buyer?: {
      name: string;
    };
    tender: {
      title: string;
      description: string;
    };
  }[];
  parties: {
    name: string;
  }[];
};

const BeschaSchema = new mongoose.Schema<IBescha>({
  publishedDate: {
    type: Date,
  },
  releases: [
    {
      id: {
        type: String,
      },
      buyer: {
        name: {
          type: String,
        },
      },
      tender: {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    },
  ],
  parties: [
    {
      name: {
        type: String,
      },
    },
  ],
});

export default mongoose.models.Bescha ||
  mongoose.model<IBescha>("Bescha", BeschaSchema);
