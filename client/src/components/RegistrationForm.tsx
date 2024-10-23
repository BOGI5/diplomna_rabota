import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function LoginForm() {
  return (
    <>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText placeholder="First name" />
        <InputText placeholder="Last name" />
      </div>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-at"></i>
        </span>
        <InputText placeholder="Email" type="email" />
      </div>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <Password placeholder="Password" feedback={false} />
        <Password placeholder="Confirm password" feedback={false} />
      </div>
    </>
  );
}
