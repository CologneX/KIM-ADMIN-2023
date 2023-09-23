import {
  Comparators,
  Criteria,
  DefaultItemAction,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonEmpty,
  EuiConfirmModal,
  EuiFieldPassword,
  EuiFieldSearch,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiPageTemplate,
  EuiSpacer,
  EuiSwitch,
  EuiTablePagination,
  EuiTableSelectionType,
  EuiTableSortingType,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import refreshToken from "../components/refreshToken";
import { CreateUser, UpdateUser, User, Users } from "../types/user";
import { useEffect, useRef, useState } from "react";

import { useRootGlobalToast } from "../layouts/Layout";
import CenterLoading from "../components/CenterLoading";

import { Errors } from "../types/error";

const handleGetUsers = async () => {
  const req = async () => {
    const res = await fetch(`/api/v1/auth/user`);
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      if (!res.ok) {
        return Promise.reject(await res.json());
      }
      return await res.json();
    }
    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

const handleCreateUser = async (User: CreateUser) => {
  const req = async () => {
    const res = await fetch(`/api/v1/auth/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    });
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      if (res.status !== 201) {
        return Promise.reject(await res.json());
      }
      return true;
    }
    if (res.status !== 201) {
      return Promise.reject(await res.json());
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const handleUpdateUser = async (User: User) => {
  const req = async () => {
    const res = await fetch(`/api/v1/auth/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    });
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      if (!res.ok) {
        return Promise.reject(await res.json());
      }
      return true;
    }
    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const handleDeleteUser = async (id: string) => {
  const req = async () => {
    const res = await fetch(`/api/v1/auth/user?id=${id}`, {
      method: "DELETE",
    });
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      if (!res.ok) {
        return Promise.reject(await res.json());
      }
      return true;
    }
    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export default () => {
  const [searchUser, setSearchUser] = useState<string>("");
  const [isTableRefreshing, setTableRefreshing] = useState<boolean>(false);
  const [isTableLoading, setTableLoading] = useState<boolean>(true);
  const [usersData, setUsersData] = useState<Users[]>([]);
  const [isAddUserFlyoutVisible, setAddUserFlyoutVisible] =
    useState<boolean>(false);
  const { addToast } = useRootGlobalToast();

  useEffect(() => {
    setTableLoading(true);
    const fetchUsers = async () => {
      try {
        const data = await handleGetUsers();
        setUsersData(data);
        setTableLoading(false);
      } catch (error) {
        const err = error as Errors;
        addToast({
          title: "Gagal",
          color: "warning",
          iconType: "alert",
          text: <EuiText>{err.error}</EuiText>,
        });
        setTableLoading(false);
      }
    };
    fetchUsers();
    setTableRefreshing(false);
  }, [isTableRefreshing === true]);
  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexItem grow={false}>
          <EuiTitle size="l">
            <span>Manajer Pengguna</span>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceBetween" direction="row">
            <EuiFlexItem grow>
              <EuiFieldSearch
                value={searchUser}
                placeholder="Cari Pengguna..."
                onChange={(e) => {
                  setSearchUser(e.target.value);
                }}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup>
                <EuiButton
                  fill
                  iconType={"plusInCircleFilled"}
                  onClick={() => setAddUserFlyoutVisible(true)}
                >
                  Tambah Pengguna
                </EuiButton>
                <EuiButtonEmpty
                  iconType={"refresh"}
                  onClick={() => setTableRefreshing(true)}
                >
                  Refresh
                </EuiButtonEmpty>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
        </EuiFlexItem>
        <EuiFlexItem grow>
          <UsersTable
            {...{
              usersData,
              isTableRefreshing,
              isTableLoading,
              searchUser,
              setTableRefreshing,
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <AddUserFlyout
        {...{
          isAddUserFlyoutVisible,
          setAddUserFlyoutVisible,
          setTableRefreshing,
        }}
      />
    </>
  );
};

const UsersTable = ({
  usersData,
  isTableRefreshing,
  isTableLoading,
  setTableRefreshing,
  searchUser,
}: {
  usersData: Users[];
  isTableRefreshing: boolean;
  setTableRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  isTableLoading: boolean;
  searchUser: string;
}) => {
  const tableRef = useRef<EuiBasicTable | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditUsersFlyoutVisible, setIsEditUsersFlyoutVisible] =
    useState(false);
  const [sortField, setSortField] = useState<keyof Users>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const onSelectionChange = (selectedItems: Users[]) => {};
  const selection: EuiTableSelectionType<Users> = {
    onSelectionChange,
  };
  const onTableChange = ({ sort }: Criteria<Users>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const findProducts = (
    products: Users[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Users,
    sortDirection: "asc" | "desc",
    searchProduct: string
  ) => {
    let items;

    if (!products) {
      return {
        pageOfItems: [],
        totalItemCount: 0,
      };
    }
    if (sortField) {
      items = products
        .slice(0)
        .sort(
          Comparators.property(sortField, Comparators.default(sortDirection))
        );
    } else {
      items = products;
    }
    let searchedItems;
    if (searchProduct) {
      searchedItems = items.filter((item) =>
        item.username.toLowerCase().includes(searchProduct.toLowerCase())
      );
    } else {
      searchedItems = items;
    }

    let pageOfItems;

    if (!pageIndex && !pageSize) {
      pageOfItems = searchedItems;
    } else {
      const startIndex = pageIndex * pageSize;
      pageOfItems = searchedItems?.slice(
        startIndex,
        Math.min(startIndex + pageSize, products.length)
      );
    }

    return {
      pageOfItems,
      totalItemCount: searchedItems.length,
    };
  };

  const { pageOfItems, totalItemCount } = findProducts(
    usersData,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    searchUser
  );
  const pageSizeOptions = [0, 15, 30, 50, 100];

  const sorting: EuiTableSortingType<Users> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const actions: Array<DefaultItemAction<Users>> = [
    {
      name: "Hapus",
      description: "Hapus user ini",

      icon: "trash",
      color: "danger",
      type: "icon",
      isPrimary: true,
      onClick: (e) => {
        setSelectedUser(e);
        setDeleteModalVisible(true);
      },
      "data-test-subj": "action-delete",
    },
    {
      name: "Edit",
      isPrimary: true,
      description: "edit user ini",
      icon: "pencil",
      onClick: (e) => {
        setSelectedUser(e);
        setIsEditUsersFlyoutVisible(true);
      },
      type: "icon",

      "data-test-subj": "action-edit",
    },
  ];
  const columns: Array<EuiBasicTableColumn<Users>> = [
    {
      field: "id",
      name: "ID",
      sortable: false,
    },
    {
      field: "username",
      name: "Username",
      sortable: true,
    },
    {
      field: "is_admin",
      name: "Apakah Admin?",
      render: (is_admin: boolean) => {
        return <>{is_admin ? "Ya" : "Tidak"}</>;
      },
    },
    {
      field: "updated_on",
      name: "Pengguna terahir diperbarui",
      sortable: true,
      render: (updated_on: number) => {
        const date = new Date(updated_on);
        return (
          <>
            {date.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </>
        );
      },
    },
    {
      field: "",
      name: "",
      actions,
    },
  ];

  const changeItemsPerPage = (pageSize: number) => {
    setPageIndex(0);
    setPageSize(pageSize);
  };
  const changePageIndex = (pageNumber: number) => {
    setPageIndex(pageNumber);
  };
  return (
    <>
      <DeleteUserModal
        {...{
          isDeleteModalVisible,
          setDeleteModalVisible,
          userInfo: selectedUser,
          setTableRefreshing,
        }}
      />

      {!isTableLoading && (
        <div>
          <EuiBasicTable
            tableCaption="Demo for EuiBasicTable with selection"
            ref={tableRef}
            items={pageOfItems}
            columns={columns}
            rowHeader="id"
            itemId="id"
            loading={isTableRefreshing}
            // selection={selection}
            // isSelectable={true}
            sorting={sorting}
            onChange={onTableChange}
            hasActions={true}
          />
          <EuiPageTemplate.BottomBar>
            <EuiTablePagination
              aria-label="Table pagination example"
              pageCount={totalItemCount / pageSize}
              activePage={pageIndex}
              onChangePage={changePageIndex}
              itemsPerPage={pageSize}
              onChangeItemsPerPage={changeItemsPerPage}
              itemsPerPageOptions={pageSizeOptions}
            />
          </EuiPageTemplate.BottomBar>
        </div>
      )}

      {isTableLoading && <CenterLoading />}
      <EditUserFlyout
        {...{
          isEditUsersFlyoutVisible,
          setIsEditUsersFlyoutVisible,
          setTableRefreshing,
          userInfo: selectedUser,
        }}
      />
    </>
  );
};

const DeleteUserModal = ({
  isDeleteModalVisible,
  setDeleteModalVisible,
  userInfo,
  setTableRefreshing,
}: {
  isDeleteModalVisible: boolean;
  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: Users | null;
  setTableRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { addToast } = useRootGlobalToast();
  const closeDestroyModal = () => setDeleteModalVisible(false);
  const showDestroyModal = async () => {
    handleDeleteUser(userInfo?.id as string);
    setTableRefreshing(true);
    addToast({
      title: "Berhasil menghapus pengguna",
      color: "success",
      iconType: "check",
    });
    setDeleteModalVisible(false);
  };
  let modal;
  if (isDeleteModalVisible) {
    modal = (
      <EuiConfirmModal
        title="Hapus Produk?"
        onCancel={closeDestroyModal}
        onConfirm={showDestroyModal}
        cancelButtonText="Batal"
        confirmButtonText="Ya, yakin"
        buttonColor="danger"
      >
        Apakah anda yakin ingin menghapus pengguna {userInfo?.username}?
      </EuiConfirmModal>
    );
  }
  return <>{modal}</>;
};

const AddUserFlyout = ({
  isAddUserFlyoutVisible,
  setAddUserFlyoutVisible,
  setTableRefreshing,
}: {
  isAddUserFlyoutVisible: boolean;
  setAddUserFlyoutVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTableRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { addToast } = useRootGlobalToast();
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [AddUserForm, setAddUserForm] = useState<CreateUser>({
    username: "",
    password: "",
    is_admin: false,
  });
  const closeAddUserFlyout = () => setAddUserFlyoutVisible(false);
  let flyout;
  const processAddProduct = async () => {
    try {
      setIsAddingUser(true);
      const res = await handleCreateUser(AddUserForm);

      addToast({
        title: "Berhasil",
        color: "success",
        text: <EuiText>Masukkan User Baru Berhasil, {res}</EuiText>,
      });
      setIsAddingUser(false);
      setTableRefreshing(true);
      setAddUserFlyoutVisible(false);
    } catch (error) {
      const err = error as Errors;
      addToast({
        title: "Gagal",
        color: "danger",
        text: <EuiText>{err.error}</EuiText>,
      });
    }
    setIsAddingUser(false);
  };
  if (isAddUserFlyoutVisible) {
    flyout = (
      <>
        <EuiFlyout
          onClose={closeAddUserFlyout}
          size="s"
          aria-labelledby="Add User"
        >
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h2 id="Add User">Tambah Pengguna</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiFlexGroup direction="column">
              <EuiFormRow label="Username" fullWidth>
                <EuiFieldText
                  value={AddUserForm.username}
                  onChange={(e) => {
                    setAddUserForm({
                      ...AddUserForm,
                      username: e.target.value,
                    });
                  }}
                />
              </EuiFormRow>
              <EuiFormRow label="Password" fullWidth>
                <EuiFieldPassword
                  type="dual"
                  value={AddUserForm.password}
                  onChange={(e) => {
                    setAddUserForm({
                      ...AddUserForm,
                      password: e.target.value,
                    });
                  }}
                />
              </EuiFormRow>
              <EuiFormRow label="Apakah Admin?" fullWidth>
                <EuiSwitch
                  label={AddUserForm.is_admin ? "Admin" : "Bukan Admin"}
                  checked={AddUserForm.is_admin}
                  onChange={(e) => {
                    setAddUserForm({
                      ...AddUserForm,
                      is_admin: e.target.checked,
                    });
                  }}
                />
              </EuiFormRow>
            </EuiFlexGroup>
          </EuiFlyoutBody>
          <EuiFlyoutFooter>
            <EuiButton
              isLoading={isAddingUser}
              onClick={processAddProduct}
              fill
              fullWidth
            >
              Tambah Pengguna
            </EuiButton>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </>
    );
  }
  return <>{flyout}</>;
};

const EditUserFlyout = ({
  isEditUsersFlyoutVisible,
  setIsEditUsersFlyoutVisible,
  setTableRefreshing,
  userInfo,
}: {
  isEditUsersFlyoutVisible: boolean;
  setIsEditUsersFlyoutVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTableRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: Users | null;
}) => {
  const { addToast } = useRootGlobalToast();
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);
  const [UpdateUserForm, setUpdateUserForm] = useState<UpdateUser>({
    username: userInfo?.username as string,
    password: "",
    is_admin: userInfo?.is_admin as boolean,
  });
  useEffect(() => {
    setUpdateUserForm({
      username: userInfo?.username as string,
      password: "",
      is_admin: userInfo?.is_admin as boolean,
    });
  }, [userInfo]);

  const closeEditUserFlyout = () => setIsEditUsersFlyoutVisible(false);
  let flyout;
  const processUpdateUser = async () => {
    try {
      setIsUpdatingUser(true);
      await handleUpdateUser(UpdateUserForm);
      addToast({
        title: "Berhasil",
        color: "success",
        text: <EuiText>Update User Berhasil</EuiText>,
      });
      setIsUpdatingUser(false);
      setTableRefreshing(true);
      setIsEditUsersFlyoutVisible(false);
    } catch (error) {
      const err = error as Errors;
      addToast({
        title: "Gagal",
        color: "danger",
        text: <EuiText>{err.error}</EuiText>,
      });
    }
    setIsUpdatingUser(false);
  };
  if (isEditUsersFlyoutVisible) {
    flyout = (
      <EuiFlyout
        onClose={closeEditUserFlyout}
        size="s"
        aria-labelledby="Edit User"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="Edit User">Edit Pengguna</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup direction="column">
            <EuiFormRow label="Username" fullWidth>
              <EuiFieldText
                value={UpdateUserForm.username}
                onChange={(e) => {
                  setUpdateUserForm({
                    ...UpdateUserForm,
                    username: e.target.value,
                  });
                }}
              />
            </EuiFormRow>
            <EuiFormRow label="Password" fullWidth>
              <EuiFieldPassword
                type="dual"
                value={UpdateUserForm.password}
                onChange={(e) => {
                  setUpdateUserForm({
                    ...UpdateUserForm,
                    password: e.target.value,
                  });
                }}
              />
            </EuiFormRow>
            <EuiFormRow label="Apakah Admin?" fullWidth>
              <EuiSwitch
                label={UpdateUserForm.is_admin ? "Admin" : "Bukan Admin"}
                checked={UpdateUserForm.is_admin}
                onChange={(e) => {
                  setUpdateUserForm({
                    ...UpdateUserForm,
                    is_admin: e.target.checked,
                  });
                }}
              />
            </EuiFormRow>
          </EuiFlexGroup>
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiButton
            isLoading={isUpdatingUser}
            onClick={processUpdateUser}
            fill
            fullWidth
          >
            Update Pengguna
          </EuiButton>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
  return <>{flyout}</>;
};
