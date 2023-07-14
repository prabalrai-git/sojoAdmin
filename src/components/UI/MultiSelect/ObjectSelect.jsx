import React, { useState } from "react";
import "./index.scss";

const MultiSelect = ({ options, selectedOptions, onSelectionChange }) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (option) => {
    const index = selectedOptions.indexOf(option.name);
    let newSelectedOptions = [...selectedOptions];

    if (index > -1) {
      newSelectedOptions.splice(index, 1);
    } else {
      newSelectedOptions.push(option.name);
    }

    onSelectionChange(newSelectedOptions);
  };

  return (
    <div className="multiselect">
      <div className="multiselect__selected" onClick={toggleOptions}>
        <div className="multiselect__selected-label">
          {selectedOptions.length === 0
            ? "Select options"
            : selectedOptions.join(", ")}
        </div>
        <div className="multiselect__selected-icon">
          {showOptions ? "▲" : "▼"}
        </div>
      </div>
      {showOptions && (
        <div className="multiselect__options">
          {options.map((option) => (
            <div
              key={option._id}
              className={`multiselect__option ${
                selectedOptions.indexOf(option.name) > -1 &&
                "multiselect__option--selected"
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {/* <input
                checked={`multiselect__option ${
                  selectedOptions.indexOf(option) > -1 ? true : false
                }`}
                type="checkbox"
              />{" "} */}
              <label htmlFor="">{option.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
