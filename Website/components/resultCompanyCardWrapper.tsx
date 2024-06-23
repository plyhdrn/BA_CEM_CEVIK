"use client";

import { ICompany } from "@/models/Company";
import { Fade } from "react-awesome-reveal";
import ResultCompanyCard from "./resultCompanyCard";

const ResultCompanyCardWrapper = ({ companies }: { companies: ICompany[] }) => {
  return (
    <Fade duration={800} triggerOnce cascade damping={0}>
      {companies.map((company: ICompany) => (
        <ResultCompanyCard key={company._id} company={company} />
      ))}
    </Fade>
  );
};

export default ResultCompanyCardWrapper;
