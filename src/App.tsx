import { EuiProvider } from "@elastic/eui";
import createCache from "@emotion/cache";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Root from "./routes/Root";
import Login from "./routes/Login";
import Protected from "./layouts/Protected";
import Produk from "./routes/product/Produk";
import DaftarUmkm from "./routes/umkm/DaftarUmkm";
import UsersManager from "./routes/UsersManager";
import AdminProtected from "./layouts/AdminProtected";
import Pesanan from "./routes/Pesanan";
import Proposal from "./routes/lending/admin/Proposal";
import UserProposal from "./routes/lending/user/UserProposal";

export const App = () => {
  const cache = createCache({
    key: "css",
    prepend: true,
  });
  cache.compat = true;
  const router = createBrowserRouter([
    {
      element: (
        <>
          <Protected>
            <Layout />
          </Protected>
        </>
      ),
      children: [
        {
          path: "/",
          element: <Root />,
        },
        {
          path: "/daftar-umkm",
          element: <DaftarUmkm />,
        },
        {
          path: "/produk",
          element: <Produk />,
        },
        {
          path: "/manager-pengguna",
          element: <UsersManager />,
        },
        {
          path: "/pesanan",
          element: <Pesanan />,
        },
        {
          path: "/manajer-pengguna",
          element: (
            <>
              <AdminProtected>
                <UsersManager />
              </AdminProtected>
            </>
          ),
        },
        {
          path: "/admin/pinjaman",
          element: (
            <>
              <AdminProtected>
                <Proposal />
              </AdminProtected>
            </>
          ),
        },
        {
          path: "/user/pinjaman/",
          element: (
            <>
              <UserProposal />
            </>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <EuiProvider colorMode="dark" cache={cache}>
      <RouterProvider router={router} />
    </EuiProvider>
  );
};
