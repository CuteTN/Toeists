// libs
import React from "react";
import { Radio, Typography } from "antd";
//others
import "../style.css";

const { Text } = Typography;
const CorrectAnswerRadio = ({ amount, onChange }) => {
  const listAnswer = ["A", "B", "C", "D"];
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    onChange?.(value);
  }, [value]);

  const handleRadioChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <div className="title-question">Correct Answer</div>
      <Radio.Group onChange={handleRadioChange} value={value}>
        {listAnswer.slice(0, amount).map((item, i) => (
          <Radio
            key={item}
            value={item}
            style={{ marginRight: 50, fontWeight: 500, fontSize: 18 }}
          >
            {item}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};
export default CorrectAnswerRadio;
