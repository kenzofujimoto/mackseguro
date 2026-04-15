import { useEffect, useState } from "react";
import { subscribeToUserDataChanges } from "../lib/userData.ts";

export function useUserDataRefresh(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    return subscribeToUserDataChanges(() => {
      setVersion((previous) => previous + 1);
    });
  }, []);

  return version;
}
