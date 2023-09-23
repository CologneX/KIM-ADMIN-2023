import {
  EuiFlexGroup,
  EuiLoadingSpinner,
  EuiPageTemplate,
  EuiText,
} from "@elastic/eui";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types/user";
import { useRootGlobalToast } from "./Layout";

export default ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useRootGlobalToast();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    (JSON.parse(localStorage.getItem("user")!) as User).is_admin === true
      ? setIsAdmin(true)
      : setIsAdmin(false);
  }, [isAdmin]);
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
      addToast({
        title: "Akses ditolak",
        color: "warning",
        iconType: "alert",
        text: <EuiText>Anda tidak memiliki akses ke halaman ini</EuiText>,
      });

      navigator("/", { replace: true });
  }
};
