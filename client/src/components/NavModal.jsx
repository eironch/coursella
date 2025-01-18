import React from "react";
import PropTypes from "prop-types";

import { useAppContext } from "../context/AppContext.jsx";

import Backdrop from "./Backdrop.jsx";

NavModal.propTypes = {
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  setIsActionModalOpen: PropTypes.func,
  setActionModalSettings: PropTypes.func,
  tabs: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function NavModal({
  currentTab,
  setCurrentTab,
  setIsActionModalOpen,
  setActionModalSettings,
  tabs,
  handleClose,
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
    <Backdrop onClick={handleClose}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="py-10">
          <div
            className="flex h-fit w-full flex-col items-center justify-center gap-5 rounded-3xl font-bold text-tertiary"
            onClick={(e) => e.stopPropagation()}
          >
            {tabs.map((tab, index) => (
              <React.Fragment key={index}>
                {tab.name === "Log Out" && (
                  <div className="h-full w-full rounded-3xl bg-component" />
                )}
                <button
                  className={`${currentTab === tab.name ? "bg-highlight hover:bg-highlight-light" : "bg-secondary hover:bg-component"} flex w-full items-center gap-4 rounded-3xl px-8 py-5 q-text-sm`}
                  onClick={() => {
                    if (tab.name !== "Log Out") {
                      setCurrentTab(tab.name);
											handleClose()
                    } else {
                      handleOpenActionModal();
                    }
                  }}
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
        </div>
      </div>
    </Backdrop>
  );
}
