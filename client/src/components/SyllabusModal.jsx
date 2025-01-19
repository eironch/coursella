import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { useAppContext } from "../context/AppContext.jsx";

import Backdrop from "./Backdrop.jsx";
import Table from "./Table.jsx";
import InputField from "./InputField.jsx";
import Combobox from "./Combobox.jsx";
import Lottie from "lottie-react";

import LoadingAnimation from "../assets/loading.json";

import OverviewTab from "../pages/instructor/courseManagementTabs/OverviewTab.jsx";
import ObjectivesTab from "../pages/instructor/courseManagementTabs/ObjectivesTab.jsx";
import DetailsTab from "../pages/instructor/courseManagementTabs/DetailsTab.jsx";
import UniversityInfo from "../pages/instructor/courseManagementTabs/UniversityInfo.jsx";
import ResourcesTab from "../pages/instructor/courseManagementTabs/ResourcesTab.jsx";
import PoliciesTab from "../pages/instructor/courseManagementTabs/PoliciesTab.jsx";
import HistoryTab from "../pages/instructor/courseManagementTabs/HistoryTab.jsx";

SyllabusModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  currentTab: PropTypes.string,
  setIsSyllabusModalOpen: PropTypes.func,
  setIsActionModalOpen: PropTypes.func,
  setActionModalSettings: PropTypes.func,
  setIsResultModalOpen: PropTypes.func,
  setResultModalSettings: PropTypes.func,
  isEditable: PropTypes.bool.isRequired,
};

const slideUp = {
  hidden: { y: "20%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 20,
      stiffness: 120,
    },
  },
  exit: { y: "20%", opacity: 0, transition: { duration: 0.15 } },
};

