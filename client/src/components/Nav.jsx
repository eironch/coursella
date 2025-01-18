import React from "react";
import PropTypes from "prop-types";

import { useAppContext } from "../context/AppContext.jsx";

import CoursellaLogo from "../assets/coursella-logo.svg";

Nav.propTypes = {
  children: PropTypes.element.isRequired,
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  setIsActionModalOpen: PropTypes.func,
  setActionModalSettings: PropTypes.func,
  tabs: PropTypes.array.isRequired,
};

export default function Nav({
  children,
  currentTab,
  setCurrentTab,
  setIsActionModalOpen,
  setActionModalSettings,
  tabs,
}) {
  const { role, logOut } = useAppContext();

  function handleOpenActionModal() {
    setIsActionModalOpen(true);
    setActionModalSettings({
      title: "Log Out",
      message: (
        <p>
          Are you sure you want to log out? You will lose any unsaved progress.
        </p>
      ),
      actionLabel: "Log Out",
      action: () => {
        setIsActionModalOpen(false);
        logOut();
      },
    });
  }

  return (
    <div className="z-20 flex h-full w-full">
      <div className="hidden h-full w-4/12 flex-col items-center gap-5 q-pl-10 pb-5 pt-3 q-text-base md:flex">
        <div className="flex h-20 w-full items-center gap-5 p-4">
          <img className="w-10" src={CoursellaLogo} />
          <h1 className="font-helvetica-compressed text-highlight q-text-2xl">
            {role === "Instructor" && "Instructor Dashboard"}
            {role === "Coordinator" && "Coordinator Dashboard"}
            {role === "Admin" && "Admin Dashboard"}
          </h1>
        </div>
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            {tab.name === "Log Out" && (
              <div className="h-full w-full rounded-3xl bg-component" />
            )}
            <button
              className={`${currentTab === tab.name ? "bg-highlight hover:bg-highlight-light" : "bg-component hover:bg-tertiary/20"} flex w-full items-center gap-4 rounded-3xl px-8 py-5 q-text-sm`}
              onClick={() =>
                tab.name !== "Log Out"
                  ? setCurrentTab(tab.name)
                  : handleOpenActionModal()
              }
              key={index}
            >
              <img
                className={`${currentTab === tab.name ? "block" : "hidden"} w-5`}
                src={tab.iconPrimary}
              />
              <img
                className={`${currentTab === tab.name ? "hidden" : "block"} w-5`}
                src={tab.iconTertiary}
              />
              <h2
                className={`${currentTab === tab.name ? "text-primary" : "text-tertiary"}`}
              >
                {tab.name}
              </h2>
            </button>
          </React.Fragment>
        ))}
      </div>
      {children}
    </div>
  );
}
