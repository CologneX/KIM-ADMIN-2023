import { EuiLoadingSpinner, EuiPageTemplate, EuiText } from "@elastic/eui";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { User } from "../types/user";
import { useRootGlobalToast } from "./Layout";

export default ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useRootGlobalToast();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    if (localStorage.getItem("user")) {
      (JSON.parse(localStorage.getItem("user")!) as User).is_admin === true
        ? setIsAdmin(true)
        : setIsAdmin(false);
    } else {
      setIsAdmin(false);
    }
  }, []);
  const navigator = useNavigate();
  switch (isAdmin) {
    case null:
      return (
        <EuiPageTemplate.Section alignment="center">
          <EuiLoadingSpinner size="xl" />
          <EuiText>Sedang mengecek autentikasi...</EuiText>
        </EuiPageTemplate.Section>
      );
    case true:
      return <>{children}</>;
    case false:
      <Navigate to="/login" state={{ from: location }} replace />;
      addToast({
        title: "Akses ditolak",
        color: "warning",
        iconType: "alert",
        text: <EuiText>Anda tidak memiliki akses ke halaman ini</EuiText>,
      });

      navigator("/", { replace: true });
  }
};