export default function SyllabusModal({
  handleClose,
  currentTab,
  setIsSyllabusModalOpen,
  setIsActionModalOpen,
  setActionModalSettings,
  setIsResultModalOpen,
  setResultModalSettings,
  isEditable,
}) {
  const { api, log, error, userId, role } = useAppContext();
  const targetId = useParams();

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSubmittable, setIsSubmittable] = useState(false);

  const [courseCodes, setCourseCodes] = useState([]);

  const [currentModalTab, setCurrentModalTab] = useState("Overview");
  const [syllabus, setSyllabus] = useState({
    programName: "",
    courseCode: "",
    courseTitle: "",
    isLecture: "false",
    isLaboratory: "false",
    creditUnits: "",
    courseDescription: "",
    prerequisite: "",
    gradingSystem: "",
  });

  const [schedules, setSchedules] = useState([]);

  // course outcomes
  const [selectedOutcome, setSelectedOutcome] = useState({
    value: "",
    codes: [false, false, false, false, false, false],
  });
  const [outcomes, setOutcomes] = useState([]);

  // course coverage
  const [selectedCoverages, setSelectedCoverages] = useState({
    ilo: "",
    topic: "",
    tla: "",
    modeOfDelivery: "",
    resourcesNeeded: "",
    oba: "",
    outputDueDate: "",
  });
  const [coverages, setCoverages] = useState([]);

  // reference books
  const [selectedRefBook, setSelectedRefBook] = useState({});
  const [refBooks, setRefBooks] = useState([]);

  // previous syllabus / module
  const [selectedPrevModule, setSelectedPrevModule] = useState({});
  const [prevModules, setPrevModules] = useState([]);

  // web references
  const [selectedWebRef, setSelectedWebRef] = useState({});
  const [webRefs, setWebRefs] = useState([]);

  // prepared by
  const [preparedBy, setPreparedBy] = useState({});

  const [selectedCourseCodes, setSelectedCourseCodes] = useState([]);

  const programEnrollmentSubTabs = [
    "Overview",
    "University Info",
    "Objectives",
    "Details",
    "Policies",
    "Resources",
    "History",
  ];

  function handleSyllabusChange(e) {
    const { name, value } = e.target;

    setSyllabus((prev) => ({ ...prev, [name]: value }));
  }

  async function postSyllabus() {
    try {
      const res = await api.post("/create/post-syllabus", {
        syllabus,
        targetId: userId,
      });
      log(res);

      const payload = res.data.payload;

      setIsSaveLoading(false);

      return payload;
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function postCourseSchedules(syllabusId) {
    try {
      const res = await api.post("/create/post-course-schedules", {
        syllabusId,
        schedules,
      });
      log(res);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function postCourseOutcomes(syllabusId) {
    try {
      const res = await api.post("/create/post-course-outcomes", {
        syllabusId,
        outcomes,
      });
      log(res);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function postCourseCoverages(syllabusId) {
    try {
      const res = await api.post("/create/post-course-coverages", {
        syllabusId,
        coverages,
      });
      log(res);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function postReferenceBooks(syllabusId) {
    try {
      const res = await api.post("/create/post-reference-books", {
        syllabusId,
        refBooks,
      });
      log(res);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function postPreviousModules(syllabusId) {
    try {
      const res = await api.post("/create/post-previous-modules", {
        syllabusId,
        prevModules,
      });
      log(res);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function postWebReferences(syllabusId) {
    try {
      const res = await api.post("/create/post-web-references", {
        syllabusId,
        webRefs,
      });
      log(res);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function saveSyllabus() {
    setIsSaveLoading(true);

    const syllabusId = await postSyllabus();

    postCourseSchedules(syllabusId);
    postCourseOutcomes(syllabusId);
    postCourseCoverages(syllabusId);
    postReferenceBooks(syllabusId);
    postPreviousModules(syllabusId);
    postWebReferences(syllabusId);
  }

  async function putEvaluationStatus(status) {
    setIsSaveLoading(true);

    try {
      const res = await api.put("/action/put-evaluation-status", {
        targetId: targetId.syllabusId,
        status,
      });
      log(res);

      setIsSaveLoading(false);
      setIsSyllabusModalOpen(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  async function putApprovalStatus(status) {
    setIsSaveLoading(true);

    try {
      const res = await api.put("/action/put-approval-status", {
        targetId: targetId.syllabusId,
        status,
      });
      log(res);

      setIsSaveLoading(false);
      setIsSyllabusModalOpen(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  useEffect(() => {
    async function getSyllabus() {
      try {
        const res = await api.get("/admin/get-syllabus", {
          params: { targetId: targetId.syllabusId },
        });
        log(res);

        const payload = res.data.payload;

        setSyllabus(payload.syllabus);
        setSchedules(payload.schedules);
        setOutcomes(payload.outcomes);
        setCoverages(payload.coverages);
        setRefBooks(payload.refBooks);
        setPrevModules(payload.prevModules);
        setWebRefs(payload.webRefs);
        setPreparedBy(payload.preparedBy);
      } catch (err) {
        error(err);
      }
    }

    if (role !== "Student" && targetId.syllabusId) getSyllabus();
  }, []);

  useEffect(() => {
    async function getSyllabus() {
      try {
        const res = await api.get("/user/get-syllabus", {
          params: { targetId: targetId.syllabusId },
        });
        log(res);

        const payload = res.data.payload;

        setSyllabus(payload.syllabus);
        setSchedules(payload.schedules);
        setOutcomes(payload.outcomes);
        setCoverages(payload.coverages);
        setRefBooks(payload.refBooks);
        setPrevModules(payload.prevModules);
        setWebRefs(payload.webRefs);
        setPreparedBy(payload.preparedBy);

        setIsSaveLoading(false);
      } catch (err) {
        error(err);

        setIsSaveLoading(false);
      }
    }

    if (role === "Student" && targetId.syllabusId) getSyllabus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function getCourseCodes() {
      try {
        const res = await api.get("/admin/get-course-codes", {
          params: { programName: syllabus.programName },
          signal: controller.signal,
        });
        log(res);

        const payload = res.data.payload;

        setCourseCodes(payload);
      } catch (err) {
        error(err);
      }
    }

    if (role && syllabus.programName) getCourseCodes();

    return () => {
      controller.abort();
    };
  }, [syllabus.programName]);

  useEffect(() => {
    setIsSubmittable(
      Object.entries(syllabus).every(
        ([key, value]) => key === "prerequisite" || value,
      ) &&
        schedules.length > 0 &&
        outcomes.length > 0 &&
        coverages.length === 18 &&
        refBooks.length > 0 &&
        prevModules.length > 0 &&
        webRefs.length > 0,
    );
  }, [
    syllabus,
    schedules,
    outcomes,
    coverages,
    refBooks,
    prevModules,
    webRefs,
  ]);

  return (
    <Backdrop
      onClick={
        selectedCourseCodes.length === 0
          ? handleClose
          : () => {
              setActionModalSettings({
                title: "Unsaved Changes",
                message: (
                  <>
                    <p>
                      You have unsaved changes related to the student&apos;s
                      enrollment.
                    </p>
                    <p className="text-red-600">
                      Exiting now will result in the loss of this information.
                    </p>
                  </>
                ),
                actionLabel: "Exit Without Saving",
                action: () => {
                  handleClose();
                  setIsActionModalOpen(false);
                },
              });
              setIsActionModalOpen(true);
            }
      }
    >
      <div className="h-full w-full q-scroll-pl md:w-9/12">
        <div className="py-10">
          <h1 className="mb-10 flex w-full justify-center text-center text-primary q-text-2xl">
            Syllabus
          </h1>
          <motion.div
            className="flex h-fit w-full flex-col items-center justify-center gap-5 rounded-3xl font-bold text-tertiary"
            onClick={(e) => e.stopPropagation()}
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex h-fit w-full">
              <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-secondary">
                <div className="flex h-20 items-center justify-between gap-10 q-text-base">
                  <div className="scrollable-div flex h-full w-full items-center gap-2 overflow-hidden overflow-x-scroll rounded-3xl px-7">
                    {programEnrollmentSubTabs.map((subTab, index) => (
                      <button
                        className="h-full whitespace-nowrap p-3 pb-0 text-tertiary hover:text-tertiary/80"
                        onClick={() => setCurrentModalTab(subTab)}
                        key={index}
                      >
                        {subTab}
                        <div
                          className={`${currentModalTab === subTab ? "visible" : "invisible"} h-1 w-full rounded-full bg-tertiary`}
                        />
                      </button>
                    ))}
                    {isEditable && (
                      <div className="mt-3 ml-5 flex justify-end w-full">
                        <button
                          className="flex h-10 w-fit items-center justify-center gap-5 whitespace-nowrap bg-highlight px-5 text-primary q-text-sm q-rounded-xl hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                          onClick={() => saveSyllabus()}
                          disabled={isSaveLoading || !isSubmittable}
                        >
                          Submit Syllabus
                          {isSaveLoading && <Loading />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex h-fit w-full justify-center rounded-3xl bg-white">
                  <div className="q-p-20 flex h-full w-full flex-col items-center q-gap-20 q-text-sm">
                    {currentModalTab === "Overview" && (
                      <OverviewTab
                        handleSyllabusChange={handleSyllabusChange}
                        syllabus={syllabus}
                        courseCodes={courseCodes}
                        schedules={schedules}
                        setSchedules={setSchedules}
                        isEditable={isEditable}
                      />
                    )}
                    {currentModalTab === "Objectives" && (
                      <ObjectivesTab
                        handleSyllabusChange={handleSyllabusChange}
                        selectedOutcome={selectedOutcome}
                        setSelectedOutcome={setSelectedOutcome}
                        outcomes={outcomes}
                        setOutcomes={setOutcomes}
                        isEditable={isEditable}
                      />
                    )}
                    {currentModalTab === "University Info" && (
                      <UniversityInfo />
                    )}
                    {currentModalTab === "Details" && (
                      <DetailsTab
                        handleSyllabusChange={handleSyllabusChange}
                        selectedCoverages={selectedCoverages}
                        setSelectedCoverages={setSelectedCoverages}
                        coverages={coverages}
                        setCoverages={setCoverages}
                        syllabus={syllabus}
                        isEditable={isEditable}
                      />
                    )}
                    {currentModalTab === "Resources" && (
                      <ResourcesTab
                        selectedRefBook={selectedRefBook}
                        setSelectedRefBook={setSelectedRefBook}
                        refBooks={refBooks}
                        setRefBooks={setRefBooks}
                        selectedPrevModule={selectedPrevModule}
                        setSelectedPrevModule={setSelectedPrevModule}
                        prevModules={prevModules}
                        setPrevModules={setPrevModules}
                        selectedWebRef={selectedWebRef}
                        setSelectedWebRef={setSelectedWebRef}
                        webRefs={webRefs}
                        setWebRefs={setWebRefs}
                        isEditable={isEditable}
                      />
                    )}
                    {currentModalTab === "Policies" && <PoliciesTab />}
                    {currentModalTab === "History" && (
                      <HistoryTab preparedBy={preparedBy} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {currentTab === "Syllabus Management" && (
              <div className="flex w-full justify-between gap-10 rounded-3xl bg-white p-10 px-20 text-primary q-text-base">
                <button
                  className="bg-tertiary px-8 py-4 q-rounded-2xl hover:bg-tertiary/50"
                  onClick={() => {
                    setIsActionModalOpen(true);
                    setActionModalSettings({
                      title: `Reject Syllabus ${role === "Coordinator" ? "Evaluation" : "Approval Request"}`,
                      message: (
                        <>
                          <p>
                            Are you sure you want to reject the syllabus
                            {role === "Coordinator"
                              ? "evaluation"
                              : "approval request"}
                            ?
                          </p>
                          <p className="text-red-600">
                            This action cannot be undone.
                          </p>
                        </>
                      ),
                      actionLabel: "Reject",
                      action: () => {
                        setIsActionModalOpen(false);
                        {
                          role === "Coordinator"
                            ? putEvaluationStatus("Rejected")
                            : putApprovalStatus("Rejected");
                        }
                      },
                    });
                  }}
                >
                  Reject Syllabus
                </button>
                <button
                  className="bg-highlight px-8 py-4 q-rounded-2xl hover:bg-highlight-light"
                  onClick={() => {
                    setIsActionModalOpen(true);
                    setActionModalSettings({
                      title: "Approve Syllabus Evaluation",
                      message: (
                        <p>
                          Are you sure you want to approve the syllabus{" "}
                          {role === "Coordinator"
                            ? "evaluation"
                            : "approval request"}
                          ?
                        </p>
                      ),
                      actionLabel: "Approve",
                      action: () => {
                        setIsActionModalOpen(false);
                        {
                          role === "Coordinator"
                            ? putEvaluationStatus("Approved")
                            : putApprovalStatus("Approved");
                        }
                      },
                    });
                  }}
                >
                  Approve Syllabus
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Backdrop>
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
