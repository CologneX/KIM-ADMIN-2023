import {
  EuiFlexGroup,
  EuiLoadingSpinner,
  EuiPageTemplate,
  EuiText,
} from "@elastic/eui";
import React from "react";
import { useNavigate } from "react-router-dom";

export default ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    localStorage.getItem("user") ? setLoggedIn(true) : setLoggedIn(false);
  }, [isLoggedIn]);
  const navigator = useNavigate();

  switch (isLoggedIn) {
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
      navigator("/login", { replace: true });
  }
};
