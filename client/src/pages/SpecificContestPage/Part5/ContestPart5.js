import React, { useEffect } from "react";
import { Radio, Typography } from "antd";

const ContestPart5 = ({ contest, onChange }) => {
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    onChange?.(value);
  }, [value]);

  const handleRadioChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      {contest.listQS.map((qs, i) => (
        <div key={i} style={{ margin: 30 }}>
          <h5 style={{ lineHeight: 2 }}>
            Question {i + 1} : {qs.question}
          </h5>
          <Radio.Group onChange={handleRadioChange}>
            {qs.answer.map((item, i) => (
              <Radio
                key={i}
                value={item}
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
