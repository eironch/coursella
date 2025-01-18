import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { debounce, isEqual } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import PropTypes from "prop-types";

import { useAppContext } from "../context/AppContext.jsx";

import AccountInfoTertiary from "../assets/account-info-tertiary.svg";
import LogOutTertiary from "../assets/log-out-tertiary.svg";
import AccountInfoPrimary from "../assets/account-info-primary.svg";
import LogOutPrimary from "../assets/log-out-primary.svg";
import LoadingAnimation from "../assets/loading.json";
import MessagesPrimary from "../assets/messages-primary.svg";
import MessagesTertiary from "../assets/messages-tertiary.svg";
import SyllabusManagementPrimary from "../assets/syllabus-management-primary.svg";
import SyllabusManagementTertiary from "../assets/syllabus-management-tertiary.svg";
import InstructorSyllabiPrimary from "../assets/instructor-syllabi-primary.svg";
import InstructorSyllabiTertiary from "../assets/instructor-syllabi-tertiary.svg";
import CoursellaLogo from "../assets/coursella-logo.svg";
import NavTertiary from "../assets/nav-tertiary.svg";

import Nav from "../components/Nav.jsx";
import ResultModal from "../components/ResultModal.jsx";
import ActionModal from "../components/ActionModal.jsx";
import SyllabusModal from "../components/SyllabusModal.jsx";
import MessageModal from "../components/MessageModal.jsx";
import Combobox from "../components/Combobox.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NavModal from "../components/NavModal.jsx";

import InstructorInfo from "./instructor/InstructorInfo.jsx";
import InstructorSyllabi from "./instructor/InstructorSyllabi.jsx";
import Messages from "./instructor/Messages.jsx";
import SyllabusManagement from "./instructor/SyllabusManagement.jsx";

InstructorPage.propTypes = {};

