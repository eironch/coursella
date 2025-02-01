import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

import { useAppContext } from "../context/AppContext.jsx";

import Backdrop from "./Backdrop.jsx";
import InputField from "./InputField.jsx";
import Lottie from "lottie-react";

import LoadingAnimation from "../assets/loading.json";

MessagesModal.propTypes = {
  targetId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  recipient: PropTypes.object.isRequired,
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

export default function MessagesModal({ handleClose, targetId, recipient }) {
  const { api, log, error, userId } = useAppContext();
  const containerRef = useRef(null);

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function postMessage() {
    setIsSaveLoading(true);

    try {
      const res = await api.post("/create/post-message", {
        recipientId: targetId,
        senderId: userId,
        message,
      });
      log(res);

      const payload = res.data.payload;

      setMessage("");
      setMessages(payload);

      setIsSaveLoading(false);
    } catch (err) {
      error(err);

      setIsSaveLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function getMessages() {
      try {
        const res = await api.get("/admin/get-messages", {
          params: {
            recipientId: targetId,
            senderId: userId,
          },
          signal: controller.signal,
        });
        log(res);

        const payload = res.data.payload;

        setMessages(payload);
      } catch (err) {
        error(err);
      }
    }

    getMessages();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Backdrop onClick={handleClose} containerRef={containerRef}>
      <div className="h-full md:w-7/12 q-scroll-pl w-full">
        <div className="py-10">
          <h1 className="mb-10 flex w-full justify-center text-center text-primary q-text-2xl">
            Message
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
                <div className="flex h-fit w-full justify-center rounded-3xl bg-white">
                  <div className="flex h-full w-full flex-col items-center q-text-sm">
                    <div className="flex h-full w-full items-center gap-5 rounded-t-2xl bg-secondary q-px-10 py-5">
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
                          <p className="q-text-lg">{recipient.fullName}</p>
                          <p className="q-text-sm">{recipient.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex min-h-[400px] w-full flex-col justify-end rounded-b-2xl border-2 border-t-0 border-secondary pt-5">
                      {messages.length > 0 &&
                        messages.map((message, index) => (
                          <div className="q-px-10 py-2.5" key={index}>
                            <div
                              className={`${message.messageType === "sent" && "justify-end"} flex w-full`}
                            >
                              <div
                                className={`${message.messageType === "sent" ? "rounded-br-none" : "rounded-bl-none"} rounded-2xl bg-secondary p-5`}
                              >
                                {message.message}
                              </div>
                            </div>
                            <div
                              className={`${message.messageType === "sent" && "justify-end"} flex pt-1`}
                            >
                              {message.createdDate
                                .replace("T", " ")
                                .slice(0, -5)}
                            </div>
                          </div>
                        ))}
                      {messages.length === 0 && (
                        <div className="flex h-full w-full items-center justify-center">
                          No Messages
                        </div>
                      )}
                      <div className="flex w-full flex-col">
                        <div className="mt-5 flex items-center gap-5 bg-secondary p-5">
                          <div className="w-fit rounded-2xl bg-highlight p-3 text-primary">
                            Messaging:
                          </div>
                          {recipient.fullName} - {recipient.role}
                        </div>
                        <div className="flex gap-5 md:flex-row flex-col border-t-2 p-5 q-px-10">
                          <InputField
                            labelText=""
                            placeholder="Enter message"
                            name="message"
                            value={message}
                            setValue={(e) => setMessage(e.target.value)}
                            type="text"
                            attr="w-full"
                            disabled={false}
                          />
                          <button
                            className="flex h-10 md:w-fit items-center justify-center gap-5 whitespace-nowrap bg-highlight px-5 text-primary q-text-sm q-rounded-xl hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                            onClick={() => postMessage()}
                            disabled={isSaveLoading || !message}
                          >
                            Send Message
                            {isSaveLoading && <Loading />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
