import React from "react";

const SearchResultInfo = ({
  totalDocs,
  totalPages,
  searchParams,
}: {
  totalDocs: number;
  totalPages: number;
  searchParams: { page: number };
}) => {
  return (
    <div className="flex">
      <div className="text-sm text-muted-foreground">
        {totalDocs} results found
      </div>
      <div className="flex-grow"></div>
      <div className="text-sm text-muted-foreground">
        Page {searchParams.page || 1} of {totalPages}
      </div>
    </div>
  );
};

export default SearchResultInfo;
