import React from "react";

import type { Metadata } from "next";

import VisaCheckPage from "./CheckVisa";
export const metadata: Metadata = {
  title: "Check Visa",
};

const Check = () => {
  return (
    <div>
      <VisaCheckPage />
    </div>
  );
};

export default Check;
