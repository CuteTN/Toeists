import React, { useEffect } from "react";
import { Radio } from "antd";
import { usePatch } from "../../../hooks/usePatch";

const ContestPart5 = ({ contest, onChange }) => {
  const [value, setValue, patchValue] = usePatch([]);
  const listAnswer = ["A", "B", "C", "D"];
  React.useEffect(() => {
    onChange?.(value);
  }, [value]);

  const changeList = (i, value) => {
    patchValue([i], listAnswer[value]);
  };

  return (
    <div>
      {contest?.resource.questions.map((qs, i) => (
        <div key={i} style={{ margin: 30 }}>
          <h5 style={{ lineHeight: 2 }}>
            Question {i + 1} : {qs.question}
          </h5>
          <Radio.Group onChange={(e) => changeList(qs?.id, e.target.value)}>
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
  );
};

export default ContestPart5;
