import { motion } from "framer-motion";
import PropTypes from "prop-types";

InputModal.propTypes = {
  message: PropTypes.node.isRequired,
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

export default function InputModal({ message }) {
  return (
    <div className="absolute w-full top-full mt-5">
      <motion.div
        className="m-auto flex w-fit flex-col items-center justify-center bg-primary p-6 font-bold text-tertiary drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] q-rounded-xl"
        onClick={(e) => e.stopPropagation}
        variants={popIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.25 }}
      >
        <div className="absolute -top-2 z-0 border-b-8 border-l-8 border-r-8 border-b-primary border-l-transparent border-r-transparent"></div>
        <div className="flex items-center justify-center q-text-base">
          {message}
        </div>
      </motion.div>
    </div>
  );
}
