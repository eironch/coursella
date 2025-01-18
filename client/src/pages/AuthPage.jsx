import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useAppContext } from "../context/AppContext.jsx";

import ResultModal from "../components/ResultModal.jsx";
import InputModal from "../components/InputModal.jsx";

import CoursellaLogo from "../assets/coursella-logo.svg";
import LandingImage from "../assets/landing-image.jpg";
import HidePasswordTertiary from "../assets/hide-password-tertiary.svg";
import HidePasswordPrimary from "../assets/hide-password-primary.svg";
import ShowPasswordTertiary from "../assets/show-password-tertiary.svg";
import ShowPasswordPrimary from "../assets/show-password-primary.svg";
import ArrowRightTertiary from "../assets/arrow-right-tertiary.svg";
import ArrowRightPrimary from "../assets/arrow-right-primary.svg";

AuthPage.propTypes = {};

export default function AuthPage() {
  const { api, log, error } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCredentialsValid, setIsCredentialsValid] = useState(true);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState(
    <>
      Sign in credentials
      <br />
      doesn&apos;t match anyone in
      <br />
      our system.
    </>,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState("");

  function testEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
  }

  async function signIn() {
    if (!testEmail()) {
      setIsCredentialsValid(false);
      setModalMessage(
        <>
          Invalid email address.
          <br />
          Please enter a valid email.
        </>,
      );
      return;
    }

    setModalTitle("Sign In Successful");
    setModalMessage("You have successfully signed in!");
    setModalIcon("Checkmark");

    try {
      const res = await api.post("/auth/sign-in", {
        email,
        password,
      });
      log(res);

      setIsModalOpen(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      error(err);

      setIsCredentialsValid(false);
      setModalMessage(
        <>
          Sign in credentials
          <br />
          doesn&apos;t match anyone in
          <br />
          our system.
        </>,
      );
    }
  }

  return (
    <div className="relative flex flex-row overflow-hidden font-montserrat">
      <AnimatePresence initial={false} mode="wait">
        {isModalOpen && (
          <ResultModal
            handleClose={() => {
              setIsModalOpen(false);
            }}
            title={modalTitle}
            message={<>{modalMessage}</>}
            modalIcon={modalIcon}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 flex h-screen w-full flex-col p-4 q-w-5-12 md:p-0">
        <div className="flex h-full flex-col items-center justify-center rounded-lg bg-primary md:rounded-none">
          <div className="flex w-10/12 items-center justify-center gap-4 q-mb-10">
            <img className="q-h-16" src={CoursellaLogo} />
            <h1 className="text-nowrap font-helvetica-compressed text-highlight q-text-4xl q-leading-8">
              Coursella
            </h1>
          </div>
          <div className="flex w-9/12 flex-col items-center q-gap-5">
            <h1 className="font-bold text-tertiary q-mb-6 q-text-2xl">
              Account Sign-in
            </h1>
            {/* login form */}
            <div className="relative flex w-full flex-col items-center q-gap-5">
              {/* modal */}
              <AnimatePresence initial={false} mode="wait">
                {!isCredentialsValid && <InputModal message={modalMessage} />}
              </AnimatePresence>
              {/* modal */}
              <div className="flex w-full flex-col">
                <label className="mb-1 ml-1 font-bold text-tertiary q-text-sm">
                  Email Address
                </label>
                <input
                  className={`h-10 w-full rounded-xl p-3 px-5 text-tertiary q-text-sm focus:bg-primary ${
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
                    className={`h-10 w-full rounded-l-xl rounded-r p-3 px-5 text-tertiary q-text-sm focus:bg-primary ${
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
                    className="group rounded-l rounded-r-xl bg-secondary px-5 pt-0.5 hover:bg-highlight"
                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                  >
                    <img
                      className="q-w-5 group-hover:hidden"
                      src={
                        isPasswordShown
                          ? ShowPasswordTertiary
                          : HidePasswordTertiary
                      }
                    />
                    <img
                      className="hidden q-w-5 group-hover:block"
                      src={
                        isPasswordShown
                          ? ShowPasswordPrimary
                          : HidePasswordPrimary
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
            {/* login input */}
            {/* sign in button */}
            <button
              className="group mt-7 flex h-10 w-full items-center justify-center rounded-xl bg-highlight q-gap-5 hover:bg-highlight-light disabled:bg-secondary"
              disabled={!(email.length > 0 && password.length > 0)}
              onClick={signIn}
            >
              <p className="font-bold text-primary q-text-sm group-disabled:text-tertiary">
                Sign In
              </p>
              <img className="group-disabled:hidden" src={ArrowRightPrimary} />
              <img
                className="hidden group-disabled:block"
                src={ArrowRightTertiary}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute z-0 flex h-screen w-screen items-end justify-end overflow-hidden md:static">
        <div className="absolute h-20 w-full bg-gradient-to-b from-transparent to-black opacity-90" />
        <img
          className="relative z-0 h-screen w-full object-cover"
          src={LandingImage}
        />
      </div>
    </div>
  );
}