export default function InstructorPage() {
  const { api, log, error, userId, role } = useAppContext();

  const { syllabusId } = useParams();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("Instructor Syllabi");
  const [currentSubTab, setCurrentSubTab] = useState("Profile");
  const instructorInfoSubTabs = ["Profile", "Personal"];
  const [programName, setProgramName] = useState("");
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [searchParams, setSearchParams] = useState([]);

  const [instructorRecordOld, setInstructorRecordOld] = useState({
    fullName: "",
    givenName: "",
    middleName: "",
    familyName: "",
    suffix: "",
    sexAtBirth: "",
    dateOfBirth: "",
    civilStatus: "",
    contactNum: "",
    religion: "",
    nationality: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvinceRegion: "",
    postalCode: "",
    country: "",
    disability: "",
    indigenousGroup: "",
    profileImage: null,
  });
  const [instructorRecord, setInstructorRecord] = useState({
    fullName: "",
    givenName: "",
    middleName: "",
    familyName: "",
    suffix: "",
    sexAtBirth: "",
    dateOfBirth: "",
    civilStatus: "",
    contactNum: "",
    religion: "",
    nationality: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvinceRegion: "",
    postalCode: "",
    country: "",
    disability: "",
    indigenousGroup: "",
    profileImage: null,
  });
  const targetIdRef = useRef();

  // modals
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultModalSettings, setResultModalSettings] = useState({});
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalSettings, setActionModalSettings] = useState({});
  const [modalIcon, setModalIcon] = useState("Checkmark");

  const [isEditable, setIsEditable] = useState(false);
  const [instructor, setInstructor] = useState({});

  // instructor syllabi
  const [syllabi, setSyllabi] = useState([]);
  const [searchSyllabus, setSearchSyllabus] = useState("");

  const instructorTabs = [
    {
      iconTertiary: InstructorSyllabiTertiary,
      iconPrimary: InstructorSyllabiPrimary,
      name: "Instructor Syllabi",
    },
  ];

  if (role === "Coordinator")
    instructorTabs.push({
      iconTertiary: SyllabusManagementTertiary,
      iconPrimary: SyllabusManagementPrimary,
      name: "Syllabus Management",
    });

  instructorTabs.push(
    {
      iconTertiary: AccountInfoTertiary,
      iconPrimary: AccountInfoPrimary,
      name: "Instructor Information",
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
  );

  // messages
  const [recipient, setRecipient] = useState({});
  const [recipients, setRecipients] = useState([]);
  const [searchRecipient, setSearchRecipient] = useState("");
  const [searchRecipients, setSearchRecipients] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);

  function setTargetId(value) {
    targetIdRef.current = value;
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    setInstructorRecord((prev) => ({
      ...prev,
      [name]: name !== "profileImage" ? value : files[0],
    }));
  }

  function handleSyllabusModalOpen(isOpen) {
    setIsSyllabusModalOpen(isOpen);
    setIsEditable(false);
  }

  async function putInstructorRecord() {
    setIsSaveLoading(true);

    try {
      const data = new FormData();

      data.append("profileImage", instructorRecord.profileImage);
      data.append("targetId", JSON.stringify(userId));
      data.append("record", JSON.stringify(instructorRecord));

      const res = await api.put("/action/put-instructor-record", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      log(res);

      setIsSaveLoading(false);
      setIsResultModalOpen(true);
      setInstructorRecordOld(instructorRecord);
      setResultModalSettings({
        handleClose: () => setIsResultModalOpen(false),
        title: "Personnel Info Updated",
        message: <p>You have successfully updated your information.</p>,
      });
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  useEffect(() => {
    setIsSyllabusModalOpen(!!syllabusId);
  }, [syllabusId]);

  useEffect(() => {
    switch (currentTab) {
      case "Instructor Information":
        setCurrentSubTab("Profile");
        break;
      case "Course Management":
        setCurrentSubTab("Overview");
        break;
    }
  }, [currentTab]);

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

  const debounceGetFindSyllabiInstructor = debounce(async () => {
    try {
      const res = await api.get("/admin/get-find-syllabi-instructor", {
        params: {
          targetId: userId,
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

  const debounceGetSyllabiInstructor = debounce(async () => {
    try {
      const res = await api.get("/admin/get-syllabi-instructor", {
        params: {
          targetId: userId,
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
      currentTab === "Instructor Syllabi"
        ? userId && debounceGetSyllabiInstructor()
        : debounceGetSyllabi();
      return;
    }

    if (currentTab === "Instructor Syllabi") {
      userId && debounceGetFindSyllabiInstructor();
    } else if (currentTab === "Syllabus Management") {
      debounceGetFindSyllabi();
    }

    return () => {
      debounceGetFindSyllabi.cancel();
    };
  }, [searchSyllabus, searchParams, userId]);

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

  useEffect(() => {
    async function getInstructorBasic() {
      try {
        const res = await api.get("/admin/get-instructor-basic", {
          params: {
            targetId: userId,
          },
        });
        log(res);

        const payload = res.data.payload;

        if (payload.profileImage) {
          const byteArray = new Uint8Array(payload.profileImage.data);
          payload.profileImage = new Blob([byteArray], { type: "image/png" });
        }

        setInstructor(payload);
      } catch (err) {
        error(err);
      }
    }

    userId && getInstructorBasic();
  }, [userId]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-secondary font-montserrat">
      <div className="absolute left-0 z-0 h-[100vh] w-[100vh] rounded-full bg-[radial-gradient(circle,_rgba(19,71,19,0.80),_rgba(19,71,19,0),_rgba(19,71,19,0))] opacity-55" />
      <AnimatePresence initial={false} mode="wait">
        {isSyllabusModalOpen && (
          <SyllabusModal
            handleClose={() => {
              navigate("/instructor");
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
            tabs={instructorTabs}
            handleClose={() => setIsNavModalOpen(false)}
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
          <MessageModal
            handleClose={() => setIsMessageModalOpen(false)}
            targetId={targetIdRef.current}
            recipient={recipient}
          />
        )}
      </AnimatePresence>
      <Nav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setActionModalSettings={setActionModalSettings}
        setIsActionModalOpen={setIsActionModalOpen}
        tabs={instructorTabs}
      >
        <div className="q-scroll-page scrollable-div flex h-full w-full flex-col gap-5 overflow-y-scroll py-5 text-tertiary">
          <div className="flex items-center justify-between gap-5 md:hidden">
            <div className="w-10 flex-none">
              <img className="h-full w-full" src={CoursellaLogo} />
            </div>
            <div className="w-full font-helvetica-compressed text-highlight q-text-3xl">
              Instructor Dashboard
            </div>
            <button onClick={() => setIsNavModalOpen(true)}>
              <img className="h-full w-full" src={NavTertiary} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="px-2">
              <h1 className="q-text-lg">
                {instructor.fullName ? `Welcome, ${instructor.fullName}` : ""}
              </h1>
              <h1 className="q-text-base">
                {instructor.department
                  ? `${instructor.department} ${instructor.role}`
                  : ""}
              </h1>
            </div>
            <div className="hidden h-20 w-20 flex-none rounded-full bg-white p-1 md:block">
              <img
                className="h-full w-full rounded-full object-cover"
                src={
                  instructor.profileImage &&
                  URL.createObjectURL(instructor.profileImage)
                }
              />
            </div>
          </div>
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
          {(currentTab === "Instructor Syllabi" ||
            currentTab === "Syllabus Management") && (
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
          {currentTab === "Syllabus Management" && (
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
          <div className="flex h-fit w-full">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-component">
              {currentTab === "Instructor Information" && (
                <div className="scrollable-div flex h-20 items-center gap-2 overflow-x-scroll px-5 q-text-base">
                  {instructorInfoSubTabs.map((subTab, index) => (
                    <button
                      className="h-full p-3 pb-0 text-tertiary hover:text-tertiary/80"
                      onClick={() => setCurrentSubTab(subTab)}
                      key={index}
                    >
                      {subTab}
                      <div
                        className={`${currentSubTab === subTab ? "visible" : "invisible"} h-1 w-full rounded-full bg-tertiary`}
                      />
                    </button>
                  ))}
                  <div className="flex w-full justify-end gap-5 pl-2">
                    <button
                      className={`${isEditingRecord ? "bg-red-500 hover:bg-red-400" : "bg-highlight hover:bg-highlight-light"} flex h-10 w-fit items-center justify-center gap-5 whitespace-nowrap px-5 text-primary q-text-sm q-rounded-xl`}
                      onClick={() => {
                        if (isEditingRecord) {
                          setInstructorRecord(instructorRecordOld);
                        }

                        setIsEditingRecord(!isEditingRecord);
                      }}
                    >
                      {isEditingRecord ? "Cancel Edit" : "Edit Info"}
                    </button>
                    <button
                      className="flex h-10 w-fit items-center justify-center gap-5 whitespace-nowrap bg-highlight px-5 text-primary q-text-sm q-rounded-xl hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                      onClick={() => putInstructorRecord()}
                      disabled={
                        isSaveLoading ||
                        isEqual(instructorRecord, instructorRecordOld)
                      }
                    >
                      Save Changes
                      {isSaveLoading && <Loading />}
                    </button>
                  </div>
                </div>
              )}
              {currentTab === "Instructor Syllabi" && (
                <div className="mx-5 flex h-20 items-center justify-end gap-2 px-2 q-text-base">
                  <button
                    className="flex h-10 w-fit items-center justify-center gap-5 bg-highlight px-5 text-primary q-text-sm q-rounded-xl hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                    onClick={() => {
                      setIsEditable(true);
                      setIsSyllabusModalOpen(true);
                    }}
                    disabled={isSaveLoading}
                  >
                    Create Syllabus
                    {isSaveLoading && <Loading />}
                  </button>
                </div>
              )}
              <div className="flex h-fit w-full justify-center rounded-3xl bg-white overflow-hidden">
                {currentTab === "Instructor Information" && (
                  <InstructorInfo
                    handleChange={handleChange}
                    instructorRecord={instructorRecord}
                    setInstructorRecord={setInstructorRecord}
                    setInstructorRecordOld={setInstructorRecordOld}
                    isEditingRecord={isEditingRecord}
                    instructorInfoSubTabs={instructorInfoSubTabs}
                    currentSubTab={currentSubTab}
                  />
                )}
                {currentTab === "Instructor Syllabi" && (
                  <InstructorSyllabi
                    syllabi={syllabi}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    handleSyllabusModalOpen={handleSyllabusModalOpen}
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
                {currentTab === "Syllabus Management" && (
                  <SyllabusManagement
                    programName={programName}
                    syllabi={syllabi}
                    setSyllabi={setSyllabi}
                    setTargetId={syllabusId}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    handleSyllabusModalOpen={handleSyllabusModalOpen}
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

function Loading() {
  return (
    <Lottie
      animationData={LoadingAnimation}
      style={{ width: 20, height: 20 }}
    />
  );
}
