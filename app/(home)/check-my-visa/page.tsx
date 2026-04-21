import { Suspense } from "react";

import type { Metadata } from "next";

import VisaCheckPage from "./CheckVisa";
export const metadata: Metadata = {
  title: "Check Visa",
};

const Check = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisaCheckPage />
    </Suspense>
  );
};

export default Check;
