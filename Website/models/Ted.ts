import mongoose, { Schema } from "mongoose";

export type ITed = {
  "publication-date": Date;
  "publication-number": string;
  "buyer-name": {
    deu: [string];
  };
  "notice-title": {
    deu: string;
  };
  links: {
    xml: { MUL: string };
    pdf: { DEU: string };
    pdfs: { DEU: string };
    html: { DEU: string };
    htmlDirect: { DEU: string };
  };
};

const TedSchema = new mongoose.Schema<ITed>({
  "publication-date": {
    type: Date,
  },
  "publication-number": {
    type: String,
  },
  "buyer-name": {
    deu: [String],
  },
  "notice-title": {
    deu: String,
  },
  links: {
    xml: {
      MUL: String,
    },
    pdf: {
      DEU: String,
    },
    pdfs: {
      DEU: String,
    },
    html: {
      DEU: String,
    },
    htmlDirect: {
      DEU: String,
    },
  },
});

export default mongoose.models.Ted || mongoose.model<ITed>("Ted", TedSchema);
