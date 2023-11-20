import { useState } from "react";
import { Col, InputNumber, Row, Slider, Space } from "antd";

const IntegerStep = ({ onActiveDaysSelected, activeDaysFilter }) => {
  const [inputValue, setInputValue] = useState(1);
  const onSliderChange = (value) => {
    setInputValue(value);
    onActiveDaysSelected(value); // Pass the value to the onActiveDaysSelected function
  };

  const onInputNumberChange = (value) => {
    setInputValue(value);
    onActiveDaysSelected(value); // Pass the value to the onActiveDaysSelected function
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ fontSize: 14, textAlign: "center" }}>
        Sort By less than Active Days
      </p>
      <div>
        <Row style={{ width: 200 }}>
          <Col span={12}>
            <Slider
              min={1}
              max={100}
              onChange={onSliderChange}
              value={typeof inputValue === "number" ? inputValue : 0}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={1}
              max={100}
              style={{
                margin: "0 16px",
              }}
              value={inputValue}
              onChange={onInputNumberChange}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default IntegerStep;
