import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Lottie from "lottie-react";

import heckMarkAnimation from "../assets/checkmark.json";
import Backdrop from "./Backdrop.jsx";

ResultModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.element.isRequired,
  modalIcon: PropTypes.string.isRequired,
};

const popIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1.005,
    opacity: 1,
    transition: {
      duration: 0.05,
      type: "spring",
      damping: 50,
      stiffness: 300,
    },
  },
  exit: { scale: 0.9, opacity: 0 },
};

export default function ResultModal({
  handleClose,
  title,
  message,
  modalIcon,
}) {
  const [animateLottie, setAnimateLottie] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateLottie(true);
    }, 250);

    return () => clearTimeout(timeout);
  });

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        className="q-gap-10 p-10 ml-3 flex w-full md:max-w-fit flex-col items-center justify-center rounded-3xl bg-primary font-bold text-tertiary sm:w-10/12 md:m-auto md:w-[40rem]"
        variants={popIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="h-20 w-20 rounded-full bg-highlight">
          {animateLottie && modalIcon === "Checkmark" && <Checkmark />}
        </div>
        <div className="flex flex-col items-center justify-center text-center q-gap-5">
          <h1 className="q-text-2xl">{title}</h1>
          <div className="q-text-base">{message}</div>
        </div>
      </motion.div>
    </Backdrop>
  );
}

function Checkmark() {
  return (
    <Lottie
      animationData={heckMarkAnimation}
      loop={false}
      style={{ width: 80, height: 80 }}
    />
  );
}
