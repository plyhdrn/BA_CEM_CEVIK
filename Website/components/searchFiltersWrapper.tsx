"use client";

import Reveal, { Slide } from "react-awesome-reveal";
import DateFilter from "./dateFilter";
import ResultFilter from "./resultFilter";
import { keyframes } from "@emotion/react";

const SearchFiltersWrapper = ({
  source,
  setSource,
  searchParams,
  replace,
  pathname,
  amount,
  setAmount,
  hasSeller,
  setHasSeller,
  from,
  setFrom,
  to,
  setTo,
}) => {
  const customAnimation = keyframes`
from {
  transform: translate3d(0, -50%, 0);
  visibility: visible;
}

to {
  transform: translate3d(0, 0, 0);
}
`;

  return (
    <Reveal duration={300} keyframes={customAnimation} triggerOnce>
      <ResultFilter
        source={source}
        setSource={setSource}
        searchParams={searchParams}
        replace={replace}
        pathname={pathname}
        amount={amount}
        setAmount={setAmount}
        hasSeller={hasSeller}
        setHasSeller={setHasSeller}
      />
      <DateFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
    </Reveal>
  );
};

export default SearchFiltersWrapper;
