import {
  EuiAvatar,
  EuiButtonEmpty,
  EuiCollapsibleNav,
  EuiCollapsibleNavGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiGlobalToastList,
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiPage,
  EuiPageBody,
  EuiPinnableListGroup,
  EuiPinnableListGroupItemProps,
  EuiPopover,
  EuiPortal,
  EuiSelectableTemplateSitewide,
  EuiShowFor,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import React from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import useToast, { toast } from "../hooks/useToast";
import { css } from "@emotion/react";
import { User } from "../types/user";

const SideNav = (): React.ReactElement => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")!) as User;

  const [navIsOpen, setNavIsOpen] = React.useState<boolean>(
    localStorage.getItem("navIsDocked") === "true"
  );
  const [navIsDocked, setNavIsDocked] = React.useState<boolean>(
    localStorage.getItem("navIsDocked") === "true" || true
  );
  const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] =
    React.useState(false);

  const sidebarNav: EuiPinnableListGroupItemProps[] = [
    {
      label: "Utama",
      iconType: "home",
      isActive: pathname.pathname === "/",
      onClick: () => navigate("/"),
    },
  ];
  return (
    <EuiCollapsibleNav
      id="CollapsibleNavBarPrimary"
      aria-label="Main navigation"
      isOpen={navIsOpen}
      isDocked={navIsDocked}
      onClose={() => setNavIsOpen(false)}
      button={
        <EuiHeaderSectionItemButton
          aria-label="Toggle main navigation"
          onClick={() => setNavIsOpen(!navIsOpen)}
        >
          <EuiIcon type={"menu"} size="m" aria-hidden="true" />
        </EuiHeaderSectionItemButton>
      }
    >
      <EuiFlexItem
        className="eui-yScroll"
        css={css`
          @media (max-height: 15em) {
            flex: 1 0 auto;
          }
        `}
      >
        <EuiCollapsibleNavGroup background="light">
          <EuiPinnableListGroup
            listItems={sidebarNav}
            onPinClick={() => {}}
            maxWidth="none"
            color="text"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>
        <EuiCollapsibleNavGroup
          title="UMKM"
          iconType="usersRolesApp"
          isCollapsible={true}
          initialIsOpen={false}
        >
          <EuiPinnableListGroup
            aria-label="UMKM"
            listItems={[
              {
                label: "Daftar UMKM",
                onClick: () => navigate("/daftar-umkm"),
                isActive: pathname.pathname === "/dafar-umkm",
              },
            ]}
            onPinClick={() => {}}
          />
        </EuiCollapsibleNavGroup>
        <EuiCollapsibleNavGroup
          title="Produk Desa"
          iconType="spacesApp"
          isCollapsible={true}
          initialIsOpen={false}
        >
          <EuiPinnableListGroup
            aria-label="Produk Desa"
            listItems={[
              {
                label: "Daftar Produk",
                onClick: () => navigate("/produk"),
                isActive: pathname.pathname === "/produk",
              },
            ]}
            onPinClick={() => {}}
          />
        </EuiCollapsibleNavGroup>
        <EuiCollapsibleNavGroup
          title="Pesanan"
          iconType="canvasApp"
          isCollapsible={true}
          initialIsOpen={true}
        >
          <EuiPinnableListGroup
            aria-label="Pesanan-Orders"
            listItems={[
              {
                label: "Pesanan",
                onClick: () => navigate("/pesanan"),
                isActive: pathname.pathname === "/pesanan",
              },
            ]}
            onPinClick={() => {}}
          />
        </EuiCollapsibleNavGroup>
        {user.is_admin && (
          <>
            <EuiCollapsibleNavGroup
              title="Pengguna"
              iconType="canvasApp"
              isCollapsible={true}
              initialIsOpen={true}
            >
              <EuiPinnableListGroup
                aria-label="Pesanan-Orders"
                listItems={[
                  {
                    label: "Manajer Pengguna",
                    onClick: () => navigate("/manajer-pengguna"),
                    isActive: pathname.pathname === "/manajer-pengguna",
                  },
                ]}
                onPinClick={() => {}}
              />
            </EuiCollapsibleNavGroup>
            <EuiCollapsibleNavGroup
              title="Admin"
              iconType="canvasApp"
              isCollapsible={true}
              initialIsOpen={true}
            >
              <EuiPinnableListGroup
                aria-label="Pesanan-Orders"
                listItems={[
                  {
                    label: "Proposal Peminjam",
                    onClick: () => navigate("/admin/pinjaman"),
                    isActive: pathname.pathname === "/admin/pinjaman",
                  },
                ]}
                onPinClick={() => {}}
              />
            </EuiCollapsibleNavGroup>
          </>
        )}
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <span />
        <EuiCollapsibleNavGroup>
          <EuiButtonEmpty color="danger" iconType="exit">
            Log Out
          </EuiButtonEmpty>
        </EuiCollapsibleNavGroup>
      </EuiFlexItem>
    </EuiCollapsibleNav>
  );
};

