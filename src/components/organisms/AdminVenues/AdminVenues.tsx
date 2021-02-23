import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import classNames from "classnames";

import { isPartyMapVenue, Venue_v2 } from "types/venues";

import { WithId } from "utils/id";

import { AdminVenueCard } from "components/molecules/AdminVenueCard";

import "./AdminVenues.scss";

export interface AdminVenuesProps {
  venues: Venue_v2[];
  onClickCreateSpace: () => void;
  onClickVenue: (venue: WithId<Venue_v2>) => void;
}

export const AdminVenues: React.FC<AdminVenuesProps> = ({ venues, onClickCreateSpace, onClickVenue }) => {
  const renderedPartyVenues = useMemo(
    () =>
      venues
        ?.filter(isPartyMapVenue)
        .map((venue) => <AdminVenueCard key={venue.id} venue={venue} onClickVenue={onClickVenue} />),
    [venues, onClickVenue]
  );

  const hasVenues = renderedPartyVenues.length > 0;

  return (
    <div className="admin-venue">
      <div className="admin-venue__header">
        <div className="admin-venue__title">Admin Dashboard</div>
        <Button onClick={onClickCreateSpace}>Create a new space</Button>
      </div>
      <div
        className={classNames("admin-venue__cards", {
          "admin-venue__cards--empty": !hasVenues,
        })}
      >
        {!hasVenues && (
          <>
            <div className="admin-venue__title">Welcome!</div>
            <div className="admin-venue__title">
              Create your first Sparkle space
            </div>
          </>
        )}
        {hasVenues && renderedPartyVenues}
      </div>
    </div>
  );
};