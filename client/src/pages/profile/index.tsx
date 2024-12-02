import { useAuthState, UserDef } from "../../contexts/AuthContext";
import ApiService from "../../services/api";
import { Card } from "primereact/card";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useEffect, useState } from "react";
import environment from "../../environment";
import { InputText } from "primereact/inputtext";
import { useNotification } from "../../contexts/NotificationContext";
import { Avatar } from "primereact/avatar";
import { FileUpload } from "primereact/fileupload";

export default function Profile() {
  const apiService = new ApiService();
  const { setUser } = useAuthState();
  const { showMessage } = useNotification();
  const [edit, setEdit] = useState(false);
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 960);
  const [userData, setUserData] = useState<UserDef>({
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
    id: "",
  });
  useEffect(() => {
    apiService.get(environment.getSelf).then((res) => {
      setUserData(res.data);
    });
  }, []);

  onresize = () => {
    if (window.innerWidth < 960) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  };

  return (
    <Card
      header={
        <>
          <div
            className={`flex flex-row justify-content-${
              smallScreen ? (!edit ? "between" : "center") : "between"
            } mt-2`}
          >
            {smallScreen ? (
              !edit && <h1 className="mx-5">Profile</h1>
            ) : (
              <h1 className="mx-5">Profile</h1>
            )}
            <div className="mx-5 my-3 gap-5 flex">
              {edit && (
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  severity="danger"
                  outlined
                  onClick={async () => {
                    setEdit(false);
                    apiService.get(environment.getSelf).then((res) => {
                      setUserData(res.data);
                    });
                  }}
                />
              )}
              <ToggleButton
                checked={edit}
                onChange={(e) => {
                  if (edit) {
                    apiService
                      .patch(environment.updateSelf, { ...userData })
                      .then(
                        (res) => {
                          setUserData(res.data);
                          const temp = userData;
                          delete temp.email;
                          setUser(temp);
                          setEdit(e.value);
                        },
                        (err) => {
                          console.log(err);
                          showMessage({
                            severity: "error",
                            summary: "Error",
                            detail: err.response.data.message,
                          });
                          return;
                        }
                      );
                  } else {
                    setEdit(e.value);
                  }
                }}
                onLabel="Save"
                offLabel="Edit"
                onIcon="pi pi-cloud-upload"
                offIcon="pi pi-pen-to-square"
              />
            </div>
          </div>
          {!smallScreen && <Divider className="w-auto mx-5" />}
        </>
      }
      footer={
        <div className="flex flex-row justify-content-center gap-5">
          <Button
            label="Delete account"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => {
              apiService.delete(environment.deleteSelf).then(() => {
                window.location.href = "/auth";
              });
            }}
          />
        </div>
      }
    >
      <div
        className={`flex flex-${
          smallScreen ? `column justify-content-center` : `row`
        } gap-5 w-full`}
      >
        <div
          className={`flex flex-column align-content-between align-items-center w-${
            smallScreen ? `full` : `6`
          } gap-6`}
        >
          <h2
            className={`border-solid border-bottom-1 border-none px-${
              smallScreen ? "5" : "8"
            } pb-2`}
          >
            Personal Information
          </h2>
          <div className="p-inputgroup flex-1" style={{ maxWidth: "500px" }}>
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              placeholder="First name"
              value={userData?.firstName}
              onChange={(e) => {
                if (edit) {
                  setUserData({ ...userData, firstName: e.target.value });
                }
              }}
              disabled={!edit}
            />
            <InputText
              placeholder="Last name"
              value={userData?.lastName}
              onChange={(e) => {
                if (edit) {
                  setUserData({ ...userData, lastName: e.target.value });
                }
              }}
              disabled={!edit}
            />
          </div>

          <div className="p-inputgroup flex-1" style={{ maxWidth: "500px" }}>
            <span className="p-inputgroup-addon">
              <i className="pi pi-at"></i>
            </span>
            <InputText placeholder="Email" value={userData?.email} disabled />
          </div>

          <Button
            severity="danger"
            label="Change password"
            outlined
            disabled={!edit}
          />
        </div>

        {!smallScreen && <Divider layout="vertical" />}

        <div
          className={`flex flex-column justify-content-center align-items-center gap-3 w-${
            smallScreen ? `full` : `6`
          }`}
        >
          <h2 className="border-solid border-bottom-1 border-none px-7 pb-2">
            Profile Picture
          </h2>
          <Avatar
            style={{
              color: "white",
              backgroundColor: "transparent",
              width: "200px",
              height: "200px",
            }}
            className="border border-solid border-0"
            image={userData.picture || ""}
            icon="pi pi-user"
            size="xlarge"
          />
          <div className="flex flex-row gap-3">
            <Button
              label="Delete picture"
              icon="pi pi-trash"
              severity="danger"
              disabled={!edit || userData.picture === null}
              onClick={() => {
                setUserData({ ...userData, picture: null });
              }}
            />
            <FileUpload
              accept="image/*"
              mode="basic"
              onUpload={() => {}}
              maxFileSize={1000000}
              chooseLabel="Upload"
              chooseOptions={{ icon: "pi pi-fw pi-image" }}
              disabled={!edit}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
