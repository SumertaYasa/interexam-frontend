import React, { useState, useEffect } from "react";

const RegisForm = React.lazy(() => import("./RegisInternalForm"));

export default function RegisFormWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RegisForm />
    </React.Suspense>
  );
}
