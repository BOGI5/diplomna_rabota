import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

interface RegistrationFormProps {
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

export default function RegistrationForm(props: RegistrationFormProps) {
  return (
    <>
      <h1>Registration</h1>
      <div className="p-inputgroup my-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText
          value={props.formData.firstName}
          placeholder="First name"
          onChange={(e) =>
            props.setFormData({ ...props.formData, firstName: e.target.value })
          }
          required
        />
        <InputText
          value={props.formData.lastName}
          placeholder="Last name"
          onChange={(e) =>
            props.setFormData({ ...props.formData, lastName: e.target.value })
          }
          required
        />
      </div>
      <div className="p-inputgroup my-3">
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
      <div className="p-inputgroup my-3">
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
        <Password placeholder="Confirm password" feedback={false} required />
      </div>
    </>
  );
}
