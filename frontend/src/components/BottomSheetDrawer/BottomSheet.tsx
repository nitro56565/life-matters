import React from "react";
import { IonCard, IonCardContent, IonGrid, IonModal, IonRow } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import "./BottomSheet.css";

interface AmbulanceDataType {
  ambulance_number: string;
  driver_name: string;
  driver_number: string;
  traffic_signals: string;
}

interface BottomSheetProps {
  isOpen: boolean;
  close: (event: CustomEvent<OverlayEventDetail<any>>) => void;
  ambulanceData: AmbulanceDataType[];
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, close, ambulanceData }) => {
  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={close}
        breakpoints={[0, 0.2, 0.4, 0.5, 1]}
        initialBreakpoint={0.4}
        backdropBreakpoint={0.7}
        className="bottom-sheet-modal"
      >
        <IonGrid className="bottom-sheet-grid">
          {/* Render each ambulance record from the aggregated data */}
          {ambulanceData.length > 0 ? (
            ambulanceData.map((item, index) => (
              <div className="bottom-sheet-content" key={index}>
                <div className="bottom-sheet-header">
                  <div className="header-icon-container">
                    <div className="header-icon">
                      <img src="image source" className="header-icon-img" alt="Driver Image" />
                    </div>
                    <div className="header-details">
                      <div className="vehicle-number">{item.ambulance_number}</div>
                      <div className="driver-name">{item.driver_name}</div>
                      <div className="driver-number">{item.driver_number}</div>
                    </div>
                  </div>
                  <div className="call-button">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/126/126509.png"
                      alt="Call Icon"
                      className="call-icon"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No ambulance data available.</div>
          )}
        </IonGrid>
      </IonModal>
    </>
  );
};
