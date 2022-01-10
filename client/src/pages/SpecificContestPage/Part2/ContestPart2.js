//libs
import React, { useEffect } from "react";
import { Radio, Typography, Image } from "antd";
import AudioPlayer from "react-h5-audio-player";
import { usePatch } from "../../../hooks/usePatch";
//others
import "react-h5-audio-player/lib/styles.css";

const ContestPart2 = ({ contest, onChange }) => {
  const [value, setValue, patchValue] = usePatch([]);
  const listAnswer = ["A", "B", "C"];
  React.useEffect(() => {
    onChange?.(Object.values(value));
  }, [value]);

  const changeList = (i, value) => {
    patchValue([i], listAnswer[value]);
  };

  return (
    <div>
      {contest?.resource.questions.map((qs, i) => (
        <div key={i} style={{ margin: 30, textAlign: "center" }}>
          <h5 style={{ lineHeight: 2, textAlign: "start" }}>
            Question {i + 1} :
          </h5>
          <div style={{ margin: 30 }}>
            <AudioPlayer
              src={qs?.audio}
              showJumpControls={false}
              autoPlay={false}
              autoPlayAfterSrcChange={false}
            />
          </div>
          <h6 style={{ lineHeight: 2, textAlign: "start", marginLeft: 30 }}>
            Choose Answer:
          </h6>
          <Radio.Group
            onChange={(e) => changeList(i, e.target.value)}
            style={{ marginBottom: 20 }}
          >
            {listAnswer.map((item, i) => (
              <Radio
                key={i}
                value={i}
                style={{ marginRight: 70, fontSize: 16 }}
              >
                {item}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      ))}
    </div>
  );
};

export default ContestPart2;
