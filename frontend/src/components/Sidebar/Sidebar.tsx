import React from "react";
import {
  IonContent,
  IonIcon,
  IonList,
  IonMenu,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import { personCircle, logOut, homeOutline } from "ionicons/icons";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const UserName = localStorage.getItem("name");
  const router = useIonRouter();

  const logout = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("name");
      localStorage.removeItem("clusterZone");
      router.push("/ambulance-signin", "root", "replace");
    }
  };

  return (
    <IonMenu side="start" contentId="main-content" className="custom-sidebar">
      <IonContent className="sidebar-content">
        {/* Upper Container */}
        <div className="profile-section">
          <IonIcon icon={personCircle} className="profile-icon" />
          <h2 className="welcome-message">Welcome, {UserName}</h2>
        </div>
        <IonList>{/* Add more menu items as needed */}</IonList>
        <div className="logout-section">
          <IonButton onClick={logout} expand="block" color="danger">
            <IonIcon icon={logOut} slot="start" />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Sidebar;
