import React, { useState } from "react";

const ParentSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="btn btn-primary d-flex align-items-center justify-content-between w-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default ParentSection;