import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as WidescreenLogo } from "./svg/widescreen.svg";
import { ReactComponent as SettingsLogo } from "./svg/settings.svg";
import { ReactComponent as Play } from "./svg/play.svg";
import { ReactComponent as Pause } from "./svg/pause.svg";
import { ReactComponent as Next } from "./svg/next.svg";
import { ReactComponent as VolumeOn } from "./svg/volume_on.svg";
import { ReactComponent as Mute } from "./svg/mute.svg";
import { faPlay, faForwardStep, faVolumeHigh, faPause, faVolumeMute, faRotateRight, faExpand } from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.css";
export default function Player(props) {
  const videoRef = useRef();
  const [isVideoPlaying, setVideoPlaying] = useState(true);
  const playButtonRef = useRef();
  const [passedDuration, setPassedDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [bufferedDuration, setBufferedDuration] = useState(0);
  const [soundStatus, setSoundStatus] = useState(false);
  const [isVideoOver, setIsVideoOver] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  function formatTime(seconds) {
    return [parseInt(seconds / 60 % 60), parseInt(seconds % 60)].join(":").replace(/\b(\d)\b/g, "0$1");
  }

  //play pause functionality
  const playbackToggle = () => {
    //play and pause functionality
    setVideoPlaying(isVideoPlaying => !isVideoPlaying);
  };
  const fullscreenchanged = event => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  };

  //manage fullscreen listener
  useEffect(() => {
    document.onfullscreenchange = fullscreenchanged;
  }, []);

  //replay functionality
  const replay = async () => {
    console.log("Video playing");
    setIsVideoOver(false);
    setTimeout(() => {
      videoRef.current.play();
      setVideoPlaying(true);
    }, 500);
  };
  const updatePlaybackDuration = () => {
    setPassedDuration(videoRef.current.currentTime);
  };

  //handle play pause
  useEffect(() => {
    if (isVideoPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  //move time left and write
  const moveBack = () => {
    if (videoRef.current.currentTime > 5) {
      videoRef.current.currentTime = videoRef.current.currentTime - 5;
    } else {
      videoRef.current.currentTime = 0;
    }
  };
  const moveForward = () => {
    if (videoRef.current.currentTime + 5 < videoRef.current.duration) {
      videoRef.current.currentTime = videoRef.current.currentTime + 5;
    } else {
      videoRef.current.currentTime = videoRef.current.duration;
    }
  };
  //update time on play
  const setTotalTime = () => {
    setTotalDuration(videoRef.current.duration);
  };

  //handle buffer length
  const setBufferedLength = () => {
    let bufferTimeRanges = videoRef.current.buffered;
    for (let i = 0; i < bufferTimeRanges.length; i++) {
      if (passedDuration >= bufferTimeRanges.start(i) && passedDuration < bufferTimeRanges.end(i)) {
        setBufferedDuration(bufferTimeRanges.end(i) - passedDuration);
      }
    }
  };

  //setting the buffer state and checking for repeat logo
  useEffect(() => {
    setBufferedLength();
    handleVideoOver();
  }, [passedDuration]);
  const jumpToTime = e => {
    if (isVideoOver) {
      setIsVideoOver(false);
      setVideoPlaying(false);
    }
    let clickpoint = e.clientX - 5;
    let equivalentDuration = clickpoint / 850 * totalDuration;
    videoRef.current.currentTime = equivalentDuration;
  };
  useEffect(() => {
    videoRef.current.muted = !soundStatus;
  }, [soundStatus]);
  const toggleSound = () => {
    setSoundStatus(!soundStatus);
  };
  const handleVideoOver = () => {
    if (passedDuration === totalDuration && passedDuration) {
      setIsVideoOver(true);
    }
  };
  useEffect(() => {
    if (isFullScreen) {
      document.documentElement.requestFullscreen();
      var r = document.querySelector(":root");
      // Set the value of variable --blue to another value (in this case "lightblue")
      r.style.setProperty("--video-height", window.screen.height);
      r.style.setProperty("--video-width", window.screen.width);
    } else if (totalDuration) {
      var r = document.querySelector(":root");
      // Set the value of variable --blue to another value (in this case "lightblue")
      r.style.setProperty("--video-height", "510px");
      r.style.setProperty("--video-width", "860px");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);
  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const handleWideScreen = () => {};
  return /*#__PURE__*/React.createElement("div", {
    className: classes.player
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["video-wrapper"]
  }, /*#__PURE__*/React.createElement("video", {
    src: props.url,
    ref: videoRef,
    onDurationChange: setTotalTime,
    onTimeUpdate: updatePlaybackDuration,
    autoPlay: true,
    muted: true
  })), /*#__PURE__*/React.createElement("div", {
    className: classes["video-overlay"]
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["video-cover"]
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["left"],
    onDoubleClick: moveBack
  }), /*#__PURE__*/React.createElement("div", {
    className: classes["play"],
    onClick: playbackToggle,
    onDurationChange: updatePlaybackDuration,
    ref: playButtonRef
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["central-icon"]
  }, isVideoOver && /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faRotateRight,
    onClick: replay
  }))), /*#__PURE__*/React.createElement("div", {
    className: classes["right"],
    onDoubleClick: moveForward
  })), /*#__PURE__*/React.createElement("div", {
    className: classes["control-bar"]
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["progress-bar-wrapper"],
    onClick: jumpToTime
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["progress-bar"]
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.currentTime,
    style: {
      width: 850 * passedDuration / totalDuration ? 850 * passedDuration / totalDuration : 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.bufferedTime,
    style: {
      width: 850 * bufferedDuration / totalDuration ? 850 * bufferedDuration / totalDuration : 0
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: classes["icon-bar"]
  }, /*#__PURE__*/React.createElement("div", {
    className: classes["left-icons"]
  }, /*#__PURE__*/React.createElement("span", null, !isVideoOver && (isVideoPlaying && !isVideoOver ? /*#__PURE__*/React.createElement(Pause, {
    onClick: playbackToggle
  }) : /*#__PURE__*/React.createElement(Play, {
    onClick: playbackToggle
  })), isVideoOver ? /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faRotateRight,
    onClick: replay
  }) : null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Next, null)), /*#__PURE__*/React.createElement("span", {
    onClick: toggleSound,
    style: {
      padding: "6px"
    }
  }, soundStatus ? /*#__PURE__*/React.createElement(VolumeOn, null) : /*#__PURE__*/React.createElement(Mute, null)), /*#__PURE__*/React.createElement("span", {
    className: classes.time
  }, formatTime(Math.floor(passedDuration)), "/", formatTime(Math.floor(totalDuration)))), /*#__PURE__*/React.createElement("div", {
    className: classes["right-icons"]
  }, /*#__PURE__*/React.createElement("span", {
    className: classes["settings"]
  }, /*#__PURE__*/React.createElement(SettingsLogo, null)), /*#__PURE__*/React.createElement("span", {
    className: classes["widescreen"],
    onClick: handleWideScreen
  }, /*#__PURE__*/React.createElement(WidescreenLogo, null)), /*#__PURE__*/React.createElement("span", {
    className: classes["fullscreen"],
    onClick: handleFullScreen
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faExpand
  })))))));
}