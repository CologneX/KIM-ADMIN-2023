import {
  Comparators,
  Criteria,
  DefaultItemAction,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiComboBox,
  EuiConfirmModal,
  EuiFieldNumber,
  EuiFieldSearch,
  EuiFieldText,
  EuiFilePicker,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiImage,
  EuiPageTemplate,
  EuiSpacer,
  EuiTablePagination,
  EuiTableSelectionType,
  EuiTableSortingType,
  EuiTextArea,
  EuiTitle,
  useGeneratedHtmlId,
} from "@elastic/eui";
import { useEffect, useMemo, useRef, useState } from "react";
import CenterLoading from "../../components/CenterLoading";
import useToast from "../../hooks/useToast";
import refreshToken from "../../components/refreshToken";
import { CreateProduct, Product, UpdateProduct } from "../../types/product";
import { Errors } from "../../types/error";
import { Business } from "../../types/business";
import { useRootGlobalToast } from "../../layouts/Layout";
import toRupiah from "../../utils/toRupiah";

const handleUploadImage = async (id: string, images: FileList) => {
  const formData = new FormData();
  for (let i = 0; i < images.length; i++) {
    formData.append("file", images[i]);
  }
  formData.append("id", id);
  const req = async () => {
    const res = await fetch(`/api/v1/product/image`, {
      method: "POST",
      body: formData,
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
  } catch (err) {
    throw err;
  }
};
const handleDeleteProductImage = async (file: string) => {
  const req = async () => {
    const res = await fetch(`/api/v1/product/image?file=${file}`, {
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
  } catch (err) {
    throw err;
  }
};
const handleAddProduct = async (product: CreateProduct) => {
  const req = async () => {
    const res = await fetch("/api/v1/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
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
      const data = await res.json();
      await handleUploadImage(data.id, product.images as FileList);
      return true;
    }
    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    const data = await res.json();
    await handleUploadImage(data.id, product.images as FileList);
    return true;
  } catch (err) {
    throw err;
  }
};

const handleGetProducts = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/product");
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
      const data = await res.json();
      return data;
    }

    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

const handleGetBusinesses = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/business");
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
      const data = await res.json();
      return data;
    }

    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
export default () => {
  const { addToast } = useRootGlobalToast();

  useEffect(() => {
    handleGetBusinesses()
      .then((data) => {
        setBusinesses(data);
      })
      .catch(() => {
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
      <AddProductFlyout
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
            <span>Produk UMKM</span>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceBetween" direction="row">
            <EuiFlexItem grow>
              <EuiFieldSearch
                value={search}
                placeholder="Cari Produk..."
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
                  Tambah Barang
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

const AddProductFlyout = ({
  isAddProductFlyoutVisible,
  setIsAddProductFlyoutVisible,
  setIsRefreshing,
  businesses,
}: {
  isAddProductFlyoutVisible: boolean;
  setIsAddProductFlyoutVisible: (arg: boolean) => void;
  setIsRefreshing: (arg: boolean) => void;
  businesses: Business[];
}) => {
  const simpleFlyoutTitleId = useGeneratedHtmlId({
    prefix: "simpleFlyoutTitle",
  });
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [addProductErrors, setAddProductErrors] = useState<Errors>();
  const [addProductForm, setAddProductForm] = useState<CreateProduct>({
    name: "",
    description: "",
    price: 0,
    business_id: "",
    images: null,
  });
  const { addToast } = useRootGlobalToast();
  const handleSubmit = async () => {
    setIsAddingProduct(true);
    try {
      await handleAddProduct(addProductForm);
      setIsAddProductFlyoutVisible(false);
      setIsRefreshing(true);
      addToast({
        title: "Berhasil menambahkan produk",
        color: "success",
        iconType: "check",
      });
    } catch (err) {
      setAddProductErrors(err as Errors);
      addToast({
        title: "Gagal menambahkan produk",
        color: "danger",
        iconType: "alert",
      });
    }
    setIsAddingProduct(false);
  };
  const options = businesses.map((business) => ({
    label: business.name,
    value: business.id,
  }));

  const [selectedOptions, setSelected] = useState([]);
  const [singleSelection, setSingleSelection] = useState(true);

  // const [fileDataURL, setFileDataURL] = useState(null);

  // useEffect(() => {
  //   let fileReader: any,
  //     isCancel = false;
  //   if (addProductForm.images) {
  //     fileReader = new FileReader();
  //     fileReader.onload = (e: any) => {
  //       const { result } = e.target;
  //       if (result && !isCancel) {
  //         setFileDataURL(result);
  //       }
  //     };
  //     fileReader.readAsDataURL(addProductForm.images);
  //   }
  //   return () => {
  //     isCancel = true;
  //     if (fileReader && fileReader.readyState === 1) {
  //       fileReader.abort();
  //     }
  //   };
  // }, [addProductForm.images]);
  // $:console.log(fileDataURL);
  const singleSelectedOption = useMemo(() => {
    return selectedOptions.length ? [selectedOptions[0]] : [];
  }, [selectedOptions]);

  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    setAddProductForm({
      ...addProductForm,
      business_id: selectedOptions[0].value,
    });
  };
  let flyout;

  const onImageChange = (files: FileList | null) => {
    setAddProductForm({
      ...addProductForm,
      images: files,
    });
  };
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
            <h2 id={simpleFlyoutTitleId}>Tambah Produk Baru</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow
                label="Nama Produk"
                fullWidth
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiFieldText
                  onChange={(e) => {
                    setAddProductForm({
                      ...addProductForm,
                      name: e.target.value,
                    });
                  }}
                  isInvalid={addProductErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Harga Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiFieldNumber
                  fullWidth
                  onChange={(e) =>
                    setAddProductForm({
                      ...addProductForm,
                      price: Number(e.target.value),
                    })
                  }
                  isInvalid={addProductErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="UMKM Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiComboBox
                  aria-label="Combo box demo with option prepend/append nodes"
                  options={options}
                  fullWidth
                  onChange={onChange}
                  singleSelection={
                    singleSelection ? { asPlainText: true } : false
                  }
                  selectedOptions={
                    singleSelection ? singleSelectedOption : selectedOptions
                  }
                  placeholder={`Select one ${
                    singleSelection ? "option" : "or more options"
                  }`}
                />
              </EuiFormRow>

              <EuiFormRow
                label="Desripsi Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiTextArea
                  fullWidth
                  onChange={(e) =>
                    setAddProductForm({
                      ...addProductForm,
                      description: e.target.value,
                    })
                  }
                  isInvalid={addProductErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Gambar Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiFilePicker
                  initialPromptText="Pilih atau seret file"
                  onChange={onImageChange}
                  display="large"
                  multiple
                  fullWidth
                  isInvalid={addProductErrors?.error.length! > 0}
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
                isLoading={isAddingProduct}
                disabled={
                  addProductForm.name === "" ||
                  addProductForm.description === "" ||
                  addProductForm.price === 0 ||
                  addProductForm.business_id === ""
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
  businesses,
}: {
  isTableLoading: boolean;
  search: string;
  isRefreshing: boolean;
  setIsRefreshing: (arg: boolean) => void;
  setIsTableLoading: (arg: boolean) => void;
  businesses: Business[];
}) => {
  const toast = useToast();
  const [productsData, setProductsData] = useState<Product[]>([]);
  useEffect(() => {
    handleGetProducts()
      .then((data) => {
        setIsTableLoading(false);
        setIsRefreshing(false);
        setProductsData(data);
      })
      .catch(() => {
        setIsTableLoading(false);
        setIsRefreshing(false);
        toast.addToast({
          title: "Gagal mengambil data produk",
          color: "danger",
          iconType: "alert",
        });
      });
  }, [isRefreshing === true, isRefreshing]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const tableRef = useRef<EuiBasicTable | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditProductFlyoutVisible, setIsEditProductFlyoutVisible] =
    useState(false);
  const [sortField, setSortField] = useState<keyof Product>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const onSelectionChange = (selectedItems: Product[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<Product> = {
    onSelectionChange,
  };
  const onTableChange = ({ sort }: Criteria<Product>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const findProducts = (
    products: Product[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Product,
    sortDirection: "asc" | "desc",
    searchProduct: string
  ) => {
    let items;

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
        Math.min(startIndex + pageSize, products.length)
      );
    }

    return {
      pageOfItems,
      totalItemCount: searchedItems.length,
    };
  };

  const { pageOfItems, totalItemCount } = findProducts(
    productsData,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    search
  );
  const pageSizeOptions = [0, 15, 30, 50, 100];

  const sorting: EuiTableSortingType<Product> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const actions: Array<DefaultItemAction<Product>> = [
    {
      name: "Hapus",
      description: "Hapus produk ini",
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
  const columns: Array<EuiBasicTableColumn<Product>> = [
    {
      field: "name",
      name: "Nama",
      sortable: true,
    },
    {
      field: "description",
      name: "Deskripsi",
      sortable: true,
    },
    {
      field: "business_name",
      name: "Nama UMKM",
    },
    {
      field: "price",
      name: "Harga",
      sortable: true,
      render: (price: number) => {
        return <>{toRupiah(price)}</>;
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
      <DeleteProductModal
        {...{
          isDeleteModalVisible,
          setDeleteModalVisible,
          productInfo: selectedProduct!,
          setRefresh: setIsRefreshing,
        }}
      />
      <EditProductModal
        {...{
          isEditProductFlyoutVisible,
          setIsEditProductFlyoutVisible,
          setIsRefreshing,
          productInfo: selectedProduct!,
          businesses,
        }}
      />
    </>
  );
};

const handleDeleteProduct = async (id: string) => {
  const res = await fetch(`/api/v1/product?id=${id}`, {
    method: "DELETE",
  });
  if (res.status === 401) {
    await refreshToken();
    const res = await fetch(`/api/v1/product?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }
  } else if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
};
const DeleteProductModal = ({
  isDeleteModalVisible,
  setDeleteModalVisible,
  productInfo,
  setRefresh,
}: {
  isDeleteModalVisible: boolean;
  setDeleteModalVisible: (arg: boolean) => void;
  productInfo: Product | null;
  setRefresh: (arg: boolean) => void;
}) => {
  const { addToast } = useRootGlobalToast();
  const closeDestroyModal = () => setDeleteModalVisible(false);
  const showDestroyModal = async () => {
    handleDeleteProduct(productInfo!.id);
    setRefresh(true);
    addToast({
      title: "Berhasil menghapus produk",
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
        Apakah anda yakin ingin menghapus produk {productInfo?.name}?
      </EuiConfirmModal>
    );
  }
  return <>{modal}</>;
};

const EditProductModal = ({
  isEditProductFlyoutVisible,
  setIsEditProductFlyoutVisible,
  setIsRefreshing,
  productInfo,
  businesses,
}: {
  isEditProductFlyoutVisible: boolean;
  setIsEditProductFlyoutVisible: (arg: boolean) => void;
  setIsRefreshing: (arg: boolean) => void;
  productInfo: Product | null;
  businesses: Business[];
}) => {
  const [editProductErrors, setEditProductErrors] = useState<Errors>();
  const handleEditProduct = async (product: UpdateProduct) => {
    const res = await fetch(`/api/v1/product`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: productInfo?.id,
        name: product.name,
        description: product.description,
        price: product.price,
        business_id: product.business_id,
      }),
    });
    if (res.ok) {
      await handleUploadImage(productInfo?.id!, product.images as FileList);
    }
    if (res.status === 401) {
      await refreshToken();
      const res = await fetch(`/api/v1/product`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productInfo?.id,
          name: product.name,
          description: product.description,
          price: product.price,
          business_id: product.business_id,
        }),
      });
      if (res.ok) {
        await handleUploadImage(productInfo?.id!, product.images as FileList);
      }
      if (!res.ok) {
        const data = await res.json();
        setEditProductErrors(data.error[0]);
        throw new Error(data);
      }
    } else if (!res.ok) {
      const data = await res.json();
      setEditProductErrors(data.error[0]);
      throw new Error(data);
    }
  };

  const [editProductForm, setEditProductForm] = useState<UpdateProduct>({
    id: productInfo?.id!,
    name: productInfo?.name!,
    description: productInfo?.description!,
    price: productInfo?.price!,
    business_id: productInfo?.business_name!,
    images: null,
  });
  const [isDeletingProductImage, setDeletingProductImage] =
    useState<boolean>(false);
  useEffect(() => {
    setEditProductForm({
      id: productInfo?.id!,
      name: productInfo?.name!,
      description: productInfo?.description!,
      price: productInfo?.price!,
      business_id: businesses.find(
        (business) => business.name === productInfo?.business_name!
      )?.id!,
      images: productInfo?.images! as FileList,
    });
  }, [productInfo]);
  const [selectedOptions, setSelectedOptions] = useState<
    { label: string; value: any }[]
  >([
    {
      label: productInfo?.business_name!,
      value: productInfo?.business_name!,
    },
  ]);
  useEffect(() => {
    setSelectedOptions([
      {
        label: productInfo?.business_name!,
        value: productInfo?.business_name!,
      },
    ]);
  }, [productInfo]);
  const { addToast } = useRootGlobalToast();

  const simpleFlyoutTitleId = useGeneratedHtmlId({
    prefix: "simpleFlyoutTitle",
  });
  const [addProductErrors, setAddProductErrors] = useState<Errors>();
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const handleSubmit = async () => {
    setIsEditingProduct(true);
    try {
      await handleEditProduct(editProductForm);
      setIsEditProductFlyoutVisible(false);
      setIsRefreshing(true);
      addToast({
        title: "Berhasil menambahkan produk",
        color: "success",
        iconType: "check",
      });
    } catch (err) {
      setAddProductErrors(err as Errors);
      addToast({
        title: "Gagal menambahkan produk",
        color: "danger",
        iconType: "alert",
      });
    }
    setIsEditingProduct(false);
  };
  const options = businesses.map((business) => ({
    label: business.name,
    value: business.id,
  }));

  const onChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
    setEditProductForm({
      ...editProductForm,
      business_id: selectedOptions[0].value,
    });
  };
  let flyout;
  const onImageChange = (files: FileList | null) => {
    setEditProductForm({
      ...editProductForm,
      images: files,
    });
  };
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
            <h2 id={simpleFlyoutTitleId}>Edit Produk</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow
                label="Nama Produk"
                fullWidth
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiFieldText
                  value={editProductForm.name}
                  onChange={(e) => {
                    setEditProductForm({
                      ...editProductForm,
                      name: e.target.value,
                    });
                  }}
                  isInvalid={addProductErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="Harga Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiFieldNumber
                  value={editProductForm.price}
                  fullWidth
                  onChange={(e) =>
                    setEditProductForm({
                      ...editProductForm,
                      price: Number(e.target.value),
                    })
                  }
                  isInvalid={addProductErrors?.error.length! > 0}
                />
              </EuiFormRow>
              <EuiFormRow
                label="UMKM Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiComboBox
                  aria-label="Combo box demo with option prepend/append nodes"
                  options={options}
                  fullWidth
                  onChange={onChange}
                  singleSelection={{ asPlainText: true }}
                  selectedOptions={selectedOptions}
                />
              </EuiFormRow>

              <EuiFormRow
                label="Desripsi Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <EuiTextArea
                  fullWidth
                  value={editProductForm.description}
                  onChange={(e) =>
                    setEditProductForm({
                      ...editProductForm,
                      description: e.target.value,
                    })
                  }
                  isInvalid={addProductErrors?.error.length! > 0}
                />
              </EuiFormRow>

              <EuiFormRow
                label="Foto Produk"
                isInvalid={addProductErrors?.error.length! > 0}
              >
                <>
                  <EuiFilePicker
                    initialPromptText="Pilih atau seret file"
                    onChange={onImageChange}
                    display="large"
                    multiple
                    fullWidth
                    isInvalid={addProductErrors?.error.length! > 0}
                  />
                  <EuiSpacer />
                  <EuiFlexGrid columns={2}>
                    {productInfo?.images &&
                      productInfo?.images[0] !== "" &&
                      (productInfo?.images as string[]).map((image: string) => (
                        <div key={image} className="image-container">
                          <EuiImage
                            alt={image}
                            src={`/usercontent/${image}`}
                            className="image"
                          />
                          <div className="delete-button">
                            <EuiButtonIcon
                              onClick={async () => {
                                await handleDeleteProductImage(image);
                                setIsEditProductFlyoutVisible(false);
                                setIsRefreshing(true);
                              }}
                              iconType="trash"
                              isLoading={isDeletingProductImage}
                              color="danger"
                              display="base"
                            />
                          </div>
                        </div>
                      ))}
                  </EuiFlexGrid>

                  {productInfo?.images && productInfo.images[0] === "" && (
                    <>
                      <EuiSpacer />
                      <EuiTitle
                        size="m"
                        css={{
                          textAlign: "center",
                        }}
                      >
                        <h3>Tidak ada gambar</h3>
                      </EuiTitle>
                    </>
                  )}
                </>
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
                isLoading={isEditingProduct}
                disabled={
                  editProductForm.name === "" ||
                  editProductForm.description === "" ||
                  editProductForm.price === 0 ||
                  editProductForm.business_id === ""
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
