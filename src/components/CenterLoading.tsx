import { EuiPageTemplate, EuiLoadingSpinner } from "@elastic/eui";

export default () => {
  return (
    <EuiPageTemplate.Section alignment="center">
      <EuiLoadingSpinner size="xxl" />
    </EuiPageTemplate.Section>
  );
};
