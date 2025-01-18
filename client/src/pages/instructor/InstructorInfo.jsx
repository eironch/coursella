import { useEffect } from "react";
import PropTypes from "prop-types";

import { useAppContext } from "../../context/AppContext.jsx";

import Information from "../../components/Information.jsx";

InstructorInfo.propTypes = {
  handleChange: PropTypes.func.isRequired,
  instructorRecord: PropTypes.object.isRequired,
  setInstructorRecord: PropTypes.func.isRequired,
  setInstructorRecordOld: PropTypes.func.isRequired,
  isEditingRecord: PropTypes.bool.isRequired,
  instructorInfoSubTabs: PropTypes.array.isRequired,
  currentSubTab: PropTypes.string.isRequired,
};

export default function InstructorInfo({
  handleChange,
  instructorRecord,
  setInstructorRecord,
  setInstructorRecordOld,
  isEditingRecord,
  instructorInfoSubTabs,
  currentSubTab,
}) {
  const { api, log, error, userId } = useAppContext();

  useEffect(() => {
    const controller = new AbortController();

    async function getInstructorRecord() {
      try {
        const res = await api.get("/admin/get-instructor-record", {
          params: { targetId: userId },
          signal: controller.signal,
        });
        log(res);

        const payload = res.data.payload;

        if (payload.profileImage) {
          const byteArray = new Uint8Array(payload.profileImage.data);
          payload.profileImage = new Blob([byteArray], { type: "image/png" });
        }

        setInstructorRecord(payload);
        setInstructorRecordOld(payload);
      } catch (err) {
        error(err);
      }
    }

    getInstructorRecord();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return (
    <div className="q-p-20 flex w-full md:w-11/12">
      <Information
        data={instructorRecord}
        handleChange={handleChange}
        criteria={instructorInfoSubTabs}
        value={currentSubTab}
        disabled={!isEditingRecord}
      />
    </div>
  );
}
