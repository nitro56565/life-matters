import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { IonButton, IonInput, IonItem, IonPage, IonText } from "@ionic/react";
import "./SetNewPasswordPage.css";
import axios from "axios";

interface SetNewPasswordProps {
  phone: string;
}

const SetNewPassword: React.FC <SetNewPasswordProps> = ({ phone}) => {
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
  const phone = localStorage.getItem("phone"); 

  if (!phone) {
    setErrorMessage("Phone number is missing. Try again.");
    return;
  }

  if (password !== newpassword) {
    setErrorMessage("Passwords do not match.");
    return;
  }
  console.log(phone)

  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/setnewpassword`, {
      phone,
      newPassword: password,
    });

    if (response.data.success) {
      setSuccessMessage("Password changed successfully! Redirecting...");
      setTimeout(() => {
        history.push("/home");
      }, 2000);
    } else {
      setErrorMessage(response.data.message || "Failed to update password.");
    }
  } catch (error) {
    setErrorMessage("An error occurred. Please try again.");
  }
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
