import React, { memo, useEffect, useRef } from 'react';

type VideoViewerProps = {
  video: MediaStream | null
}

const EmptyVideoMsg = memo(() => (
  <div>please select the window</div>
));

function VideoViewer(props: VideoViewerProps) {
  const { video } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const $video = videoRef.current;

    if ($video) {
      $video.srcObject = video;

      $video.onloadedmetadata = () => $video.play();
      $video.onabort = (e) => console.log(e);
    }
  }, [video]);

  return (
    video
      ? <video ref={videoRef} />
      : <EmptyVideoMsg />
  );
}

export default memo(VideoViewer);
