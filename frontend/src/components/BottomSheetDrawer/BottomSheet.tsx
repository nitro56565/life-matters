import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import "./BottomSheet.css";

interface BottomSheetProps {
  isOpen: boolean;
  close: (event: CustomEvent<OverlayEventDetail<any>>) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, close }) => {
  const amountOfDummyItems = 10;
  const [search, setSearch] = useState<string>("");

  const [items] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      vehicleNumber: `MH-23h-48${i + 1}`,
      tripDetails: `${5 + i} mins away * Drop ${9 + i}:20 pm`,
      driverName: `Driver ${i + 1}`,
    }))
  );

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
          {/* Content */}
          {items.map((item, index) => (
            <div className="bottom-sheet-content" key={index}>
              <div className="bottom-sheet-header">
                <div className="header-icon-container">
                  <div className="header-icon">
                    <img
                      src="image source"
                      className="header-icon-img"
                      alt="Driver Image"
                    />
                  </div>
                  <div className="header-details">
                    <div className="vehicle-number">{item.vehicleNumber}</div>
                    <div className="trip-details">{item.tripDetails}</div>
                    <div className="driver-name">{item.driverName}</div>
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
          ))}
        </IonGrid>
      </IonModal>
    </>
  );
};
