import React, { useState, useEffect } from "react";

const PWAOfflineStatus: React.FC = () => {
  const [isOnline, setOnlineStatus] = useState(true);
  useEffect(() => {
    const setFromEvent = function (event: any) {
      if (event.type === "online") {
        setOnlineStatus(true);
      } else if (event.type === "offline") {
        setOnlineStatus(false);
      }
    };

    window.addEventListener("online", setFromEvent);
    window.addEventListener("offline", setFromEvent);

    return () => {
      window.removeEventListener("online", setFromEvent);
      window.removeEventListener("offline", setFromEvent);
    };
  });

  return !isOnline ? (
    <div className=" offline-message">
      {" "}
      <div>
        <i className="pulsate-fwd fad fa-wifi-slash"></i>
      </div>
      <div>
        <p>
          <b>Uh-oh! Looks like your device lost connection.</b>
        </p>
        <p>Connect to the network to continue browsing Flangoo.</p>
      </div>
    </div>
  ) : null;
};

export default PWAOfflineStatus;
