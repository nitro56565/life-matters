import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { IonButton, IonInput, IonItem, IonPage, IonText } from "@ionic/react";
import "./SetNewPasswordPage.css";

const SetNewPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    newpassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const { password, newpassword } = formData;
    // if(password==newpassword){
    console.log(formData);
    history.push("/home");
    // }else{
    //     setErrorMessage("Retype the correct password");
    // }
  };

  return (
    <IonPage>
      <div className="password-container">
        <div className="password-card">
          <div className="password-header">
            <h1>Set New Password</h1>
          </div>
          {successMessage && (
            <IonText color="success">{successMessage}</IonText>
          )}
          <form onSubmit={handleSubmit}>
            <IonItem className="password-item">
              <IonInput
                label="Enter new password"
                labelPlacement="floating"
                class="password-input password-input"
                type="password"
                name="password"
                maxlength={12}
                value={formData.password}
                onIonChange={handleChange}
                required
              />
            </IonItem>
            <IonItem className="password-item">
              <IonInput
                label="Enter your password again"
                labelPlacement="floating"
                class="password-input password-input"
                type={showPassword ? "text" : "password"}
                name="newpassword"
                maxlength={12}
                value={formData.newpassword}
                onIonChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </IonItem>
            {errorMessage && <IonText color="danger">{errorMessage}</IonText>}
            <IonButton type="submit" expand="block" className="password-button">
              Change Password
            </IonButton>
          </form>
        </div>
      </div>
    </IonPage>
  );
};

export default SetNewPassword;
