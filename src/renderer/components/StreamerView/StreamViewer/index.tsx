import React, { memo, useEffect, useRef } from 'react';
import classes from './StreamViewer.module.scss';

type VideoViewerProps = {
  stream: MediaStream
}

function StreamViewer(props: VideoViewerProps) {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const $video = videoRef.current;

    if ($video) {
      $video.srcObject = stream;

      $video.onloadedmetadata = () => $video.play();
      $video.onabort = (e) => console.log(e);
    }
  }, [stream]);

  return (
    <div className={classes.videoContainer}>
      <video ref={videoRef} />
    </div>
  );
}

export default memo(StreamViewer);
