import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import { useNavigate, useParams } from "react-router-dom";

import { useAppContext } from "../context/AppContext.jsx";

import AccountManagementTertiary from "../assets/account-management-tertiary.svg";
import LogOutTertiary from "../assets/log-out-tertiary.svg";
import AccountManagementPrimary from "../assets/account-management-primary.svg";
import LogOutPrimary from "../assets/log-out-primary.svg";
import ArrowTertiary from "../assets/arrow-tertiary.svg";
import ProgramInfoPrimary from "../assets/program-info-primary.svg";
import ProgramInfoTertiary from "../assets/program-info-tertiary.svg";
import MessagesPrimary from "../assets/messages-primary.svg";
import MessagesTertiary from "../assets/messages-tertiary.svg";
import SyllabusManagementPrimary from "../assets/syllabus-management-primary.svg";
import SyllabusManagementTertiary from "../assets/syllabus-management-tertiary.svg";
import CoursellaLogo from "../assets/coursella-logo.svg";
import NavTertiary from "../assets/nav-tertiary.svg";

import Nav from "../components/Nav.jsx";
import ActionModal from "../components/ActionModal.jsx";

import SyllabusManagement from "./admin/SyllabusManagement.jsx";
import Combobox from "../components/Combobox.jsx";
import SyllabusModal from "../components/SyllabusModal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ProgramInformation from "./admin/ProgramInformation.jsx";
import Messages from "./admin/Messages.jsx";
import MessagesModal from "../components/MessageModal.jsx";
import AccountManagement from "./admin/AccountManagement.jsx";
import ResultModal from "../components/ResultModal.jsx";
import NavModal from "../components/NavModal.jsx";

AdminPage.propTypes = {};

