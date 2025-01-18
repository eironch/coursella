import PropTypes from "prop-types";
import InputField from "../../components/InputField";
import Combobox from "../../components/Combobox";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

import LoadingAnimation from "../../assets/loading.json";
import HidePasswordTertiary from "../../assets/hide-password-tertiary.svg";
import HidePasswordPrimary from "../../assets/hide-password-primary.svg";
import ShowPasswordTertiary from "../../assets/show-password-tertiary.svg";
import ShowPasswordPrimary from "../../assets/show-password-primary.svg";
import { useAppContext } from "../../context/AppContext";

AccountManagement.propTypes = {
  setIsResultModalOpen: PropTypes.func.isRequired,
  setResultModalSettings: PropTypes.func.isRequired,
};

export default function AccountManagement({
  setIsResultModalOpen,
  setResultModalSettings,
}) {
  const { api, log, error } = useAppContext();

  const [accountData, setAccountData] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCredentialsValid, setIsCredentialsValid] = useState(true);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function testEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    setAccountData((prev) => ({
      ...prev,
      [name]: name !== "profileImage" ? value : files[0],
    }));
  }

  async function registerAccount() {
    if (!testEmail()) {
      setIsCredentialsValid(false);

      return;
    } else if (password !== confirmPassword) {
      setIsCredentialsValid(false);

      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();

      data.append("profileImage", accountData.profileImage);
      data.append("data", JSON.stringify({ email, password, ...accountData }));

      const res = await api.post("/create/post-account", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      log(res);

      setIsResultModalOpen(true);
      setResultModalSettings({
        handleClose: () => setIsResultModalOpen(false),
        title: "Account Created",
        message: <p>You have successfully created the account.</p>,
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAccountData({});
      setIsLoading(false);
    } catch (err) {
      error(err);

      setIsCredentialsValid(false);
      setIsLoading(false);
    }
  }

  return (
    <div className="q-p-20 flex flex-col items-center justify-center gap-5">
      <h2 className="mb-5 flex font-bold q-text-xl">User Account</h2>
      <div className="aspect-w-1 aspect-h-1 relative h-40 w-40 rounded-full bg-secondary p-2">
        {accountData.profileImage && (
          <div className="rounded-full">
            <img
              className="absolute inset-0 h-full w-full rounded-full object-cover"
              src={URL.createObjectURL(accountData.profileImage)}
              alt=""
            />
          </div>
        )}
        <label
          className={`${
            accountData.profileImage && "opacity-0"
          } flex h-full w-full cursor-pointer items-center justify-center rounded-full border-4 border-dashed border-tertiary q-text-sm`}
          htmlFor="profileImage"
        >
          Upload Image
        </label>
        <input
          className="hidden"
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          disabled={false}
          onChange={handleChange}
        />
      </div>
      <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
      <h2 className="mb-5 flex font-bold q-text-xl">Account Information</h2>
      <Combobox
        items={[
          "Instructor",
          "Coordinator",
        ]}
        isSearchable={true}
        labelText="Account Role"
        placeholder="Select account role"
        name="role"
        value={accountData.role}
        setValue={handleChange}
        type="text"
        attr="w-full"
        disabled={false}
      />
      <InputField
        labelText="Department"
        placeholder="Enter account department (optional)"
        name="department"
        value={accountData.department}
        setValue={handleChange}
        type="text"
        attr="w-full"
        disabled={false}
      />
      <div className="flex w-full q-gap-5">
        <InputField
          labelText="Given Name"
          placeholder="Enter account given name"
          name="givenName"
          value={accountData.givenName}
          setValue={handleChange}
          type="text"
          attr="w-full"
          disabled={false}
        />
        <InputField
          labelText="Middle Name"
          placeholder="Enter account middle name"
          name="middleName"
          value={accountData.middleName}
          setValue={handleChange}
          type="text"
          attr="w-full"
          disabled={false}
        />
      </div>
      <div className="flex w-full q-gap-5">
        <InputField
          labelText="Family Name"
          placeholder="Enter account family name"
          name="familyName"
          value={accountData.familyName}
          setValue={handleChange}
          type="text"
          attr="w-full"
          disabled={false}
        />
        <InputField
          labelText="Suffix"
          placeholder="Enter account suffix (optional)"
          name="suffix"
          value={accountData.suffix}
          setValue={handleChange}
          type="text"
          attr="w-full"
          disabled={false}
        />
      </div>
      <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
      <h2 className="mb-5 flex font-bold q-text-xl">Login Credentials</h2>
      <div className="flex w-full flex-col">
        <label className="mb-1 ml-1 font-bold text-tertiary q-text-sm">
          Email Address
        </label>
        <input
          className={`w-full p-3 px-5 text-tertiary q-h-12 q-text-sm q-rounded-xl focus:bg-primary ${
            isCredentialsValid
              ? "bg-secondary"
              : "border-2 border-red-600 bg-red-200 px-3.5"
          }`}
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onClick={() => setIsCredentialsValid(true)}
        />
      </div>
      <div className="flex w-full flex-col">
        <label className="mb-1 ml-1 font-bold text-tertiary q-text-sm">
          Password
        </label>
        <div className="flex gap-1">
          <input
            className={`w-full rounded-r p-3 px-5 text-tertiary q-h-12 q-text-sm q-rounded-l-xl focus:bg-primary ${
              isCredentialsValid
                ? "bg-secondary"
                : "border-2 border-red-600 bg-red-200 px-3.5"
            }`}
            type={isPasswordShown ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClick={() => setIsCredentialsValid(true)}
          />
          <button
            className="group rounded-l bg-secondary px-5 pt-0.5 q-rounded-r-xl hover:bg-highlight"
            onClick={() => setIsPasswordShown(!isPasswordShown)}
          >
            <img
              className="q-w-5 group-hover:hidden"
              src={
                isPasswordShown ? ShowPasswordTertiary : HidePasswordTertiary
              }
            />
            <img
              className="hidden q-w-5 group-hover:block"
              src={isPasswordShown ? ShowPasswordPrimary : HidePasswordPrimary}
            />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <label className="mb-1 ml-1 font-bold text-tertiary q-text-sm">
          Confirm Password
        </label>
        <div className="flex gap-1">
          <input
            className={`w-full rounded-r p-3 px-5 text-tertiary q-h-12 q-text-sm q-rounded-l-xl focus:bg-primary ${
              isCredentialsValid
                ? "bg-secondary"
                : "border-2 border-red-600 bg-red-200 px-3.5"
            }`}
            type={isPasswordShown ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onClick={() => setIsCredentialsValid(true)}
          />
          <button
            className="group rounded-l bg-secondary px-5 pt-0.5 q-rounded-r-xl hover:bg-highlight"
            onClick={() => setIsPasswordShown(!isPasswordShown)}
          >
            <img
              className="q-w-5 group-hover:hidden"
              src={
                isPasswordShown ? ShowPasswordTertiary : HidePasswordTertiary
              }
            />
            <img
              className="hidden q-w-5 group-hover:block"
              src={isPasswordShown ? ShowPasswordPrimary : HidePasswordPrimary}
            />
          </button>
        </div>
      </div>
      <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
      <div className="flex w-full justify-end">
        <button
          className="flex h-10 items-center justify-center gap-5 bg-highlight px-5 text-primary q-text-sm q-rounded-xl hover:bg-highlight-light disabled:bg-secondary disabled:text-tertiary disabled:opacity-50"
          onClick={() => registerAccount()}
          disabled={isLoading}
        >
          Create Account
          {isLoading && <Loading />}
        </button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <Lottie
      animationData={LoadingAnimation}
      style={{ width: 20, height: 20 }}
    />
  );
}
