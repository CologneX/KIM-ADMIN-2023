import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  EuiFieldSearch,
  EuiButton,
  EuiButtonEmpty,
  EuiText,
  EuiTablePagination,
  Comparators,
  Criteria,
  DefaultItemAction,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiPageTemplate,
  EuiTableSelectionType,
  EuiTableSortingType,
  EuiFieldPassword,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiFieldNumber,
  EuiComboBox,
  EuiFieldText,
  EuiIcon,
} from "@elastic/eui";

import { useEffect, useMemo, useRef, useState } from "react";
import { CreateOrder, Orders, UpdateOrder } from "../types/orders";
import refreshToken from "../components/refreshToken";
import { useRootGlobalToast } from "../layouts/Layout";
import { Errors } from "../types/error";
import CenterLoading from "../components/CenterLoading";
import toRupiah from "../utils/toRupiah";
import { Product } from "../types/product";
const handleGetProductsData = async () => {
  const req = async () => {
    const res = await fetch(`/api/v1/product`);
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
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
const handleFetchOrderData = async () => {
  const req = async () => {
    const res = await fetch(`/api/v1/order`);
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
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

const handleCreateOrderData = async (data: CreateOrder) => {
  const req = async () => {
    const res = await fetch("/api/v1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  };

  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      return await res.json();
    }
    if (res.status !== 201) {
      return Promise.reject(await res.json());
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const handleUpdateOrderData = async (data: UpdateOrder) => {
  const req = async () => {
    const res = await fetch(`/api/v1/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      return await res.json();
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
  const { addToast } = useRootGlobalToast();
  const [isRefreshData, setIsRefreshData] = useState<boolean>(true);
  const [searchOrder, setSearchOrder] = useState<string>("");
  const [isLoadingOrder, setLoadingOrder] = useState<boolean>(true);
  const [OrderData, setOrderData] = useState<Orders[]>();
  const [productsData, setProductsData] = useState<
    [
      {
        label: string;
        value: string;
      }
    ]
  >();
  const [isAddOrderFlyoutVisible, setAddOrderFlyoutVisible] =
    useState<boolean>(false);

  useEffect(() => {
    setLoadingOrder(true);
    setIsRefreshData(true);
    const fetchOrders = async () => {
      try {
        const data = await handleFetchOrderData();
        setOrderData(data);
      } catch (error) {
        const err = error as Errors;
        addToast({
          title: "Gagal",
          color: "danger",
          text: <EuiText>{err.error}</EuiText>,
        });
      }
    };
    const fetchProducts = async () => {
      try {
        const data = await handleGetProductsData();
        setProductsData(
          data.map((product: Product) => ({
            label: product.name,
            value: product.id.toString(),
          }))
        );
      } catch (error) {
        const err = error as Errors;
        addToast({
          title: "Gagal",
          color: "warning",
          iconType: "alert",
          text: <EuiText>{err.error}</EuiText>,
        });
      }
    };
    fetchOrders();
    fetchProducts();
    setIsRefreshData(false);
    setLoadingOrder(false);
  }, [isRefreshData === true]);
  return (
    <>
      <AddOrderFlyout
        {...{
          isAddOrderFlyoutVisible,
          setAddOrderFlyoutVisible,
          setTableRefreshing: setIsRefreshData,
          addToast,
          productsData: productsData,
        }}
      />
      <EuiFlexGroup direction="column">
        <EuiFlexItem grow={false}>
          <EuiTitle size="l">
            <span>Daftar Pesanan</span>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceBetween" direction="row">
            <EuiFlexItem grow>
              <EuiFieldSearch
                value={searchOrder}
                placeholder="Cari Pesanan..."
                onChange={(e) => {
                  setSearchOrder(e.target.value);
                }}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup>
                <EuiButton
                  fill
                  iconType={"plusInCircleFilled"}
                  onClick={() => setAddOrderFlyoutVisible(true)}
                >
                  Tambah Pesanan
                </EuiButton>
                <EuiButtonEmpty
                  iconType={"refresh"}
                  onClick={() => setIsRefreshData(true)}
                >
                  Refresh
                </EuiButtonEmpty>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
        </EuiFlexItem>
        <EuiFlexItem grow>
          <OrdersTable
            {...{
              OrdersData: OrderData || [],
              isTableRefreshing: isRefreshData,
              isTableLoading: isLoadingOrder,
              searchOrder,
              setIsRefreshData,
              addToast,
              productsData: productsData,
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

const OrdersTable = ({
  OrdersData,
  isTableRefreshing,
  isTableLoading,
  searchOrder,
  setIsRefreshData,
  addToast,
  productsData,
}: {
  OrdersData: Orders[];
  isTableRefreshing: boolean;
  isTableLoading: boolean;
  searchOrder: string;
  setIsRefreshData: (arg: boolean) => void;
  addToast: (arg: any) => void;
  productsData:
    | [
        {
          label: string;
          value: string;
        }
      ]
    | undefined;
}) => {
  const tableRef = useRef<EuiBasicTable | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [isEditOrdersFlyoutVisible, setIsEditOrdersFlyoutVisible] =
    useState(false);
  const [sortField, setSortField] = useState<keyof Orders>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const onSelectionChange = (selectedItems: Orders[]) => {};
  const onTableChange = ({ sort }: Criteria<Orders>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const findProducts = (
    products: Orders[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Orders,
    sortDirection: "asc" | "desc",
    searchProduct: string
  ) => {
    let items;
    // return null if there is no orders
    if (!products) {
      return { pageOfItems: null, totalItemCount: 0 };
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
        item.product_name.toLowerCase().includes(searchProduct.toLowerCase())
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
    OrdersData,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    searchOrder
  );
  const pageSizeOptions = [0, 15, 30, 50, 100];

  const sorting: EuiTableSortingType<Orders> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const actions: Array<DefaultItemAction<Orders>> = [
    {
      name: "Edit",
      isPrimary: true,
      description: "edit user ini",
      icon: "pencil",
      onClick: (e) => {
        setSelectedOrder(e);
        setIsEditOrdersFlyoutVisible(true);
      },
      type: "icon",
      "data-test-subj": "action-edit",
    },
  ];
  const columns: Array<EuiBasicTableColumn<Orders>> = [
    {
      field: "id",
      name: "ID",
      sortable: false,
      render: (id: number) => {
        return <div className="line-clamp-3">{id}</div>;
      },
    },
    {
      field: "product_id",
      name: "ID Produk",
      sortable: true,
      render: (product_id: number) => {
        return <div className="line-clamp-3">{product_id}</div>;
      },
    },
    {
      field: "product_name",
      name: "Nama Produk",
    },
    {
      field: "quantity",
      name: "Kuantitas",
    },
    {
      field: "commission",
      name: "Komisi",
    },
    {
      field: "profit",
      name: "Keuntungan",
      render: (profit: number) => {
        return <>{toRupiah(profit)}</>;
      },
    },
    {
      field: "updated_on",
      name: "Terakhir diubah",
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
      {!isTableLoading && (
        <div>
          <EuiBasicTable
            tableCaption="Demo for EuiBasicTable with selection"
            ref={tableRef}
            items={pageOfItems || []}
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
      <UpdateOrderFlyout
        {...{
          isEditOrderFlyoutVisible: isEditOrdersFlyoutVisible,
          setEditOrderFlyoutVisible: setIsEditOrdersFlyoutVisible,
          setTableRefreshing: setIsRefreshData,
          addToast,
          productsData,
          selectedOrder,
        }}
      />
    </>
  );
};

const UpdateOrderFlyout = ({
  isEditOrderFlyoutVisible,
  setEditOrderFlyoutVisible,
  setTableRefreshing,
  addToast,
  productsData,
  selectedOrder,
}: {
  selectedOrder: Orders | null;
  isEditOrderFlyoutVisible: boolean;
  setEditOrderFlyoutVisible: (arg: boolean) => void;
  setTableRefreshing: (arg: boolean) => void;
  addToast: (arg: any) => void;
  productsData:
    | [
        {
          label: string;
          value: string;
        }
      ]
    | undefined;
}) => {
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [AddOrderForm, setAddOrderForm] = useState<UpdateOrder>({
    id: null,
    product_id: null,
    quantity: null,
    commission: null,
  });
  const closeAddUserFlyout = () => setEditOrderFlyoutVisible(false);
  const [selectedOptions, setSelected] = useState([]);

  const singleSelectedOption = useMemo(() => {
    return selectedOptions.length ? [selectedOptions[0]] : [];
  }, [selectedOptions]);
  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (selectedOptions[0].value) {
      setAddOrderForm((prevAddOrderForm) => ({
        ...prevAddOrderForm,
        product_id: selectedOptions[0].value,
      }));
    }
  };

  useEffect(() => {
    setAddOrderForm((prevAddOrderForm) => ({
      ...prevAddOrderForm,
      id: selectedOrder?.id ?? null,
      product_id: selectedOrder?.product_id ?? null,
      quantity: selectedOrder?.quantity ?? null,
      commission: selectedOrder?.commission ?? null,
    }));
    if (selectedOrder?.product_name && selectedOrder?.product_id) {
      setSelected([
        {
          label: selectedOrder.product_name,
          value: selectedOrder.product_id,
        },
      ] as any);
    }
  }, [selectedOrder]);

  const Combobox = () => {
    return (
      <EuiComboBox
        options={productsData}
        onChange={onChange}
        singleSelection={{ asPlainText: true }}
        selectedOptions={singleSelectedOption}
      />
    );
  };

  let flyout;
  const processEditProduct = async () => {
    try {
      setIsEditingUser(true);
      const res = await handleUpdateOrderData(AddOrderForm!);
      setTableRefreshing(true);
      addToast({
        title: "Berhasil",
        color: "success",
        text: <EuiText>Pesanan berhasil tercatat, {res}</EuiText>,
      });
      setIsEditingUser(false);
      setEditOrderFlyoutVisible(false);
    } catch (error) {
      addToast({
        title: "Gagal",
        color: "danger",
        text: <EuiText>GAGAL COK</EuiText>,
      });
    }
    setIsEditingUser(false);
  };
  if (isEditOrderFlyoutVisible) {
    flyout = (
      <EuiFlyout
        onClose={closeAddUserFlyout}
        size="s"
        aria-labelledby="Add User"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="Add User">Ubah Pesanan</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup direction="column">
            <EuiFormRow label="Pilih Produk" fullWidth>
              <Combobox />
            </EuiFormRow>
            <EuiFormRow label="Kuantitas" fullWidth>
              <EuiFieldNumber
                value={AddOrderForm?.quantity || ""}
                onChange={(e) => {
                  setAddOrderForm((prevAddOrderForm) => ({
                    ...prevAddOrderForm,
                    quantity: Number(e.target.value),
                  }));
                }}
              />
            </EuiFormRow>
            <EuiFormRow label="Komisi" fullWidth>
              <EuiFieldNumber
                append={<EuiIcon type="percent" />}
                value={AddOrderForm?.commission || ""}
                onChange={(e) => {
                  setAddOrderForm((prevAddOrderForm) => ({
                    ...prevAddOrderForm,
                    commission: Number(e.target.value),
                  }));
                }}
              />
            </EuiFormRow>
          </EuiFlexGroup>
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiButton
            isLoading={isEditingUser}
            onClick={processEditProduct}
            fill
            fullWidth
          >
            Tambah Pesanan
          </EuiButton>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
  return <>{flyout}</>;
};

const AddOrderFlyout = ({
  isAddOrderFlyoutVisible,
  setAddOrderFlyoutVisible,
  setTableRefreshing,
  addToast,
  productsData,
}: {
  isAddOrderFlyoutVisible: boolean;
  setAddOrderFlyoutVisible: (arg: boolean) => void;
  setTableRefreshing: (arg: boolean) => void;
  addToast: (arg: any) => void;
  productsData:
    | [
        {
          label: string;
          value: string;
        }
      ]
    | undefined;
}) => {
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [AddOrderForm, setAddOrderForm] = useState<CreateOrder>({
    product_id: null,
    quantity: null,
    commission: null,
  });
  const closeAddUserFlyout = () => setAddOrderFlyoutVisible(false);
  const [selectedOptions, setSelected] = useState([]);

  const singleSelectedOption = useMemo(() => {
    return selectedOptions.length ? [selectedOptions[0]] : [];
  }, [selectedOptions]);
  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (selectedOptions[0].value) {
      setAddOrderForm((prevAddOrderForm) => ({
        ...prevAddOrderForm,
        product_id: selectedOptions[0].value,
      }));
    }
  };
  const Combobox = () => {
    return (
      <EuiComboBox
        options={productsData}
        onChange={onChange}
        singleSelection={{ asPlainText: true }}
        selectedOptions={singleSelectedOption}
      />
    );
  };

  let flyout;
  const processAddProduct = async () => {
    try {
      setIsAddingUser(true);
      const res = await handleCreateOrderData(AddOrderForm!);
      setTableRefreshing(true);
      addToast({
        title: "Berhasil",
        color: "success",
        text: <EuiText>Pesanan berhasil tercatat, {res}</EuiText>,
      });
      setIsAddingUser(false);
      setAddOrderFlyoutVisible(false);
    } catch (error) {
      addToast({
        title: "Gagal",
        color: "danger",
        text: <EuiText>GAGAL COK</EuiText>,
      });
    }
    setIsAddingUser(false);
  };
  if (isAddOrderFlyoutVisible) {
    flyout = (
      <EuiFlyout
        onClose={closeAddUserFlyout}
        size="s"
        aria-labelledby="Add User"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="Add User">Tambah Pesanan</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup direction="column">
            <EuiFormRow label="Pilih Produk" fullWidth>
              <Combobox />
            </EuiFormRow>
            <EuiFormRow label="Kuantitas" fullWidth>
              <EuiFieldNumber
                value={AddOrderForm?.quantity || ""}
                onChange={(e) => {
                  setAddOrderForm((prevAddOrderForm) => ({
                    ...prevAddOrderForm,
                    quantity: Number(e.target.value),
                  }));
                }}
              />
            </EuiFormRow>
            <EuiFormRow label="Komisi" fullWidth>
              <EuiFieldNumber
                append={<EuiIcon type="percent" />}
                value={AddOrderForm?.commission || ""}
                onChange={(e) => {
                  setAddOrderForm((prevAddOrderForm) => ({
                    ...prevAddOrderForm,
                    commission: Number(e.target.value),
                  }));
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
            Tambah Pesanan
          </EuiButton>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
  return <>{flyout}</>;
};
