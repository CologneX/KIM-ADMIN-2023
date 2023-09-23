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

export default () => {
  const simpleAccordionId = useGeneratedHtmlId({ prefix: "simpleAccordion" });
  const toast = useToast();
  return (
    <>
      <EuiFlexGrid columns={3}>
        <EuiFlexItem>
          <EuiPanel>ONe</EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>ONe</EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>ONe</EuiPanel>
        </EuiFlexItem>
        <EuiButton>Mantap</EuiButton>
      </EuiFlexGrid>
    </>
  );
};
