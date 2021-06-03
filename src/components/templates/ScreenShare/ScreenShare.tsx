import React, { useMemo, useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import useAgoraScreenShare from "./agoraHooks/useAgoraScreenShare";
import Player from "./components/Player/Player";
import useAgoraCamera from "./agoraHooks/useAgoraCamera";
import useAgoraRemotes from "./agoraHooks/useAgoraRemotes";
import { GenericVenue } from "types/venues";
import { WithId } from "utils/id";
import { isDefined } from "utils/types";
import { useUser } from "hooks/useUser";
import Audience from "./components/Audience/Audience";
import Button from "./components/Button/Button";
import LeaveStageModal from "./components/LeaveStageModal/LeaveStageModal";
import "./ScreenShare.scss";

const remotesClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

const screenClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

const cameraClient: IAgoraRTCClient = AgoraRTC.createClient({
  codec: "h264",
  mode: "rtc",
});

const AGORA_CHANNEL = {
  appId: "bc9f5ed85b4f4218bff32c78a3ff88eb",
  channel: "videotest",
  token: "",
};

export interface ScreenShareProps {
  venue: WithId<GenericVenue>;
}

export const ScreenShare: React.FC<ScreenShareProps> = ({ venue }) => {
  const { profile } = useUser();
  const [openLeaveStageModal, setOpenLeaveStageModal] = useState(false);
  const remoteUsers = useAgoraRemotes(remotesClient, AGORA_CHANNEL);

  const isAttendee = useMemo(() => isDefined(profile?.data?.[venue.id]), [
    profile?.data,
    venue.id,
  ]);

  const {
    localCameraTrack,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
    closeTracks,
    onJoin: cameraClientJoin,
  } = useAgoraCamera(cameraClient, AGORA_CHANNEL);

  const { localScreenTrack, shareScreen, stopShare } = useAgoraScreenShare(
    screenClient,
    AGORA_CHANNEL
  );

  return (
    <div className="ScreenShare">
      <div className="ScreenShare__scene">
        <div className="ScreenShare__scene--players">
          {localCameraTrack && (
            <div>
              <Player
                videoTrack={localCameraTrack}
                showButtons
                isCamOn={isCameraOn}
                isMicOn={isMicrophoneOn}
                isSharing={!!localScreenTrack}
                toggleCam={toggleCamera}
                toggleMic={toggleMicrophone}
              />
            </div>
          )}
          {localScreenTrack && (
            <div>
              <Player videoTrack={localScreenTrack} />
            </div>
          )}
          {remoteUsers.map(
            (user) =>
              user.uid !== screenClient.uid &&
              user.uid !== cameraClient.uid && (
                <div key={user.uid}>
                  {user.hasVideo && (
                    <Player
                      videoTrack={user.videoTrack}
                      audioTrack={user.audioTrack}
                    />
                  )}
                </div>
              )
          )}
        </div>

        <div className="ScreenShare__scene--buttons">
          {cameraClient.connectionState === "CONNECTED" ? (
            <>
              <Button
                onClick={() => {
                  localScreenTrack ? stopShare() : shareScreen();
                }}
                rightLabel={localScreenTrack && "You are screensharing"}
                variant="secondary"
                small
              >
                {localScreenTrack ? "Stop Sharing" : "Share Screen"}
              </Button>

              <Button
                onClick={() => {
                  setOpenLeaveStageModal(true);
                }}
                leftLabel="You are on stage"
                variant="secondary"
                small
              >
                Leave Stage
              </Button>
            </>
          ) : (
            <div className="ScreenShare__scene--buttons--join-stage">
              {isAttendee && (
                <Button
                  onClick={() => {
                    cameraClientJoin();
                    screenClient.join(
                      AGORA_CHANNEL.appId,
                      AGORA_CHANNEL.channel,
                      AGORA_CHANNEL.token
                    );
                  }}
                  variant="secondary"
                  small
                >
                  Join Stage
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Audience venue={venue} />
      <LeaveStageModal
        show={openLeaveStageModal}
        onHide={() => {
          setOpenLeaveStageModal(false);
        }}
        onSubmit={() => {
          // host -> audience
          closeTracks();
          stopShare();
          cameraClient.leave();
          screenClient.leave();
        }}
      />
    </div>
  );
};
