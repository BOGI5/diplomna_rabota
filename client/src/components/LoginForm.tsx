import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  setFormData: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => void;
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <>
      <h1>Login</h1>
      <div className="p-inputgroup my-3 flex">
        <span className="p-inputgroup-addon">
          <i className="pi pi-at"></i>
        </span>
        <InputText
          value={props.formData.email}
          placeholder="Email"
          type="email"
          onChange={(e) =>
            props.setFormData({ ...props.formData, email: e.target.value })
          }
          required
        />
      </div>
      <div className="p-inputgroup my-3 flex">
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <Password
          value={props.formData.password}
          placeholder="Password"
          feedback={false}
          onChange={(e) =>
            props.setFormData({ ...props.formData, password: e.target.value })
          }
          required
        />
      </div>
    </>
  );
}
