//libs
import React, { useEffect } from "react";
import { Radio } from "antd";
import AudioPlayer from "react-h5-audio-player";
import { usePatch } from "../../../hooks/usePatch";
//others
import "react-h5-audio-player/lib/styles.css";

const ContestPart3 = ({ contest, onChange }) => {
  const [value, setValue, patchValue] = usePatch([]);
  const listAnswer = ["A", "B", "C", "D"];
  React.useEffect(() => {
    onChange?.(Object.values(value));
  }, [value]);

  const changeList = (i, value) => {
    patchValue([i], listAnswer[value]);
  };

  return (
    <div>
      {contest?.resource?.paragraphs.map((paragraph, i) => (
        <div key={i} style={{ margin: 30, textAlign: "center" }}>
          <h5 style={{ lineHeight: 2, textAlign: "start" }}>
            Conversation {i + 1} :
          </h5>
          <div style={{ margin: 30 }}>
            <AudioPlayer
              src={paragraph?.audio}
              showJumpControls={false}
              autoPlay={false}
              autoPlayAfterSrcChange={false}
            />
          </div>
          {paragraph?.questions.map((qs, i) => (
            <div key={i} style={{ textAlign: "start" }}>
              <h6 style={{ lineHeight: 2 }}>
                Question {i + 1} : {qs.question}
              </h6>
              <Radio.Group
                onChange={(e) => changeList(i, e.target.value)}
                style={{ marginBottom: 20 }}
              >
                {qs?.options.map((item, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <Radio value={i} style={{ marginRight: 50, fontSize: 16 }}>
                      {item}
                    </Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContestPart3;
