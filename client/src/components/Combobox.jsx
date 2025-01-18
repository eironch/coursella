import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import DropdownTertiary from "../assets/arrow-tertiary.svg";

Combobox.propTypes = {
  items: PropTypes.array.isRequired,
  isSearchable: PropTypes.bool.isRequired,
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  attr: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default function Combobox({
  items,
  isSearchable,
  labelText,
  placeholder,
  name,
  value = "",
  setValue,
  type,
  attr,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasJustOpened, setHasJustOpened] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownInputRef = useRef(null);
  const prevComboboxValueRef = useRef(value);
  const comboboxLabels = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Incoming Year 4",
    "Year 3 Standing",
    "Year 4 Standing",
  ];

  function handleChangeValue(e, inputType) {
    const inputValue = e.target.value;

    if (inputValue !== "" && items.find((x) => x === inputValue)) {
      prevComboboxValueRef.current = inputValue;
    }

    if (inputType === "typed") {
      setIsOpen(true);
      setHasJustOpened(false);
    } else {
      setIsOpen(false);
    }

    setValue(e);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = dropdownRef.current;
      const dropdownInput = dropdownInputRef.current;

      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
        
        if (
          dropdownInput &&
          dropdownInput.value !== "" &&
          !items.find((x) => x === dropdownInput.value)
        ) {
          setValue({ target: { name, value: prevComboboxValueRef.current } });
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${attr} flex flex-col q-text-sm`}>
      {labelText && (
        <div className="flex justify-between p-1">
          <p className="">{labelText}</p>
        </div>
      )}
      <div className="relative flex items-center justify-end" ref={dropdownRef}>
        {!disabled && (
          <img
            className="cursor absolute w-11 p-4 hover:brightness-200"
            src={DropdownTertiary}
            onClick={() => {
              setIsOpen(!isOpen);
              setHasJustOpened(true);
            }}
          />
        )}
        {isOpen && !disabled && (
          <div className="absolute top-full z-10 mt-1 flex h-fit max-h-[30vh] w-full bg-tertiary/70 p-2 pr-0 backdrop-blur-md q-rounded-xl">
            <div className="scrollable-div flex w-full flex-col overflow-y-scroll">
              {items
                .map((x) =>
                  value === "" || hasJustOpened
                    ? x
                    : x.toLowerCase().includes(value.toLowerCase())
                      ? x
                      : null,
                )
                .filter((item) => item !== null)
                .map((item, index) =>
                  comboboxLabels.includes(item) ? (
                    <div
                      className="flex gap-3 justify-center w-full cursor-default p-2 px-4 text-left text-secondary q-rounded-xl"
                      key={index}
                    >
                      {item}
                    </div>
                  ) : (
                    <button
                      className="w-full p-2 px-4 text-left text-primary q-rounded-xl hover:bg-tertiary/30"
                      onClick={() =>
                        handleChangeValue(
                          { target: { name, value: item } },
                          "chosen",
                        )
                      }
                      key={index}
                    >
                      {item}
                    </button>
                  ),
                )}
            </div>
          </div>
        )}
        <input
          className={`${!isSearchable ? "cursor-default" : "focus:bg-primary"} w-full bg-secondary p-3 px-5 placeholder-slate-600/60 q-text-sm q-rounded-xl`}
          placeholder={placeholder}
          autoComplete="off"
          type={type}
          name={name}
          value={value}
          onChange={(e) => handleChangeValue(e, "typed")}
          onClick={() => {
            setIsOpen(true);
            setHasJustOpened(true);
          }}
          ref={dropdownInputRef}
          readOnly={!isSearchable}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
