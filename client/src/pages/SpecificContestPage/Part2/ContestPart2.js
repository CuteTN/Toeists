//libs
import React, { useEffect } from "react";
import { Radio, Typography, Image } from "antd";
import AudioPlayer from "react-h5-audio-player";
//others
import "react-h5-audio-player/lib/styles.css";

const ContestPart2 = ({ contest, onChange }) => {
  const listAnswer = ["A", "B", "C"];
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    onChange?.(value);
  }, [value]);

  const handleRadioChange = (e) => {
    setValue(e.target.value);
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
            onChange={handleRadioChange}
            style={{ marginBottom: 20 }}
          >
            {listAnswer.map((item, i) => (
              <Radio
                key={i}
                value={item}
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
