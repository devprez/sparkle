import React, { useCallback } from "react";

// Components
import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";

// Pages
import Details from "pages/Admin/Details";

// Hooks
import { useHistory } from "react-router-dom";
import { useUser } from "hooks/useUser";

// Typings
import { VenueWizardCreateProps } from "./VenueWizardCreate.types";

const VenueWizardCreate: React.FC<VenueWizardCreateProps> = ({
  state,
  dispatch,
}) => {
  const history = useHistory();
  const { user } = useUser();

  const previous = useCallback(
    () => history.push(`${history.location.pathname}`),
    [history]
  );

  if (!user) {
    return (
      <WithNavigationBar fullscreen>
        <AuthenticationModal show={true} onHide={() => {}} showAuth="login" />
      </WithNavigationBar>
    );
  }

  return (
    <WithNavigationBar fullscreen>
      <Details previous={previous} state={state} dispatch={dispatch} />
    </WithNavigationBar>
  );
};

export default VenueWizardCreate;
