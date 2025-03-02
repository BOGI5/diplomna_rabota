import ApiService from "../services/api";
import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import environment from "../environment";
import { ToastMessage } from "primereact/toast";
import { useAuthContext } from "./AuthContext";

export interface SignStateType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  smallScreen: boolean;
  setSmallScreen: (smallScreen: boolean) => void;
  accountNotExists: boolean;
  setAccountNotExists: (accountNotExists: boolean) => void;
  formData: {
    email: { value: string; error: boolean };
    password: { value: string; error: boolean };
    confirmPassword: { value: string; error: boolean };
    firstName: { value: string; error: boolean };
    lastName: { value: string; error: boolean };
  };
  setFormData: (formData: {
    email: { value: string; error: boolean };
    password: { value: string; error: boolean };
    confirmPassword: { value: string; error: boolean };
    firstName: { value: string; error: boolean };
    lastName: { value: string; error: boolean };
  }) => void;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    notification: (props: ToastMessage) => void
  ) => void;
  onGoogleSignIn: () => void;
}

export interface SignContextDef {
  sign: SignStateType;
}

const SignFormContext = createContext<SignContextDef | undefined>(undefined);

export const SignFormProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(true);
  const [smallScreen, setSmallScreen] = useState(false);
  const [accountNotExists, setAccountNotExists] = useState(false);

  const [formData, setFormData] = useState({
    email: { value: "", error: false },
    password: { value: "", error: false },
    confirmPassword: { value: "", error: false },
    firstName: { value: "", error: false },
    lastName: { value: "", error: false },
  });

  const { setUser } = useAuthContext();

  onresize = () => {
    if (window.innerWidth < 600) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  };

  const onGoogleSignIn = () => {
    window.location.href = `${environment.apiUrl}${environment.oauthUrl}`;
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    notification: (props: ToastMessage) => void
  ) => {
    e.preventDefault();
    if (
      formData.password.value !== formData.confirmPassword.value &&
      accountNotExists
    ) {
      notification({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        sticky: true,
      });
      setFormData({
        ...formData,
        password: { ...formData.password, error: true },
        confirmPassword: { ...formData.confirmPassword, error: true },
      });
      return;
    }
    setVisible(false);
    new ApiService()
      .post(
        `${accountNotExists ? environment.signUpUrl : environment.signInUrl}`,
        {
          email: formData.email.value,
          password: formData.password.value,
          ...(accountNotExists && {
            firstName: formData.firstName.value,
            lastName: formData.lastName.value,
          }),
        }
      )
      .then(
        (res) => {
          setUser(res.data);
          window.location.href = `${environment.clientUrl}`;
        },
        (err) => {
          let errorMessage: string = Array.isArray(err.response.data.message)
            ? err.response.data.message[0]
            : err.response.data.message;

          errorMessage =
            errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);

          notification({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
            sticky: true,
          });
          handleSubmitError(
            err.response.data.statusCode,
            errorMessage.toLocaleLowerCase()
          );
        }
      );
  };

  const handleSubmitError = (code: number, message: string) => {
    if (code === 400) {
      if (message.includes("email")) {
        setFormData({
          ...formData,
          email: { ...formData.email, error: true },
        });
      } else if (message.includes("password")) {
        setFormData({
          ...formData,
          password: { ...formData.password, error: true },
        });
      } else if (message.includes("invalid credentials")) {
        setFormData({
          ...formData,
          email: { ...formData.email, error: true },
          password: { ...formData.password, error: true },
        });
      } else if (message.includes("user already exists")) {
        setFormData({
          email: { ...formData.email, error: true },
          password: { ...formData.password, error: true },
          confirmPassword: {
            ...formData.confirmPassword,
            error: true,
          },
          firstName: { ...formData.firstName, error: true },
          lastName: { ...formData.lastName, error: true },
        });
      }
    } else if (code === 500) {
      // handle server error
    }
    setVisible(true);
  };

  onreset = () => {
    setFormData({
      email: { value: "", error: false },
      password: { value: "", error: false },
      confirmPassword: { value: "", error: false },
      firstName: { value: "", error: false },
      lastName: { value: "", error: false },
    });
  };

  return (
    <SignFormContext.Provider
      value={{
        sign: {
          visible,
          setVisible,
          smallScreen,
          setSmallScreen,
          accountNotExists,
          setAccountNotExists,
          formData,
          setFormData,
          handleSubmit,
          onGoogleSignIn,
        },
      }}
    >
      {children}
    </SignFormContext.Provider>
  );
};

export const useSignState = (): SignStateType => {
  const context = useContext(SignFormContext);
  if (context === undefined) {
    throw new Error("useSignState must be used within a SignFormProvider");
  }
  return context.sign;
};
