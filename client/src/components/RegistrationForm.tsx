import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function LoginForm() {
  return (
    <>
      <h1>Registration</h1>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText placeholder="First name" id="first_name" required />
        <InputText placeholder="Last name" id="last_name" required />
      </div>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-at"></i>
        </span>
        <InputText placeholder="Email" type="email" id="email" required />
      </div>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <Password
          placeholder="Password"
          feedback={false}
          id="password"
          required
        />
        <Password
          placeholder="Confirm password"
          feedback={false}
          id="confirm_password"
          required
        />
      </div>
    </>
  );
}
