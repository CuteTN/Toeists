import React, { useEffect } from "react";
import { Radio, Typography } from "antd";

const ContestPart2 = ({ contest, onChange }) => {
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    onChange?.(value);
  }, [value]);

  const handleRadioChange = (e) => {
    setValue(e.target.value);
  };
  console.log("abc", contest?.resource.paragraphs);

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
                onChange={handleRadioChange}
                style={{ marginBottom: 20 }}
              >
                {qs?.options.map((item, i) => (
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
      ))}
    </div>
  );
};

export default ContestPart2;
