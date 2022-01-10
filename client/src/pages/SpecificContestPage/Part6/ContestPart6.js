import React, { useEffect } from "react";
import { Radio, Typography } from "antd";
import { usePatch } from "../../../hooks/usePatch";

const ContestPart6 = ({ contest, onChange }) => {
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
      {contest?.resource.paragraphs.map((paragraph, i) => (
        <div key={i} style={{ margin: 30 }}>
          <h5 style={{ marginLeft: -20 }}> Paragraph {i + 1}:</h5>
          <p style={{ lineHeight: 2 }}>{paragraph?.paragraph}</p>
          {paragraph?.questions.map((qs, i) => (
            <div key={i}>
              <h6 style={{ lineHeight: 2 }}>
                Question {i + 1} : {qs.question}
              </h6>
              <Radio.Group
                onChange={(e) => changeList(i, e.target.value)}
                style={{ marginBottom: 20 }}
              >
                {qs?.options.map((item, i) => (
                  <Radio
                    key={i}
                    value={i}
                    style={{ marginRight: 50, fontSize: 16 }}
                  >
                    {item}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContestPart6;
