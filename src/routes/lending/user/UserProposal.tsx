import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  EuiFieldSearch,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGrid,
  EuiPanel,
  EuiBadge,
  EuiLink,
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiFieldText,
  EuiFormRow,
  EuiFieldNumber,
  EuiSuperSelect,
  EuiFilePicker,
} from "@elastic/eui";
import CenterLoading from "../../../components/CenterLoading";
import { useEffect, useState } from "react";
import refreshToken from "../../../components/refreshToken";
import { Proposal, ProposalForm } from "../../../types/proposal";
import { useRootGlobalToast } from "../../../layouts/Layout";
import toRupiah from "../../../utils/toRupiah";
import { useNavigate } from "react-router-dom";

const handleGetProposal = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/lending/user/proposal");
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

const handleCreateLendingProposal = async (data: ProposalForm) => {
  const formKK = new FormData();
  formKK.append("file", data.kk_url);
  const res = await fetch("/api/v1/lending/user/document", {
    method: "POST",
    body: formKK,
  });
  const linkKK = await res.json().then((res) => res.filename);
  const formKTP = new FormData();
  formKTP.append("file", data.ktp_url);
  const res2 = await fetch("/api/v1/lending/user/document", {
    method: "POST",
    body: formKTP,
  });
  const linkKTP = await res2.json().then((res) => res.filename);

  const req = async () => {
    const res = await fetch("/api/v1/lending/user/proposal", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        kk_url: linkKK.toString(),
        ktp_url: linkKTP.toString(),
      }),
    });
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      if (res.status === 201) {
        return Promise.reject(await res.json());
      }
      return true;
    }
    if (res.status === 201) {
      return Promise.reject(await res.json());
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const handleUploadProposalDocuments = async ({ file }: { file: FormData }) => {
  const req = async () => {
    const res = await fetch("/api/v1/lending/user/document", {
      method: "POST",
      body: file,
    });
    return res;
  };
  try {
    let res = await req();
    if (res.status === 401) {
      await refreshToken();
      res = await req();
      if (res.status === 201) {
        return Promise.reject(await res.json());
      }
      return await res.json();
    }
    if (res.status === 201) {
      return Promise.reject(await res.json());
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export default () => {
  const [proposalData, setProposalData] = useState([]);
  const [isLoadingProposal, setIsLoadingProposal] = useState(false);
  const [searchProposal, setSearchProposal] = useState("");
  const [isRefreshData, setIsRefreshData] = useState(false);
  const [isProposalFormCardActive, setIsProposalFormCardActive] =
    useState(false);
  const { addToast } = useRootGlobalToast();
  useEffect(() => {
    const getProposal = async () => {
      setIsLoadingProposal(true);
      try {
        const res = await handleGetProposal();
        setProposalData(res);
      } catch (error) {
        addToast({
          title: "Gagal memuat data",
          color: "danger",
          iconType: "alert",
        });
      } finally {
        setIsLoadingProposal(false);
      }
    };
    getProposal();
  }, [isRefreshData]);
  return (
    <>
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
                  onClick={() => {
                    setIsProposalFormCardActive(true);
                  }}
                >
                  Ajukan Proposal
                </EuiButton>
                <EuiButton
                  iconType={"refresh"}
                  onClick={() => setIsRefreshData(!isRefreshData)}
                >
                  Refresh
                </EuiButton>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
        </EuiFlexItem>
        <EuiFlexItem grow>
          {isLoadingProposal ? (
            <CenterLoading />
          ) : (
            <ProposalCard {...{ proposalData }} />
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
      <ProposalFormCard
        {...{ isProposalFormCardActive, setIsProposalFormCardActive }}
      />
    </>
  );
};

const ProposalCard = ({ proposalData }: { proposalData: Proposal[] }) => {
  const navigate = useNavigate();
  return (
    <>
      <EuiFlexGrid columns={2}>
        {proposalData.map((proposal, i) => (
          <EuiFlexItem>
            <EuiPanel>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                  <EuiTitle size="s">
                    <div>Proposal {i + 1}</div>
                  </EuiTitle>
                  <small>{proposal.id}</small>
                </EuiFlexItem>
                {proposal.payment_url &&
                  proposal.payment_token &&
                  proposal.is_paid && (
                    <>
                      <EuiButton
                        size="s"
                        onClick={() =>
                          window.open(
                            proposal.payment_url,
                            "_blank",
                            "height=800, width=500"
                          )
                        }
                      >
                        Lunaskan Pinjaman
                      </EuiButton>
                    </>
                  )}
                <EuiBadge
                  color={
                    proposal.status === "pending"
                      ? "warning"
                      : proposal.status === "approved"
                      ? "primary"
                      : "danger"
                  }
                >
                  {proposal.status}
                </EuiBadge>
              </EuiFlexGroup>
              <EuiSpacer />
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Bunga </div>
                  </EuiTitle>
                  <div>{proposal.interest_rate} %</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Jumlah Pinjaman</div>
                  </EuiTitle>
                  <div>{toRupiah(proposal.amount)}</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Tenor</div>
                  </EuiTitle>
                  <div>{proposal.tenor} Bulan</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Penghasilan</div>
                  </EuiTitle>
                  <div>{toRupiah(proposal.income)}</div>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer />
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Umur</div>
                  </EuiTitle>
                  <div>{proposal.age}</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Gender</div>
                  </EuiTitle>
                  <div>{proposal.gender}</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Edukasi Terakhir</div>
                  </EuiTitle>
                  <div>{proposal.last_education}</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Status Menikah</div>
                  </EuiTitle>
                  <div>{proposal.marital_status}</div>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer />
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Jumlah Anak</div>
                  </EuiTitle>
                  <div>{proposal.number_of_children}</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Keadaan Tempat Tinggal</div>
                  </EuiTitle>
                  <div>{proposal.has_house}</div>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>Kartu Keluarga</div>
                  </EuiTitle>
                  <EuiLink href={"/usercontent/" + proposal.kk_url} download>
                    Kartu Keluarga
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <div>KTP</div>
                  </EuiTitle>
                  <EuiLink href={"/usercontent/" + proposal.ktp_url} download>
                    KTP
                  </EuiLink>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
        ))}
      </EuiFlexGrid>
    </>
  );
};

const ProposalFormCard = ({
  isProposalFormCardActive,
  setIsProposalFormCardActive,
}: {
  isProposalFormCardActive: boolean;
  setIsProposalFormCardActive: (value: boolean) => void;
}) => {
  const [form, setForm] = useState<ProposalForm>({} as ProposalForm);
  return (
    <>
      {isProposalFormCardActive && (
        <EuiModal
          onClose={() => {
            setIsProposalFormCardActive(false);
          }}
        >
          <EuiModalHeader>
            <EuiTitle size="l">
              <span>Ajukan Proposal</span>
            </EuiTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiFlexGrid columns={2}>
              <EuiFlexItem>
                <EuiFormRow label="Jumlah Uang" helpText="Dalam rupiah">
                  <EuiFieldNumber
                    value={form.amount}
                    onChange={(e) => {
                      setForm({ ...form, amount: Number(e.target.value) });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Bunga" helpText="Dalam persen">
                  <EuiFieldNumber
                    value={form.interest_rate}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        interest_rate: Number(e.target.value),
                      });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Tenor" helpText="Dalam bulan">
                  <EuiFieldNumber
                    value={form.tenor}
                    onChange={(e) => {
                      setForm({ ...form, tenor: Number(e.target.value) });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Penghasilan" helpText="Dalam rupiah">
                  <EuiFieldNumber
                    value={form.income}
                    onChange={(e) => {
                      setForm({ ...form, income: Number(e.target.value) });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Umur" helpText="Dalam tahun">
                  <EuiFieldNumber
                    value={form.age}
                    onChange={(e) => {
                      setForm({ ...form, age: Number(e.target.value) });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiFormRow label="Jumlah Anak" helpText="Dalam orang">
                  <EuiFieldNumber
                    value={form.number_of_children}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        number_of_children: Number(e.target.value),
                      });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow
                  label="Keadaan Tempat Tinggal"
                  helpText="Dalam orang"
                >
                  <EuiSuperSelect
                    options={[
                      { value: "1", inputDisplay: "Milik Sendiri" },
                      { value: "0", inputDisplay: "Sewa" },
                    ]}
                    valueOfSelected={
                      form.has_house === true
                        ? "1"
                        : form.has_house === false
                        ? "0"
                        : "1"
                    }
                    onChange={(value) => {
                      setForm({
                        ...form,
                        has_house: value === "1" ? true : false,
                      });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Gender">
                  <EuiSuperSelect
                    options={[
                      { value: "1", inputDisplay: "Perempuan" },
                      { value: "0", inputDisplay: "Laki" },
                    ]}
                    valueOfSelected={
                      form.gender === true
                        ? "1"
                        : form.gender === false
                        ? "0"
                        : "0"
                    }
                    onChange={(value) => {
                      setForm({
                        ...form,
                        gender: value === "1" ? true : false,
                      });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Pendidikan Terakhir">
                  <EuiSuperSelect
                    options={[
                      { value: "0", inputDisplay: "SMA" },
                      { value: "1", inputDisplay: "Diploma" },
                      { value: "2", inputDisplay: "S1" },
                      { value: "3", inputDisplay: "S2" },
                      { value: "4", inputDisplay: "S3" },
                    ]}
                    valueOfSelected={
                      form.last_education === 0
                        ? "0"
                        : form.last_education === 1
                        ? "1"
                        : form.last_education === 2
                        ? "2"
                        : form.last_education === 3
                        ? "3"
                        : form.last_education === 4
                        ? "4"
                        : "4"
                    }
                    onChange={(value) => {
                      setForm({
                        ...form,
                        last_education: Number(value),
                      });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Status Perwakinan">
                  <EuiSuperSelect
                    options={[
                      { value: "0", inputDisplay: "Single" },
                      { value: "1", inputDisplay: "Married" },
                    ]}
                    valueOfSelected={
                      form.marital_status === true
                        ? "1"
                        : form.marital_status === false
                        ? "0"
                        : "1"
                    }
                    onChange={(value) => {
                      setForm({
                        ...form,
                        marital_status: value === "1" ? true : false,
                      });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Kartu Keluarga">
                  <EuiFilePicker
                    initialPromptText="Pilih File"
                    onChange={(files) => {
                      setForm({ ...form, kk_url: files[0].name });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="KTP">
                  <EuiFilePicker
                    initialPromptText="Pilih File"
                    onChange={(files) => {
                      setForm({ ...form, ktp_url: files[0].name });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGrid>
            <EuiSpacer />
            <EuiButton
              fill
              fullWidth
              onClick={async () => {
                try {
                  await handleCreateLendingProposal(form);
                  setIsProposalFormCardActive(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Ajukan Proposal
            </EuiButton>
          </EuiModalBody>
        </EuiModal>
      )}
    </>
  );
};
