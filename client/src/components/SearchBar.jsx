import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import DeletePrimary from "../assets/delete-tertiary.svg";
import SearchTertiary from "../assets/search-tertiary.svg";

SearchBar.propTypes = {
  items: PropTypes.array.isRequired,
  filteredItems: PropTypes.array.isRequired,
  setFilteredItems: PropTypes.func.isRequired,
  actionOnSelect: PropTypes.func.isRequired,
  isSearchable: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  attr: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default function SearchBar({
  items,
  filteredItems,
  setFilteredItems,
  actionOnSelect,
  isSearchable,
  placeholder,
  name,
  value = "",
  setValue,
  attr,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasJustOpened, setHasJustOpened] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownInputRef = useRef(null);

  function handleChangeValue(e, inputType) {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setFilteredItems(items);
    }

    if (inputType === "typed") {
      setIsOpen(true);
      setHasJustOpened(false);
      setValue(e);
      return;
    }

    actionOnSelect(inputValue);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = dropdownRef.current;

      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${attr} flex items-center q-text-sm`}>
      <div className="relative flex w-full items-center justify-end" ref={dropdownRef}>
        {value && (
          <img
            className="cursor absolute w-11 p-4 hover:brightness-200"
            src={DeletePrimary}
            onClick={() => {
              setValue({ target: { value: "" } });
              setHasJustOpened(false);
            }}
          />
        )}
        {isOpen && !disabled && filteredItems.length > 0 && (
          <div className="absolute top-full z-10 mt-1 flex h-fit max-h-[30vh] w-full bg-tertiary/70 p-2 pr-0 backdrop-blur-md q-rounded-xl">
            <div className="scrollable-div flex w-full flex-col overflow-y-scroll">
              {filteredItems
                .map((item) =>
                  value === "" || hasJustOpened
                    ? item
                    : item.fullName.toLowerCase().includes(value?.toLowerCase())
                      ? item
                      : null,
                )
                .filter((item) => item !== null)
                .map((item, index) => (
                  <button
                    className="w-full p-2 px-4 text-left text-primary q-rounded-xl hover:bg-tertiary/30"
                    onClick={() =>
                      handleChangeValue(
                        { target: { name, value: { ...item } } },
                        "chosen",
                      )
                    }
                    key={index}
                  >
                    {item.fullName}
                  </button>
                ))}
            </div>
          </div>
        )}
        <input
          className={`${!isSearchable ? "cursor-default" : "focus:bg-primary"} w-full bg-secondary p-3 px-5 placeholder-slate-600/60 q-text-sm q-rounded-xl`}
          placeholder={placeholder}
          autoComplete="off"
          type={"text"}
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
        <div className="pl-5 pr-3">
          <img className="w-5" src={SearchTertiary} />
        </div>
    </div>
  );
}
