import React, { useCallback } from "react";
import { useHistory } from "react-router";

import { setVideoChatState } from "api/videoRoom";

import { useConnectVideoRooms } from "hooks/useConnectVideoRooms";
import { useWorldUserById } from "hooks/users";

import { hasElements } from "utils/types";

import { VideoChatRequestState } from "types/VideoRoom";

import { ConfirmationModal } from "components/atoms/ConfirmationModal/ConfirmationModal";

export const VideoChatModal: React.FC = () => {
  const videoRoomRequests = useConnectVideoRooms();
  const history = useHistory();

  const hasVideoRoomRequests = hasElements(videoRoomRequests);

  const currentVideoRoomRequest = hasVideoRoomRequests
    ? videoRoomRequests[0]
    : undefined;

  const host = useWorldUserById(currentVideoRoomRequest?.hostUserId);

  const acceptVideoRoomRequest = useCallback(() => {
    if (!currentVideoRoomRequest) return;

    setVideoChatState(
      currentVideoRoomRequest.id,
      VideoChatRequestState.Accepted
    );
    history.push(`/pr/${currentVideoRoomRequest.id}`);
  }, [currentVideoRoomRequest, history]);

  const declineVideoRoomRequest = useCallback(() => {
    if (!currentVideoRoomRequest) return;

    setVideoChatState(
      currentVideoRoomRequest.id,
      VideoChatRequestState.Declined
    );
  }, [currentVideoRoomRequest]);

  console.log("VideoChatModal:", videoRoomRequests);

  if (!hasVideoRoomRequests) {
    return null;
  }

  return (
    <ConfirmationModal
      message={`${host?.partyName} invites you to video chat.`}
      onConfirm={acceptVideoRoomRequest}
      onCancel={declineVideoRoomRequest}
    />
  );
};
