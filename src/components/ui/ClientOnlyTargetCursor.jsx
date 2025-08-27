"use client";

import { useState, useEffect } from "react";
import TargetCursor from "./tragetCursor";

const ClientOnlyTargetCursor = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <TargetCursor {...props} />;
};

export default ClientOnlyTargetCursor;
