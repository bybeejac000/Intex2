import { useEffect, useState } from "react";

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("https://cineniche.click/CineNiche/is-admin", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authorized");
        }
        return res.json();
      })
      .then((data) => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  return isAdmin;
}
