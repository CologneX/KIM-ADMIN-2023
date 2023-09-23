import {
  EuiBreadcrumb,
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSectionItemButton,
  EuiHeaderSections,
  EuiIcon,
  EuiAvatar,
  EuiText,
} from "@elastic/eui";
import { useLocation } from "react-router-dom";
export default () => {
  const location = useLocation();
  console.log(location.pathname);
  const renderLogo = (
    <EuiHeaderLogo
      iconType="logoElastic"
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label="Go to home page"
    />
  );
  const renderSpaces = (
    <EuiHeaderSectionItemButton aria-label="Spaces menu">
      <EuiAvatar type="space" name="Sales Team" size="s" />
    </EuiHeaderSectionItemButton>
  );
  const breadcrumbs: EuiBreadcrumb[] = location.pathname
    .split("/")
    .map((p) => ({
      text: p === "" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1),
      href: `/${p}`,
    }));

  const renderSearch = (
    <EuiHeaderSectionItemButton aria-label="Sitewide search">
      <EuiIcon type="search" size="m" />
    </EuiHeaderSectionItemButton>
  );
  const renderUser = (
    <EuiHeaderSectionItemButton aria-label="Account menu">
      <EuiAvatar name="John Username" size="s" />
      <EuiText>John</EuiText>
    </EuiHeaderSectionItemButton>
  );
  const renderApps = (
    <EuiHeaderSectionItemButton
      disabled
      aria-label="Apps menu with 1 new app"
      notification="0"
    >
      <EuiIcon type="arrowStart" size="m" />
    </EuiHeaderSectionItemButton>
  );
  const sections: EuiHeaderSections[] = [
    {
      items: [renderLogo, renderSpaces],
      breadcrumbs: breadcrumbs,
      breadcrumbProps: {
        "aria-label": "Header sections breadcrumbs",
      },
    },
    {
      items: [renderSearch, renderUser, renderApps],
    },
  ];
  return <EuiHeader sections={sections} />;
};
