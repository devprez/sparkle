import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";
import React from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { EntranceStepTemplate } from "types/EntranceStep";
import { venueEntranceUrl, venueInsideUrl } from "utils/url";
import { currentVenueSelectorData } from "utils/selectors";
import { useVenueId } from "hooks/useVenueId";
import Login from "pages/Account/Login";

export const VenueEntrancePage: React.FunctionComponent<{}> = () => {
  const { user, profile } = useUser();
  const history = useHistory();
  const { step } = useParams();
  const venueId = useVenueId();
  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelectorData);

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (
    !(parseInt(step) > 0) ||
    !venue.entrance ||
    !venue.entrance.length ||
    venue.entrance.length < parseInt(step)
  ) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  if (!user || !profile) {
    return <Login />;
  }

  const proceed = () => {
    history.push(venueEntranceUrl(venueId, parseInt(step) + 1));
  };

  const stepConfig = venue.entrance[parseInt(step) - 1];
  switch (stepConfig.template) {
    case EntranceStepTemplate.WelcomeVideo:
      return (
        <WelcomeVideo
          venueName={venue.name}
          config={stepConfig}
          proceed={proceed}
        />
      );
  }
};
