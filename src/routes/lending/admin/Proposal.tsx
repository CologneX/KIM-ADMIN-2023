import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  EuiFieldSearch,
  EuiButton,
  EuiButtonEmpty,
  Comparators,
  Criteria,
  DefaultItemAction,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiPageTemplate,
  EuiTablePagination,
  EuiTableSortingType,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiText,
  EuiConfirmModal,
  EuiTable,
} from "@elastic/eui";
import { useEffect, useRef, useState } from "react";
import refreshToken from "../../../components/refreshToken";
import { CreditScore, Proposal } from "../../../types/proposal";
import { useRootGlobalToast } from "../../../layouts/Layout";
import CenterLoading from "../../../components/CenterLoading";
import React from "react";
import { useNavigate } from "react-router-dom";
import { time } from "console";

const handleGetProposal = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/lending/admin/proposal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
      return res.json();
    }
    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};

const handleDeclineProposal = async (id: string) => {
  const req = async () => {
    const res = await fetch(`/api/v1/lending/admin/proposal-reject?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

const handleApproveProposal = async (id: string) => {
  const req = async () => {
    const res = await fetch(`/api/v1/lending/admin/proposal-approve?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

const handlePaymentProposal = async (id: string) => {
  const req = async () => {
    const res = await fetch(`/api/v1/lending/admin/make-payment?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

const handleGetCreditScore = async (id: string) => {
  const req = async () => {
    const res = await fetch(`/api/v1/lending/admin/proposal-predict?id=${id}`);
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
      return res.json();
    }
    if (!res.ok) {
      return Promise.reject(await res.json());
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};

export default () => {
  const [searchProposal, setSearchProposal] = useState<string>("");
  const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [proposalData, setProposalData] = useState<Proposal[]>([]);
  const { addToast } = useRootGlobalToast();
  useEffect(() => {
    const getProposal = async () => {
      setIsLoadingProposal(true);
      try {
        const res = await handleGetProposal();
        setProposalData(res);
      } catch (error) {
        addToast({
          title: "Gagal mengambil data proposal",
          color: "danger",
          iconType: "alert",
        });
      }
      setIsLoadingProposal(false);
    };
    getProposal();
  }, [isRefreshData]);
  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiTitle size="l">
          <span>Daftar Proposal</span>
        </EuiTitle>
        <EuiSpacer />
        <EuiFlexGroup justifyContent="spaceBetween" direction="row">
          <EuiFlexItem grow>
            <EuiFieldSearch
              value={searchProposal}
              placeholder="Cari Proposal..."
              onChange={(e) => {
                setSearchProposal(e.target.value);
              }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup>
              <EuiButton
                fill
                iconType={"plusInCircleFilled"}
                // onClick={() => }
              >
                Tambah Pesanan
              </EuiButton>
              <EuiButtonEmpty
                iconType={"refresh"}
                onClick={() => setIsRefreshData(!isRefreshData)}
              >
                Refresh
              </EuiButtonEmpty>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />
      </EuiFlexItem>
      <EuiFlexItem grow>
        {isLoadingProposal ? (
          <CenterLoading />
        ) : (
          <ProposalTable
            proposalData={proposalData}
            searchProposal={searchProposal}
          />
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

const ProposalTable = ({
  proposalData,
  searchProposal,
  setRefreshData,
}: {
  proposalData: Proposal[];
  searchProposal: string;
  setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const tableRef = useRef<EuiBasicTable | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof Proposal>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [isAIModalVisible, setAiModalVisibility] = useState<boolean>(false);
  const [isDeclineProposalModalVisible, setDeclineProposalModalVisibility] =
    useState<boolean>(false);
  const [isApproveProposalModalVisible, setApproveProposalModalVisibility] =
    useState<boolean>(false);
  const [isPaymentProposalModalVisible, setPaymentProposalModalVisibility] =
    useState<boolean>(false);

  const onTableChange = ({ sort }: Criteria<Proposal>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const findProposal = (
    Proposal: Proposal[],
    pageIndex: number,
    pageSize: number,
    sortField: keyof Proposal,
    sortDirection: "asc" | "desc",
    searchProduct: string
  ) => {
    let items;
    // return null if therei is no file
    if (!Proposal) {
      return {
        pageOfItems: [],
        totalItemCount: 0,
      };
    }
    if (sortField) {
      items = Proposal.slice(0).sort(
        Comparators.property(sortField, Comparators.default(sortDirection))
      );
    } else {
      items = Proposal;
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
        Math.min(startIndex + pageSize, Proposal.length)
      );
    }

    return {
      pageOfItems,
      totalItemCount: searchedItems.length,
    };
  };

  const { pageOfItems, totalItemCount } = findProposal(
    proposalData,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    searchProposal
  );
  const pageSizeOptions = [0, 15, 30, 50, 100];

  const sorting: EuiTableSortingType<Proposal> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const actions: Array<DefaultItemAction<Proposal>> = [
    {
      name: "Tanya AI",
      description: "Tanya AI",
      icon: "userAvatar",
      color: "danger",
      type: "icon",
      isPrimary: true,
      onClick: (e) => {
        setSelectedProposal(e);
        setAiModalVisibility(true);
      },
    },
    {
      name: "Lihat Selengkapnya",
      description: "Lihat selengkapnya",
      icon: "eye",
      color: "primary",
      type: "icon",
      isPrimary: true,
      onClick: (e) => {
        setSelectedProposal(e);
      },
    },
    {
      name: "Batal Proposal",
      isPrimary: true,
      description: "Batal Proposal",
      icon: "trash",
      color: "danger",

      onClick: (e) => {
        setSelectedProposal(e);
        setDeclineProposalModalVisibility(true);
      },
      type: "icon",
    },
    {
      name: "Setujui Proposal",
      isPrimary: true,
      description: "Setujui Proposal",
      icon: "check",
      color: "success",
      onClick: (e) => {
        setSelectedProposal(e);
        setApproveProposalModalVisibility(true);
      },
      type: "icon",
    },
    {
      name: "Pembayaran Proposal",
      isPrimary: true,
      color: "accent",
      description: "Pembayaran Proposal",
      icon: "payment",
      onClick: (e) => {
        setSelectedProposal(e);
        setPaymentProposalModalVisibility(true);
      },
      type: "icon",
    },
  ];
  const columns: Array<EuiBasicTableColumn<Proposal>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
    },
    {
      field: "username",
      name: "Username",
      sortable: true,
      truncateText: true,
    },
    {
      field: "amount",
      name: "Jumlah Pinjaman",
      sortable: true,
      truncateText: true,
    },
    {
      field: "tenor",
      name: "Tenor (bulan)",
      sortable: true,
      truncateText: true,
    },
    {
      field: "age",
      name: "Umur",
      sortable: true,
      truncateText: true,
    },
    {
      field: "gender",
      name: "Jenis Kelamin",
      sortable: true,
      truncateText: true,
    },
    {
      field: "income",
      name: "Penghasilan",
      sortable: true,
    },
    {
      field: "marital_status",
      name: "Status Pernikahan",
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
      <div>
        <EuiBasicTable
          tableCaption="Demo for EuiBasicTable with selection"
          ref={tableRef}
          items={pageOfItems}
          columns={columns}
          rowHeader="id"
          itemId="id"
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
      <AiModal
        {...{
          isAIModalVisible,
          setAiModalVisibility,
          selectedProposal,
        }}
      />
      <DeclineProposalModal
        {...{
          isDeclineProposalModalVisible,
          setDeclineProposalModalVisibility,
          selectedProposal,
          setRefreshData,
        }}
      />
      <ApproveProposalModal
        {...{
          isApproveProposalModalVisible,
          setApproveProposalModalVisibility,
          selectedProposal,
          setRefreshData,
        }}
      />
      <PaymentProposalModal
        {...{
          isPaymentProposalModalVisible,
          setPaymentProposalModalVisibility,
          selectedProposal,
          setRefreshData,
        }}
      />
    </>
  );
};

const AiModal = ({
  isAIModalVisible,
  setAiModalVisibility,
  selectedProposal,
}: {
  isAIModalVisible: boolean;
  setAiModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProposal: Proposal | null;
}) => {
  const { addToast } = useRootGlobalToast();
  const [creditScore, setCreditScore] = useState<CreditScore>(
    {} as CreditScore
  );
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const randomWords = [
    "Sedang memperhitungkan data anda",
    "Sedang melihat keluar jendela anda..",
    "Apakah kalian sedang berbahagia hari ini?",
    "Kalian Pasti ngantuk ya! ",
  ];
  const getCreditScore = async () => {
    setIsLoadingData(true);
    try {
      const res = await handleGetCreditScore(selectedProposal?.id!);

      setCreditScore(res);
    } catch (error) {
      addToast({
        title: "Gagal mengambil data proposal",
        color: "danger",
        iconType: "alert",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <>
      {isAIModalVisible && (
        <EuiModal
          onClose={() => {
            setAiModalVisibility(false);
          }}
        >
          <EuiModalHeader>
            <EuiModalHeaderTitle size="m">Tanya AI</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText>
              <p>
                Atas pertimbangan dan perhitungan saya, Kopdi AI, akan membantu
                anda!
              </p>
              <EuiButton
                fullWidth
                onClick={getCreditScore}
                disabled={isLoadingData}
                isLoading={isLoadingData}
              >
                {isLoadingData &&
                  randomWords[Math.floor(Math.random() * randomWords.length)]}
                {!isLoadingData && <>Tanya AI</>}
              </EuiButton>
            </EuiText>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiFlexGroup justifyContent="center" alignItems="center">
              <EuiFlexItem>
                <EuiText>Hasil Perhitungan AI</EuiText>
                <EuiTitle>
                  <h1
                    style={{
                      color:
                        creditScore.predictions &&
                        creditScore.predictions[0] === "Low"
                          ? "red"
                          : creditScore.predictions &&
                            creditScore.predictions[0] === "Medium"
                          ? "yellow"
                          : "green",
                    }}
                  >
                    {creditScore.predictions && creditScore.predictions[0]}
                    {creditScore.predictions && creditScore.predictions[0] && (
                      <EuiText>
                        {creditScore.predictions[0] === "Low" &&
                          "Kredit Skor kurang. Anda tidak disarankan untuk mengajukan pinjaman"}
                        {creditScore.predictions[0] === "Medium" &&
                          "Kredit Skor cukup. Anda disarankan untuk mengajukan pinjaman"}
                        {creditScore.predictions[0] === "High" &&
                          "Kredit Skor tinggi. Anda disarankan untuk mengajukan pinjaman"}
                      </EuiText>
                    )}
                  </h1>
                </EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

const DeclineProposalModal = ({
  isDeclineProposalModalVisible,
  setDeclineProposalModalVisibility,
  selectedProposal,
  setRefreshData,
}: {
  isDeclineProposalModalVisible: boolean;
  setDeclineProposalModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  selectedProposal: Proposal | null;
  setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { addToast } = useRootGlobalToast();
  const triggerDeclineProposal = async () => {
    try {
      await handleDeclineProposal(selectedProposal?.id!);
      setRefreshData!(true);
      addToast({
        title: "Proposal berhasil ditolak",
        color: "success",
        iconType: "check",
      });
    } catch (error) {
      addToast({
        title: "Gagal mengambil data proposal",
        color: "danger",
        iconType: "alert",
      });
    }
  };

  return (
    <>
      {isDeclineProposalModalVisible && (
        <EuiConfirmModal
          title="Hapus Proposal"
          onCancel={() => setDeclineProposalModalVisibility(false)}
          onConfirm={() => triggerDeclineProposal()}
          cancelButtonText="Batal"
          confirmButtonText="Hapus"
          defaultFocusedButton="confirm"
          buttonColor="danger"
        >
          <EuiText>Apakah anda yakin ingin menghapus proposal ini?</EuiText>
        </EuiConfirmModal>
      )}
    </>
  );
};

const ApproveProposalModal = ({
  isApproveProposalModalVisible,
  setApproveProposalModalVisibility,
  selectedProposal,
  setRefreshData,
}: {
  isApproveProposalModalVisible: boolean;
  setApproveProposalModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedProposal: Proposal | null;
  setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { addToast } = useRootGlobalToast();
  const triggerApproveProposal = async () => {
    try {
      await handleApproveProposal(selectedProposal?.id!);
      addToast({
        title: "Proposal berhasil disetujui",
        color: "success",
        iconType: "check",
      });
      setRefreshData!(true);
    } catch (error) {
      addToast({
        title: "Gagal mengambil data proposal",
        color: "danger",
        iconType: "alert",
      });
    }
  };

  return (
    <>
      {isApproveProposalModalVisible && (
        <EuiConfirmModal
          title="Setujui Proposal"
          onCancel={() => setApproveProposalModalVisibility(false)}
          onConfirm={() => triggerApproveProposal()}
          cancelButtonText="Batal"
          confirmButtonText="Setujui"
          defaultFocusedButton="confirm"
          buttonColor="success"
        >
          <EuiText>Apakah anda yakin ingin menyetujui proposal ini?</EuiText>
        </EuiConfirmModal>
      )}
    </>
  );
};

const PaymentProposalModal = ({
  isPaymentProposalModalVisible,
  setPaymentProposalModalVisibility,
  selectedProposal,
  setRefreshData,
}: {
  isPaymentProposalModalVisible: boolean;
  setPaymentProposalModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedProposal: Proposal | null;
  setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { addToast } = useRootGlobalToast();
  const navigate = useNavigate();
  const triggerPaymentProposal = async () => {
    try {
      const p = await handlePaymentProposal(selectedProposal?.id!);
      if (p) {
        // navigate to payment page p.redirect_url
        navigate(p.redirect_url);
      }
      setRefreshData!(true);
      addToast({
        title: "Proposal berhasil dibayar",
        color: "success",
        iconType: "check",
      });
    } catch (error) {
      addToast({
        title: "Gagal mengambil data proposal",
        color: "danger",
        iconType: "alert",
      });
    }
  };

  return (
    <>
      {isPaymentProposalModalVisible && (
        <EuiConfirmModal
          title="Bayar Proposal"
          onCancel={() => setPaymentProposalModalVisibility(false)}
          onConfirm={() => triggerPaymentProposal()}
          cancelButtonText="Batal"
          confirmButtonText="Bayar"
          defaultFocusedButton="confirm"
          buttonColor="success"
        >
          <EuiText>Apakah anda yakin ingin membayar proposal ini?</EuiText>
        </EuiConfirmModal>
      )}
    </>
  );
};

// const UserProposalDetail = ({
//   proposalData,
//   searchProposal,
// }: {
//   proposalData: Proposal[];
//   searchProposal: string;
//   setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   return (
//     // display everything from proposalData here
//     <>
//       <EuiFlexGroup direction="column">

//         </EuiFlexGroup>
//     </>
//   );
// };
