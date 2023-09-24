import {
  EuiAccordion,
  EuiButton,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
  EuiTitle,
  useGeneratedHtmlId,
} from "@elastic/eui";
import useToast from "../hooks/useToast";
import { useEffect, useState } from "react";
import refreshToken from "../components/refreshToken";
const handleGetTotalUsers = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/analytics/total-user");
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
const handleGetTotalWait = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/analytics/total-awaiting");
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
const handleGetSME = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/analytics/total-sme");
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
const handleTotalUser = async () => {
  const req = async () => {
    const res = await fetch("/api/v1/analytics/top-product");
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWait, setTotalWait] = useState(0);
  const [totalSME, setTotalSME] = useState(0);
  const [topProducts, setTopProducts] = useState(0);
  useEffect(() => {
    try {
      handleGetTotalUsers().then((res) => {
        setTotalUsers(res.total);
      });
      handleGetTotalWait().then((res) => {
        setTotalWait(res.total);
      });
      handleGetSME().then((res) => {
        setTotalSME(res.total);
      });
      handleTotalUser().then((res) => {
        console.log(res);
        setTopProducts(res.total);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // let chart = (
  //   <Chart size={{ height: 200 }}>
  //     <Settings theme={euiChartTheme.theme} />
  //     <Partition
  //       data={[
  //         {
  //           category: "Name",
  //           percent: 50,
  //         },
  //       ]}
  //       valueAccessor={(d) => Number(d.percent)}
  //       valueFormatter={() => ""} // Hide the slice value if data values are already in percentages
  //       layers={[
  //         {
  //           groupByRollup: (d) => d.category,
  //           shape: {
  //             fillColor: (d) =>
  //               euiChartTheme.theme.colors.vizColors[d.sortIndex],
  //           },
  //         },
  //       ]}
  //       emptySizeRatio={0.4} // To create a donut chart
  //       clockwiseSectors={false} // For correct slice order
  //     />
  //   </Chart>
  // );
  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiTitle size="l">
            <h1>Selamat Datang, Admin</h1>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGrid columns={3}>
            <EuiFlexItem>
              <EuiPanel>
                <EuiTitle size="m">
                  <h1>Total Pengguna</h1>
                </EuiTitle>
                <EuiTitle size="s">
                  <span>{totalUsers}</span>
                </EuiTitle>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel>
                <EuiTitle size="m">
                  <h1>Total Bisnis / UMKM</h1>
                </EuiTitle>
                <EuiTitle size="s">
                  <span>{totalSME}</span>
                </EuiTitle>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel>
                <EuiTitle size="m">
                  <h1>Total Penunggu Proposal</h1>
                </EuiTitle>
                <EuiTitle size="s">
                  <span>{totalWait}</span>
                </EuiTitle>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel>
                <EuiTitle size="m">
                  <h1>Produk Terbaik</h1>
                </EuiTitle>
                <EuiTitle size="s">
                  <span>{topProducts}</span>
                </EuiTitle>
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGrid>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
