import {
  EuiAccordion,
  EuiButton,
  EuiFlexGrid,
  EuiFlexItem,
  EuiPanel,
  EuiText,
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

export default () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWait, setTotalWait] = useState(0);
  const [totalSME, setTotalSME] = useState(0);
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  const simpleAccordionId = useGeneratedHtmlId({ prefix: "simpleAccordion" });
  const toast = useToast();
  return (
    <>
      <EuiFlexGrid columns={3}>
        <EuiFlexItem>
          <EuiPanel>{totalUsers}</EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>{totalSME}</EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>{totalWait}</EuiPanel>
        </EuiFlexItem>
      </EuiFlexGrid>
    </>
  );
};
