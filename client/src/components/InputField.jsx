import PropTypes from "prop-types";

InputField.propTypes = {
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  setValue: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  attr: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.number,
  dateRange: PropTypes.array,
};

export default function InputField({
  labelText,
  placeholder,
  name,
  value = "",
  setValue,
  type,
  attr,
  disabled,
  id,
  dateRange,
}) {
  function handleNumericChange(e) {
    const newValue = e;
    newValue.target.value = e.target.value.replace(/[^0-9]/g, "");
    setValue(newValue);
  }

  return (
    <div className={`${attr} flex h-fit flex-col q-text-sm`}>
      {labelText && <p className="p-1 text-left">{labelText}</p>}
      <input
        className={`${attr} bg-secondary p-3 px-5 placeholder-slate-600/60 q-rounded-xl focus:bg-white`}
        placeholder={placeholder}
        type={type !== "number" ? type : "text"}
        name={name}
        value={value}
        onChange={type !== "number" ? setValue : handleNumericChange}
        disabled={disabled}
        id={id}
        {...(dateRange && { min: dateRange[0], max: dateRange[1] })}
      />
    </div>
  );
}
