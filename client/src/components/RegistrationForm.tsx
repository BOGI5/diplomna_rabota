import { useSignState } from "../contexts/SignFormContext";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function RegistrationForm() {
  const { formData, setFormData } = useSignState();

  return (
    <>
      <h1>Registration</h1>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText
          value={formData.firstName.value}
          placeholder="First name"
          onChange={(e) =>
            setFormData({
              ...formData,
              firstName: {
                value: e.target.value,
                error: false,
              },
            })
          }
          className={formData.firstName.error ? "p-invalid" : ""}
          required
        />
        <InputText
          value={formData.lastName.value}
          placeholder="Last name"
          onChange={(e) =>
            setFormData({
              ...formData,
              lastName: {
                value: e.target.value,
                error: false,
              },
            })
          }
          className={formData.lastName.error ? "p-invalid" : ""}
          required
        />
      </div>
      <div className="p-inputgroup my-3">
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
              email: {
                value: e.target.value,
                error: false,
              },
            })
          }
          className={formData.email.error ? "p-invalid" : ""}
          required
        />
      </div>
      <div className="p-inputgroup my-3">
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
              confirmPassword: {
                value: formData.confirmPassword.value,
                error: false,
              },
            })
          }
          className={formData.password.error ? "p-invalid" : ""}
          required
        />
        <Password
          value={formData.confirmPassword.value}
          placeholder="Confirm password"
          feedback={false}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: {
                value: formData.password.value,
                error: false,
              },
              confirmPassword: {
                value: e.target.value,
                error: false,
              },
            })
          }
          className={formData.confirmPassword.error ? "p-invalid" : ""}
          required
        />
      </div>
    </>
  );
}
