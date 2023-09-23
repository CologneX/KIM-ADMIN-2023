import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiGlobalToastList,
  EuiIcon,
  EuiPageSection,
  EuiPageTemplate,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import { useEffect, useState } from "react";
import useToast from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { Login } from "../types/user";

export default () => {
  const { getAllToasts, removeToast, addToast } = useToast();
  const navigator = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [{ username, password }, setLoginForm] = useState<Login>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "Login - KIM Sumber Warjo";
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch(`/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      navigator("/");
    } else {
      setLoginError(data.error[0]);
      addToast({
        title: "Gagal",
        text: data.message,
      });
    }
  };

  return (
    <EuiPageTemplate bottomBorder="extended" minHeight="100vh" offset={0}>
      <EuiPageSection alignment="center" grow>
        <EuiFlexGroup>
          <EuiFlexItem
            css={{
              width: "30rem",
            }}
          >
            <EuiPanel>
              <EuiTitle size="m" className="eui-textCenter">
                <p>Masuk</p>
              </EuiTitle>
              <EuiText size="s" textAlign="center">
                Masuk untuk mengakses aplikasi
              </EuiText>
              <EuiSpacer size="s" />
              <EuiFieldText
                prepend={<EuiIcon type="user" />}
                value={username}
                isInvalid={!!loginError}
                onChange={(e) =>
                  setLoginForm({
                    username: e.target.value,
                    password,
                  })
                }
                placeholder="Masukkan Username"
              />
              <EuiSpacer size="s" />
              <EuiFieldPassword
                value={password}
                isInvalid={!!loginError}
                onChange={(e) =>
                  setLoginForm({ username, password: e.target.value })
                }
                placeholder="Masukkan Password"
                type="dual"
              />
              <EuiSpacer size="s" />
              <EuiButton fullWidth isLoading={loading} onClick={handleLogin}>
                Masuk
              </EuiButton>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageSection>
      <EuiGlobalToastList
        toasts={getAllToasts()}
        dismissToast={({ id }) => removeToast(id)}
        toastLifeTimeMs={6000}
      />
    </EuiPageTemplate>
  );
};