export default function AdminPage() {
  const {
    api,
    log,
    error,
    userId,
    role,
    handlePath,
    formatDate,
    incrementDay,
    decrementDay,
    incrementProgramYearSem,
    decrementProgramYearSem,
  } = useAppContext();

  const { syllabusId } = useParams();
  const [currentTab, setCurrentTab] = useState("Program Information");
  const [currentSubTab, setCurrentSubTab] = useState("Pending");
  const targetIdRef = useRef();
  const [action, setAction] = useState([]);
  const [appointmentDay, setAppointmentDay] = useState(
    new Date().toLocaleDateString(),
  );
  const [searchParams, setSearchParams] = useState([]);
  const [programName, setProgramName] = useState("");
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);

  // syllabus management
  const [searchSyllabus, setSearchSyllabus] = useState("");
  const [syllabi, setSyllabi] = useState([]);

  // program information
  const [courses, setCourses] = useState([]);
  const [searchCourse, setSearchCourse] = useState("");
  const [programYearSem, setProgramYearSem] = useState({ year: 1, sem: 1 });

  // messages
  const [recipient, setRecipient] = useState({});
  const [recipients, setRecipients] = useState([]);
  const [searchRecipient, setSearchRecipient] = useState("");
  const [searchRecipients, setSearchRecipients] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);

  // modal
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalSettings, setActionModalSettings] = useState({});
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultModalSettings, setResultModalSettings] = useState({});
  const [modalIcon, setModalIcon] = useState("Checkmark");

  const manageEnrollmentSubTabs = [
    "Pending",
    "Waitlisted",
    "Rejected",
    "All Applications",
    "Enrollment Settings",
  ];
  const studentRecordsSubTabs = [
    "All Students",
    "Current Students",
    "Graduates",
  ];
  const academicRecordsSubTabs = [
    "All Students",
    "Current Students",
    "Graduates",
  ];

  const adminTabs = [
    {
      iconTertiary: ProgramInfoTertiary,
      iconPrimary: ProgramInfoPrimary,
      name: "Program Information",
    },
    {
      iconTertiary: SyllabusManagementTertiary,
      iconPrimary: SyllabusManagementPrimary,
      name: "Syllabus Management",
    },
    {
      iconTertiary: AccountManagementTertiary,
      iconPrimary: AccountManagementPrimary,
      name: "Account Management",
    },
    {
      iconTertiary: MessagesTertiary,
      iconPrimary: MessagesPrimary,
      name: "Messages",
    },
    {
      iconTertiary: LogOutTertiary,
      iconPrimary: LogOutPrimary,
      name: "Log Out",
    },
  ];

  function setTargetId(value) {
    targetIdRef.current = value;
  }

  function handleSyllabusModalOpen(isOpen) {
    setIsSyllabusModalOpen(isOpen);
    setIsEditable(false);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function getSyllabiAdmin() {
      try {
        const res = await api.get("/admin/get-syllabi", {
          params: { programName },
          signal: controller.signal,
        });
        log(res);

        const payload = res.data.payload;

        setSyllabi(payload);
      } catch (err) {
        error(err);
      }
    }

    getSyllabiAdmin();

    return () => {
      controller.abort();
    };
  }, [programName]);

  const debounceGetFindSyllabi = debounce(async () => {
    try {
      const res = await api.get("/admin/get-find-syllabi", {
        params: {
          programName,
          searchQuery: searchSyllabus,
          searchParams,
        },
      });
      log(res);

      const payload = res.data.payload;

      setSyllabi(payload);
    } catch (err) {
      error(err);
    }
  }, 300);

  const debounceGetSyllabi = debounce(async () => {
    try {
      const res = await api.get("/admin/get-syllabi", {
        params: {
          programName,
        },
      });
      log(res);

      const payload = res.data.payload;

      setSyllabi(payload);
    } catch (err) {
      error(err);
    }
  }, 300);

  useEffect(() => {
    if (searchSyllabus === "") {
      currentTab === "Syllabus Management" && debounceGetSyllabi();
      return;
    }

    if (currentTab === "Syllabus Management") debounceGetFindSyllabi();

    return () => {
      debounceGetFindSyllabi.cancel();
    };
  }, [searchSyllabus, searchParams]);

  const debounceGetCourses = debounce(async () => {
    try {
      const res = await api.get("/admin/get-courses", {
        params: {
          programName,
          courseYear: programYearSem.year,
          courseSem: programYearSem.sem,
        },
      });
      log(res);

      const payload = res.data.payload;

      setCourses(payload);
    } catch (err) {
      console.log(err);
      error(err);
    }
  }, 300);

  const debounceGetFindCourses = debounce(async () => {
    try {
      const res = await api.get("/admin/get-find-courses", {
        params: {
          programName,
          courseYear: programYearSem.year,
          courseSem: programYearSem.sem,
          searchQuery: searchCourse,
          searchParams,
        },
      });
      log(res);

      const payload = res.data.payload;

      setCourses(payload);
    } catch (err) {
      error(err);
    }
  }, 300);

  useEffect(() => {
    if (searchCourse === "") {
      currentTab === "Program Information" && debounceGetCourses();
      return;
    }

    if (currentTab === "Program Information") debounceGetFindCourses();

    return () => {
      debounceGetFindCourses.cancel();
    };
  }, [searchCourse, searchParams, programYearSem, programName]);

  useEffect(() => {
    setSearchSyllabus("");
    setSearchRecipient("");
  }, [currentTab]);

  const debounceGetFindRecipients = debounce(async () => {
    try {
      const res = await api.get("/admin/get-find-recipient", {
        params: { targetId: userId, searchQuery: searchRecipient },
      });
      log(res);

      const payload = res.data.payload;

      setSearchRecipients(payload);
      setFilteredRecipients(payload);
    } catch (err) {
      error(err);
    }
  }, 300);

  useEffect(() => {
    if (searchRecipient === "") {
      setSearchRecipients(recipients);
      return;
    }

    debounceGetFindRecipients();

    return () => {
      debounceGetFindRecipients.cancel();
    };
  }, [searchRecipient]);

  if (role === "Admin")
    return (
      <div className="relative flex h-screen w-screen overflow-hidden bg-secondary font-montserrat">
        <div className="absolute left-0 z-0 h-[100vh] w-[100vh] rounded-full bg-[radial-gradient(circle,_rgba(19,71,19,0.80),_rgba(19,71,19,0),_rgba(19,71,19,0))] opacity-55" />
        <AnimatePresence initial={false} mode="wait">
          {isSyllabusModalOpen && (
            <SyllabusModal
              handleClose={() => {
                navigate("/admin");
                setIsSyllabusModalOpen(false);
              }}
              currentTab={currentTab}
              setIsSyllabusModalOpen={setIsSyllabusModalOpen}
              setIsActionModalOpen={setIsActionModalOpen}
              setActionModalSettings={setActionModalSettings}
              setIsResultModalOpen={setIsResultModalOpen}
              setResultModalSettings={setResultModalSettings}
              isEditable={isEditable}
            />
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait">
          {isNavModalOpen && (
            <NavModal
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setActionModalSettings={setActionModalSettings}
              setIsActionModalOpen={setIsActionModalOpen}
              tabs={adminTabs}
              handleClose={() => setIsNavModalOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait">
          {isActionModalOpen && (
            <ActionModal
              handleClose={() => setIsActionModalOpen(false)}
              title={actionModalSettings.title}
              message={actionModalSettings.message}
              modalIcon={modalIcon}
              actionLabel={actionModalSettings.actionLabel}
              action={actionModalSettings.action}
            />
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait">
          {isMessageModalOpen && (
            <MessagesModal
              handleClose={() => setIsMessageModalOpen(false)}
              targetId={targetIdRef.current}
              recipient={recipient}
            />
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait">
          {isResultModalOpen && (
            <ResultModal
              handleClose={resultModalSettings.handleClose}
              title={resultModalSettings.title}
              message={resultModalSettings.message}
              modalIcon={modalIcon}
            />
          )}
        </AnimatePresence>
        <Nav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setActionModalSettings={setActionModalSettings}
          setIsActionModalOpen={setIsActionModalOpen}
          tabs={adminTabs}
        >
          <div className="scrollable-div q-pr-5 flex h-full w-full flex-col gap-5 overflow-y-scroll py-5 text-tertiary q-scroll-page">
            <div className="flex items-center justify-between gap-5 md:hidden">
              <div className="w-10 flex-none">
                <img className="h-full w-full" src={CoursellaLogo} />
              </div>
              <div className="w-full font-helvetica-compressed text-highlight q-text-3xl">
                {role === "New" ? "Admission" : `${role} Dashboard`}
              </div>
              <button onClick={() => setIsNavModalOpen(true)}>
                <img className="h-full w-full" src={NavTertiary} />
              </button>
            </div>
            {currentTab === "Syllabus Management" && (
              <div className="flex items-center justify-between gap-5 rounded-3xl bg-white px-5 py-4 q-text-base">
                <SearchBar
                  items={[]}
                  filteredItems={[]}
                  setFilteredItems={() => {}}
                  isSearchable={true}
                  placeholder="Search syllabus"
                  name="searchSyllabus"
                  value={searchSyllabus}
                  setValue={(e) => setSearchSyllabus(e.target.value)}
                  actionOnSelect={() => {}}
                  attr="w-full"
                  disabled={false}
                />
              </div>
            )}
            {currentTab === "Program Information" && (
              <div className="flex items-center justify-between gap-5 rounded-3xl bg-white px-5 py-4 q-text-base">
                <SearchBar
                  items={[]}
                  filteredItems={[]}
                  setFilteredItems={() => {}}
                  isSearchable={true}
                  placeholder="Search course"
                  name="searchCourse"
                  value={searchCourse}
                  setValue={(e) => setSearchCourse(e.target.value)}
                  actionOnSelect={() => {}}
                  attr="w-full"
                  disabled={false}
                />
              </div>
            )}
            {(currentTab === "Syllabus Management" ||
              currentTab === "Program Information") && (
              <div className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 q-text-base">
                <Combobox
                  items={[
                    "Bachelor of Science in Computer Science",
                    "Bachelor of Science in Information Technology",
                  ]}
                  isSearchable={true}
                  labelText=""
                  placeholder="Select program"
                  name="programName"
                  value={programName}
                  setValue={(e) => setProgramName(e.target.value)}
                  type="text"
                  attr="w-full"
                  disabled={false}
                />
              </div>
            )}
            {currentTab === "Messages" && (
              <div className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 q-text-base">
                <SearchBar
                  items={searchRecipients}
                  filteredItems={filteredRecipients}
                  setFilteredItems={setFilteredRecipients}
                  isSearchable={true}
                  placeholder="Search personnel"
                  name="searchRecipient"
                  value={searchRecipient}
                  setValue={(e) => setSearchRecipient(e.target.value)}
                  actionOnSelect={(value) => {
                    setTargetId(value.recipientId);
                    setIsMessageModalOpen(true);
                    setRecipient({ ...value });
                  }}
                  attr="w-full"
                  disabled={false}
                />
              </div>
            )}
            <div className="flex h-fit w-full">
              <div className="flex h-fit w-full flex-col rounded-3xl bg-component">
                <div className="flex items-center justify-between overflow-hidden px-3">
                  {currentTab === "Manage Enrollment" && (
                    <div className="flex h-20 gap-2 px-2 q-text-base">
                      {manageEnrollmentSubTabs.map((subTab, index) => (
                        <button
                          className="p-3 text-tertiary hover:text-tertiary/80"
                          onClick={() => setCurrentSubTab(subTab)}
                          key={index}
                        >
                          {subTab}
                          <div
                            className={`${currentSubTab === subTab ? "visible" : "invisible"} h-1 w-full rounded-full bg-tertiary`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {currentTab === "Academic Records" && (
                    <div className="flex h-20 gap-2 px-2 q-text-base">
                      {academicRecordsSubTabs.map((subTab, index) => (
                        <button
                          className="p-3 text-tertiary hover:text-tertiary/80"
                          onClick={() => setCurrentSubTab(subTab)}
                          key={index}
                        >
                          {subTab}
                          <div
                            className={`${currentSubTab === subTab ? "visible" : "invisible"} h-1 w-full rounded-full bg-tertiary`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {currentTab === "Student Records" && (
                    <div className="flex h-20 gap-2 px-2 q-text-base">
                      {studentRecordsSubTabs.map((subTab, index) => (
                        <button
                          className="p-3 text-tertiary hover:text-tertiary/80"
                          onClick={() => setCurrentSubTab(subTab)}
                          key={index}
                        >
                          {subTab}
                          <div
                            className={`${currentSubTab === subTab ? "visible" : "invisible"} h-1 w-full rounded-full bg-tertiary`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {currentTab === "Appointments" && (
                    <div className="flex h-20 gap-2 px-2 q-text-base">
                      <div className="flex items-center gap-5 pl-3">
                        <div className="flex gap-3">
                          <button
                            className="h-fit w-fit border border-tertiary p-3 q-rounded-xl hover:bg-white"
                            onClick={() =>
                              decrementDay(appointmentDay, setAppointmentDay)
                            }
                          >
                            <img
                              className="w-3 rotate-90"
                              src={ArrowTertiary}
                            />
                          </button>
                          <button
                            className="h-fit w-fit border border-tertiary p-3 q-rounded-xl hover:bg-white"
                            onClick={() =>
                              incrementDay(appointmentDay, setAppointmentDay)
                            }
                          >
                            <img
                              className="w-3 -rotate-90"
                              src={ArrowTertiary}
                            />
                          </button>
                        </div>
                        <h1 className="q-text-base">
                          {formatDate(appointmentDay)}
                        </h1>
                      </div>
                    </div>
                  )}
                  {currentTab === "Program Information" && (
                    <div className="flex h-20 gap-2 px-2 q-text-base">
                      <div className="flex items-center gap-5 pl-5">
                        <div className="flex gap-3">
                          <button
                            className="h-fit w-fit border border-tertiary p-3 q-rounded-xl hover:bg-white"
                            onClick={() =>
                              decrementProgramYearSem(
                                programYearSem,
                                setProgramYearSem,
                              )
                            }
                          >
                            <img
                              className="w-3 rotate-90"
                              src={ArrowTertiary}
                            />
                          </button>
                          <button
                            className="h-fit w-fit border border-tertiary p-3 q-rounded-xl hover:bg-white"
                            onClick={() =>
                              incrementProgramYearSem(
                                programYearSem,
                                setProgramYearSem,
                              )
                            }
                          >
                            <img
                              className="w-3 -rotate-90"
                              src={ArrowTertiary}
                            />
                          </button>
                        </div>
                        <h2 className="flex gap-2 q-text-base">
                          Year {programYearSem.year} Sem {programYearSem.sem}
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-full w-full overflow-hidden rounded-3xl bg-white">
                  {currentTab === "Syllabus Management" && (
                    <SyllabusManagement
                      syllabi={syllabi}
                      setTargetId={syllabusId}
                      searchParams={searchParams}
                      setSearchParams={setSearchParams}
                      handleSyllabusModalOpen={handleSyllabusModalOpen}
                    />
                  )}
                  {currentTab === "Program Information" && (
                    <ProgramInformation
                      searchParams={searchParams}
                      setSearchParams={setSearchParams}
                      data={courses}
                    />
                  )}
                  {currentTab === "Messages" && (
                    <Messages
                      setTargetId={setTargetId}
                      setIsMessageModalOpen={setIsMessageModalOpen}
                      setRecipient={setRecipient}
                      recipients={recipients}
                      setRecipients={setRecipients}
                      setFilteredRecipients={setFilteredRecipients}
                    />
                  )}
                  {currentTab === "Account Management" && (
                    <AccountManagement
                      setTargetId={setTargetId}
                      setIsResultModalOpen={setIsResultModalOpen}
                      setResultModalSettings={setResultModalSettings}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Nav>
      </div>
    );
}
