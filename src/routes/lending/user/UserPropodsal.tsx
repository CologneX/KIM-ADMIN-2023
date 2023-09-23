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
} from "@elastic/eui";
import CenterLoading from "../../../components/CenterLoading";
import { useState } from "react";

export default () => {
  const [proposalData, setProposalData] = useState([]);
  const [isLoadingProposal, setIsLoadingProposal] = useState(false);
  const [searchProposal, setSearchProposal] = useState("");
  const [isRefreshData, setIsRefreshData] = useState(false);

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
        {isLoadingProposal ? <CenterLoading /> : <ProposalCard />}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

const ProposalCard = () => {
  return (
    <EuiFlexGrid columns={2}>
      <EuiFlexItem>
        <EuiPanel>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiTitle size="s">
                <span>Proposal 1</span>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType={"refresh"}></EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGrid>
  );
};