const UserMenu = () => {
  const username = (JSON.parse(localStorage.getItem("user")!) as User)
    .username as string;
  return (
    <EuiHeaderSectionItemButton
      aria-controls="headerUserMenu"
      aria-expanded={false}
    >
      <EuiFlexGroup alignItems="center" gutterSize="m">
        <EuiFlexItem grow={false}>
          <EuiAvatar type="space" size="s" name={username} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText>{username}</EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiHeaderSectionItemButton>
  );
};

const AuthLogMenu = ({
  setIsFlyoutVisible,
  addToast,
}: {
  setIsFlyoutVisible: React.Dispatch<React.SetStateAction<boolean>>;
  addToast: (newToast: Omit<toast, "id">) => void;
}) => {
  return (
    <EuiPortal>
      <EuiFlyout onClose={() => setIsFlyoutVisible(false)} size="m">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="s">
            <h2>Authentication Management</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <h1>here</h1>
        </EuiFlyoutBody>
      </EuiFlyout>
    </EuiPortal>
  );
};

const Root = () => {
  let navigate = useNavigate();
  const [isFlyoutAlertVisible, setIsFlyoutAlertVisible] = React.useState(false);
  const { getAllToasts, removeToast, addToast } = useToast();
  return (
    <>
      <EuiHeader
        position="fixed"
        sections={[
          {
            items: [
              <SideNav />,
              <EuiHeaderLogo
                iconType="logoObservability"
                className="eui-textInheritColor"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                Kopdisu
              </EuiHeaderLogo>,
            ],
          },
          {
            items: [
              <EuiShowFor sizes={["m", "l", "xl"]}>
                <EuiSelectableTemplateSitewide
                  options={[]}
                  searchProps={{
                    placeholder: "Search...",
                    compressed: true,
                  }}
                  style={{ width: 600 }}
                />
              </EuiShowFor>,
            ],
          },
          {
            items: [
              <EuiHeaderSectionItemButton
                onClick={() => setIsFlyoutAlertVisible(!isFlyoutAlertVisible)}
              >
                <EuiIcon type="desktop" size="m" aria-label="Alert" />
              </EuiHeaderSectionItemButton>,
              <UserMenu />,
            ],
          },
        ]}
      />
      {isFlyoutAlertVisible ? (
        <AuthLogMenu
          setIsFlyoutVisible={setIsFlyoutAlertVisible}
          addToast={addToast}
        />
      ) : null}
      <EuiPage
        paddingSize="xl"
        style={{
          minHeight: "100vh",
        }}
      >
        <EuiPageBody>
          <EuiSpacer size="xxl" />
          <Outlet context={{ addToast }} />
        </EuiPageBody>
      </EuiPage>
      <EuiGlobalToastList
        toasts={getAllToasts()}
        dismissToast={({ id }) => removeToast(id)}
        toastLifeTimeMs={6000}
      />
    </>
  );
};

export function useRootGlobalToast() {
  return useOutletContext<{
    addToast: (newToast: Omit<toast, "id">) => void;
  }>();
}

export default Root;
