import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function LoginForm() {
  return (
    <>
      <h1>Login</h1>
      <div className="p-inputgroup my-3 flex">
        <span className="p-inputgroup-addon">
          <i className="pi pi-at"></i>
        </span>
        <InputText
          placeholder="Email"
          type="email"
          id="register_email"
          required
        />
      </div>
      <div className="p-inputgroup my-3 flex">
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <Password
          placeholder="Password"
          feedback={false}
          id="register_password"
          required
        />
      </div>
    </>
  );
}
