"use client";

import { IMetaView } from "@/models/Meta";
import ResultCard from "./resultCard";
import { Fade } from "react-awesome-reveal";

const resultCardWrapper = ({ metas }: { metas: IMetaView[] }) => {
  return (
    <Fade duration={800} triggerOnce cascade damping={0}>
      {metas.map((meta: IMetaView) => (
        <ResultCard
          key={meta.entryId}
          meta={JSON.parse(JSON.stringify(meta))}
        />
      ))}
    </Fade>
  );
};

export default resultCardWrapper;
