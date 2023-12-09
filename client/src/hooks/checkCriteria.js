import React from "react";
import { RxCheck, RxCross2 } from "react-icons/rx";

const CheckCriteria = ({ valid, children }) => {
  const iconProps = {
    className: `text-${valid ? "success" : "danger"}`,
    style: { fontSize: "18px" },
  };

  const fillLineProps = {
    style: {
      flexGrow: 1,
      height: 1,
      borderBottom: "1px dashed #d8dbe0",
    },
  };

  return (
    <div className="flex flex-center flex-gap-10">
      {valid ? <RxCheck {...iconProps} /> : <RxCross2 {...iconProps} />}
      {children}
      <span {...fillLineProps} />
    </div>
  );
};

export default CheckCriteria;
