import PropTypes from "prop-types";
import { useEffect } from "react";

import { useAppContext } from "../../context/AppContext";

Messages.propTypes = {
  setTargetId: PropTypes.func.isRequired,
  setIsMessageModalOpen: PropTypes.func.isRequired,
  setRecipient: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  setRecipients: PropTypes.func.isRequired,
  setFilteredRecipients: PropTypes.func.isRequired,
};

export default function Messages({
  setTargetId,
  setIsMessageModalOpen,
  setRecipient,
  recipients,
  setRecipients,
  setFilteredRecipients,
}) {
  const { api, log, error, userId } = useAppContext();

  useEffect(() => {
    const controller = new AbortController();

    async function getRecipients() {
      try {
        const res = await api.get("/admin/get-recipients", {
          params: {
            targetId: userId,
          },
          signal: controller.signal,
        });
        log(res);

        const payload = res.data.payload;
        
        payload.forEach((payload) => {
          if (!payload.profileImage) return;

          const byteArray = new Uint8Array(payload.profileImage.data);
          payload.profileImage = new Blob([byteArray], { type: "image/png" });
        });

        setRecipients(payload);
        setFilteredRecipients(payload);
      } catch (err) {
        error(err);
      }
    }

    getRecipients();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="q-p-20 w-full">
      <div className="flex w-full flex-col gap-10">
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Recent Messages
        </h2>
        <div className="flex w-full flex-col gap-5">
          {recipients.map((recipient, index) => (
            <div
              className="flex h-full w-full cursor-pointer items-center gap-5 border-2 border-secondary p-5 q-rounded-3xl hover:bg-secondary"
              onClick={() => {
                setTargetId(recipient.recipientId);
                setIsMessageModalOpen(true);
                setRecipient({
                  fullName: recipient.fullName,
                  role: recipient.role,
                });
                setRecipients(
                  recipients.map((prevRecipient) =>
                    prevRecipient.userId === recipient.userId
                      ? { ...prevRecipient, isRead: true }
                      : { ...prevRecipient },
                  ),
                );
              }}
              key={index}
            >
              <div className="h-20 w-20 flex-none rounded-full bg-white p-1">
                <img
                  className="h-full w-full rounded-full object-cover"
                  src={
                    recipient.profileImage &&
                    URL.createObjectURL(recipient.profileImage)
                  }
                />
              </div>
              <div className="flex w-full items-center">
                <div className="flex w-full flex-col gap-1">
                  <p className="q-text-base">{recipient.fullName}</p>
                  <p className="q-text-sm">{recipient.role}</p>
                </div>
                <div className="flex gap-5 whitespace-nowrap pr-5 q-text-sm">
                  {/* {recipient.createdDate} */}
                  {!recipient.isRead && (
                    <div className="aspect-square rounded-full bg-red-600 p-2" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
