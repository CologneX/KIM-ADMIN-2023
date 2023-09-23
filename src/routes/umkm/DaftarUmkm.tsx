import {
  Comparators,
  Criteria,
  DefaultItemAction,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonEmpty,
  EuiConfirmModal,
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
  EuiTablePagination,
  EuiTableSelectionType,
  EuiTableSortingType,
  EuiTextArea,
  EuiTitle,
  useGeneratedHtmlId,
} from "@elastic/eui";
import { useEffect, useRef, useState } from "react";
import CenterLoading from "../../components/CenterLoading";
import useToast from "../../hooks/useToast";
import refreshToken from "../../components/refreshToken";
import { Errors } from "../../types/error";
import { Business, CreateBusiness, UpdateBusiness } from "../../types/business";
import { useRootGlobalToast } from "../../layouts/Layout";

const handleDeleteProduct = async (id: string) => {
  const res = await fetch(`/api/v1/business?id=${id}`, {
    method: "DELETE",
  });
  if (res.status === 401) {
    await refreshToken();
    const res = await fetch(`/api/v1/business?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error[0]);
    }
  } else if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error[0]);
  }
};
const handleUpdateBusiness = async (business: UpdateBusiness) => {
  const res = await fetch(`/api/v1/business`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: business.id,
      name: business.name,
      address: business.address,
      phone_number: business.phone_number,
    }),
  });
  if (res.status === 401) {
    await refreshToken();
    const res = await fetch(`/api/v1/business`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: business.id,
        name: business.name,
        address: business.address,
        phone_number: business.phone_number,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error[0]);
    }
  } else if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error[0]);
  }
};
const handleAddBusiness = async (product: CreateBusiness) => {
  const res = await fetch("/api/v1/business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (res.status === 401) {
    await refreshToken();
    const res = await fetch("/api/v1/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error[0]);
    }
  } else if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error[0]);
  }
};

const handleGetBusinesses = async () => {
  try {
    const res = await fetch("/api/v1/business");
    if (res.status === 401) {
      await refreshToken();
      const res = await fetch("/api/v1/business");
      const data = await res.json();
      return data;
    } else if (res.status === 404) {
      throw new Error("Tidak ada UMKM yang ditemukan");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Gagal mengambil data UMKM");
  }
};
export default () => {
  const { addToast } = useRootGlobalToast();

  useEffect(() => {
    handleGetBusinesses()
      .then((data) => {
        setBusinesses(data);
      })
      .catch((err) => {
        addToast({
          title: "Gagal mengambil data UMKM",
          color: "danger",
          iconType: "alert",
        });
      });
  }, []);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isAddProductFlyoutVisible, setIsAddProductFlyoutVisible] =
    useState(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  return (
    <>
      <AddBusinessFlyout
        {...{
          isAddProductFlyoutVisible,
          setIsAddProductFlyoutVisible,
          setIsRefreshing,
          businesses,
        }}
      />
      <EuiFlexGroup direction="column">
        <EuiFlexItem grow={false}>
          <EuiTitle size="l">
            <span>Daftar Bisnis UMKM</span>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceBetween" direction="row">
            <EuiFlexItem grow>
              <EuiFieldSearch
                value={search}
                placeholder="Cari Bisnis UMKM..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup>
                <EuiButton
                  fill
                  iconType={"plusInCircleFilled"}
                  onClick={() => setIsAddProductFlyoutVisible(true)}
                >
                  Tambah Bisnis UMKM
                </EuiButton>
                <EuiButtonEmpty
                  iconType={"refresh"}
                  onClick={() => setIsRefreshing(true)}
                >
                  Refresh
                </EuiButtonEmpty>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
        </EuiFlexItem>
        <EuiFlexItem grow>
          <ProductTable
            {...{
              isTableLoading,
              search,
              isRefreshing,
              setIsRefreshing,
              setIsTableLoading,
              businesses,
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

const AddBusinessFlyout = ({
  isAddProductFlyoutVisible,
  setIsAddProductFlyoutVisible,
  setIsRefreshing,
}: {
  isAddProductFlyoutVisible: boolean;
  setIsAddProductFlyoutVisible: (arg: boolean) => void;
  setIsRefreshing: (arg: boolean) => void;
}) => {
  const simpleFlyoutTitleId = useGeneratedHtmlId({
    prefix: "simpleFlyoutTitle",
  });
  const [addBusinessErrors, setAddBusinessErrors] = useState<Errors>();
  const [addBusinessForm, setAddBusinessForm] = useState<CreateBusiness>({
    name: "",
    address: "",
    phone_number: "",
  });
  const { addToast } = useRootGlobalToast();
  const handleSubmit = async () => {
    try {
      await handleAddBusiness(addBusinessForm);
      setIsAddProductFlyoutVisible(false);
      setIsRefreshing(true);
      addToast({
        title: "Berhasil menambahkan Bisnis UMKM",
        color: "success",
        iconType: "check",
      });
    } catch (err) {
      setAddBusinessErrors(err as Errors);
      addToast({
        title: "Gagal menambahkan Bisnis UMKM",
        color: "danger",
        iconType: "alert",
      });
    }
  };

  let flyout;
  if (isAddProductFlyoutVisible) {
    flyout = (
      <EuiFlyout
        ownFocus
        size="s"
        onClose={() => setIsAddProductFlyoutVisible(false)}
        aria-labelledby={simpleFlyoutTitleId}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id={simpleFlyoutTitleId}>Tambah Bisnis UMKM Baru</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow
                label="Nama Bisnis UMKM"
                fullWidth
                isInvalid={addBusinessErrors?.error.length! > 0}
              >
                <EuiFieldText
                  onChange={(e) => {
                    setAddBusinessForm({
                      ...addBusinessForm,
                      name: e.target.value,
                    });
                  }}
                  isInvalid={addBusinessErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Alamat UMKM"
                isInvalid={addBusinessErrors?.error.length! > 0}
              >
                <EuiFieldText
                  fullWidth
                  onChange={(e) =>
                    setAddBusinessForm({
                      ...addBusinessForm,
                      address: e.target.value,
                    })
                  }
                  isInvalid={addBusinessErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Nomor Telpon Bisnis UMKM"
                isInvalid={addBusinessErrors?.error.length! > 0}
              >
                <EuiTextArea
                  fullWidth
                  onChange={(e) =>
                    setAddBusinessForm({
                      ...addBusinessForm,
                      phone_number: e.target.value,
                    })
                  }
                  isInvalid={addBusinessErrors?.error.length! > 0}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={() => setIsAddProductFlyoutVisible(false)}
                flush="left"
              >
                Tutup
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                onClick={handleSubmit}
                disabled={
                  addBusinessForm.name === "" ||
                  addBusinessForm.address === "" ||
                  addBusinessForm.phone_number === ""
                }
                fill
              >
                Tambah
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
  return <>{flyout}</>;
};
const ProductTable = ({
  search,
  isRefreshing,
  setIsRefreshing,
  setIsTableLoading,
  isTableLoading,
}: {
  isTableLoading: boolean;
  search: string;
  isRefreshing: boolean;
  setIsRefreshing: (arg: boolean) => void;
  setIsTableLoading: (arg: boolean) => void;
  businesses: Business[];
}) => {
  const toast = useToast();
  const [businessData, setbusinessData] = useState<Business[]>([]);
  useEffect(() => {
    handleGetBusinesses()
      .then((data) => {
        setIsTableLoading(false);
        setIsRefreshing(false);
        setbusinessData(data);
      })
      .catch(() => {
        setIsTableLoading(false);
        setIsRefreshing(false);
        toast.addToast({
          title: "Gagal mengambil data Bisnis UMKM",
          color: "danger",
          iconType: "alert",
        });
      });
  }, [isRefreshing === true]);
  const [selectedItems, setSelectedItems] = useState<Business[]>([]);
  const tableRef = useRef<EuiBasicTable | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Business | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditProductFlyoutVisible, setIsEditProductFlyoutVisible] =
    useState(false);
  const [sortField, setSortField] = useState<keyof Business>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const onSelectionChange = (selectedItems: Business[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<Business> = {
    onSelectionChange,
  };
  const onTableChange = ({ sort }: Criteria<Business>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const findProducts = (
    business: Business[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Business,
    sortDirection: "asc" | "desc",
    searchProduct: string
  ) => {
    let items;
    // return null if therei is no file
    if (!business) {
      return {
        pageOfItems: [],
        totalItemCount: 0,
      };
    }
    if (sortField) {
      items = business
        .slice(0)
        .sort(
          Comparators.property(sortField, Comparators.default(sortDirection))
        );
    } else {
      items = business;
    }
    let searchedItems;
    if (searchProduct) {
      searchedItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchProduct.toLowerCase())
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
        Math.min(startIndex + pageSize, business.length)
      );
    }

    return {
      pageOfItems,
      totalItemCount: searchedItems.length,
    };
  };

  const { pageOfItems, totalItemCount } = findProducts(
    businessData,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    search
  );
  const pageSizeOptions = [0, 15, 30, 50, 100];

  const sorting: EuiTableSortingType<Business> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const actions: Array<DefaultItemAction<Business>> = [
    {
      name: "Hapus",
      description: "Hapus bisnis UMKM ini",
      icon: "trash",
      color: "danger",
      type: "icon",
      isPrimary: true,
      onClick: (e) => {
        setSelectedProduct(e);
        setDeleteModalVisible(true);
      },
      "data-test-subj": "action-delete",
    },
    {
      name: "Edit",
      isPrimary: true,
      description: "Edit this user",
      icon: "pencil",
      onClick: (e) => {
        setSelectedProduct(e);
        setIsEditProductFlyoutVisible(true);
      },
      type: "icon",

      "data-test-subj": "action-edit",
    },
  ];
  const columns: Array<EuiBasicTableColumn<Business>> = [
    {
      field: "name",
      name: "Nama",
      sortable: true,
    },
    {
      field: "name",
      name: "Nama UMKM",
      sortable: true,
    },
    {
      field: "address",
      name: "Alamat",
    },
    {
      field: "phone_number",
      name: "Nomor Telepon",
      sortable: true,
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
      {!isTableLoading && (
        <div>
          <EuiBasicTable
            tableCaption="Demo for EuiBasicTable with selection"
            ref={tableRef}
            items={pageOfItems}
            columns={columns}
            rowHeader="id"
            itemId="id"
            loading={isRefreshing}
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
      <DeleteBusinessModal
        {...{
          isDeleteModalVisible,
          setDeleteModalVisible,
          businessInfo: selectedProduct!,
          setRefresh: setIsRefreshing,
        }}
      />
      <EditBusinessModal
        {...{
          isEditProductFlyoutVisible,
          setIsEditProductFlyoutVisible,
          setIsRefreshing,
          businessInfo: selectedProduct!,
        }}
      />
    </>
  );
};

const DeleteBusinessModal = ({
  isDeleteModalVisible,
  setDeleteModalVisible,
  businessInfo,
  setRefresh,
}: {
  isDeleteModalVisible: boolean;
  setDeleteModalVisible: (arg: boolean) => void;
  businessInfo: Business | null;
  setRefresh: (arg: boolean) => void;
}) => {
  const { addToast } = useRootGlobalToast();
  const closeDestroyModal = () => setDeleteModalVisible(false);
  const showDestroyModal = async () => {
    await handleDeleteProduct(businessInfo!.id);
    setRefresh(true);
    addToast({
      title: "Berhasil menghapus Bisnis UMKM",
      color: "success",
      iconType: "check",
    });
    setDeleteModalVisible(false);
  };
  let modal;
  if (isDeleteModalVisible) {
    modal = (
      <EuiConfirmModal
        title="Hapus Bisnis UMKM?"
        onCancel={closeDestroyModal}
        onConfirm={showDestroyModal}
        cancelButtonText="Batal"
        confirmButtonText="Ya, yakin"
        buttonColor="danger"
      >
        Apakah anda yakin ingin menghapus Bisnis UMKM {businessInfo?.name}?
      </EuiConfirmModal>
    );
  }
  return <>{modal}</>;
};

const EditBusinessModal = ({
  isEditProductFlyoutVisible,
  setIsEditProductFlyoutVisible,
  setIsRefreshing,
  businessInfo,
}: {
  isEditProductFlyoutVisible: boolean;
  setIsEditProductFlyoutVisible: (arg: boolean) => void;
  setIsRefreshing: (arg: boolean) => void;
  businessInfo: Business | null;
}) => {
  const [editBusinessErrors, setEditBusinessErrors] = useState<Errors>();
  const [editBusinessForm, setEditBusinessForm] = useState<UpdateBusiness>({
    id: businessInfo?.id!,
    name: businessInfo?.name!,
    address: businessInfo?.address!,
    phone_number: businessInfo?.phone_number!,
  });
  useEffect(() => {
    setEditBusinessForm({
      id: businessInfo?.id!,
      name: businessInfo?.name!,
      address: businessInfo?.address!,
      phone_number: businessInfo?.phone_number!,
    });
  }, [businessInfo]);
  const { addToast } = useRootGlobalToast();

  const simpleFlyoutTitleId = useGeneratedHtmlId({
    prefix: "simpleFlyoutTitle",
  });
  const handleSubmit = async () => {
    try {
      await handleUpdateBusiness(editBusinessForm);
      setIsEditProductFlyoutVisible(false);
      setIsRefreshing(true);
      addToast({
        title: `Berhasil mengubah bisnis ${businessInfo?.name}`,
        color: "success",
        iconType: "check",
      });
    } catch (err) {
      console.log(err);
      setEditBusinessErrors(err as Errors);
      addToast({
        title: `Gagal mengubah bisnis ${businessInfo?.name}`,
        color: "danger",
        iconType: "alert",
      });
    }
  };

  let flyout;
  if (isEditProductFlyoutVisible) {
    flyout = (
      <EuiFlyout
        ownFocus
        size="s"
        onClose={() => setIsEditProductFlyoutVisible(false)}
        aria-labelledby={simpleFlyoutTitleId}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id={simpleFlyoutTitleId}>Edit Bisnis UMKM</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow
                label="Nama Bisnis UMKM"
                fullWidth
                isInvalid={editBusinessErrors?.error.length! > 0}
              >
                <EuiFieldText
                  value={editBusinessForm.name}
                  onChange={(e) => {
                    setEditBusinessForm({
                      ...editBusinessForm,
                      name: e.target.value,
                    });
                  }}
                  isInvalid={editBusinessErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Alamat Bisnis UMKM"
                isInvalid={editBusinessErrors?.error.length! > 0}
              >
                <EuiFieldText
                  fullWidth
                  value={editBusinessForm.address}
                  onChange={(e) =>
                    setEditBusinessForm({
                      ...editBusinessForm,
                      address: e.target.value,
                    })
                  }
                  isInvalid={editBusinessErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Nomor Telpon Bisnis UMKM"
                isInvalid={editBusinessErrors?.error.length! > 0}
              >
                <EuiTextArea
                  fullWidth
                  value={editBusinessForm.phone_number}
                  onChange={(e) =>
                    setEditBusinessForm({
                      ...editBusinessForm,
                      phone_number: e.target.value,
                    })
                  }
                  isInvalid={editBusinessErrors?.error.length! > 0}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={() => setIsEditProductFlyoutVisible(false)}
                flush="left"
              >
                Tutup
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                onClick={handleSubmit}
                disabled={
                  editBusinessForm.name === "" ||
                  editBusinessForm.address === "" ||
                  editBusinessForm.phone_number === ""
                }
                fill
              >
                Edit
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
  return <> {flyout}</>;
};
