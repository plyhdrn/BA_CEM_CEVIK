export const diffCharsView = (part, i) => {
  if (part.added) {
    return (
      <span className="bg-blue-100 text-blue-800 break-all" key={i}>
        {part.value}
      </span>
    );
  } else if (part.removed) {
    return (
      <span className="bg-red-100 text-red-800 break-all" key={i}>
        {/* {part.value.replace(/ /g, "␣")} */}
      </span>
    );
  } else {
    return (
      <span key={i} className="bg-green-100 text-green-800 break-all">
        {part.value}
      </span>
    );
  }
};
