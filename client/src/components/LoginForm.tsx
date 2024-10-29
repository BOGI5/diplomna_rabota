import { useSignState } from "../contexts/SignFormContext";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function LoginForm() {
  const { formData, setFormData } = useSignState();

  return (
    <>
      <h1>Login</h1>
      <div className="p-inputgroup my-3 flex">
        <span className="p-inputgroup-addon">
          <i className="pi pi-at"></i>
        </span>
        <InputText
          value={formData.email.value}
          placeholder="Email"
          type="email"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: { value: e.target.value, error: false },
            })
          }
          className={formData.email.error ? "p-invalid" : ""}
          required
        />
      </div>
      <div className="p-inputgroup my-3 flex">
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <Password
          value={formData.password.value}
          placeholder="Password"
          feedback={false}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: {
                value: e.target.value,
                error: false,
              },
            })
          }
          className={formData.password.error ? "p-invalid" : ""}
          required
        />
      </div>
    </>
  );
}
