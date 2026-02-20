import { UserContext } from "@/context/UserContext";
import { Helmet } from "@vuer-ai/react-helmet-async";
import React, { useContext } from "react";

const PageTitle = ({ title, description }) => {
  const { notificationsNumber } = useContext(UserContext);
  return (
    <div>
      <Helmet>
        <title>
          {title === "Home" ? "" : title + " | "} RealEstate
          {notificationsNumber > 0 ? ` (${notificationsNumber})` : ""}
        </title>
        <meta name="description" content={description} />
      </Helmet>
    </div>
  );
};

export default PageTitle;
