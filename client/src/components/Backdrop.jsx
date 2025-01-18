import { motion } from "framer-motion";
import PropTypes from "prop-types";

Backdrop.propTypes = {
  onClick: PropTypes.func.isRequired,
  containerRef: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default function Backdrop({ onClick, containerRef, children }) {
  return (
    <motion.div
      className="scrollable-div absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center overflow-y-scroll overflow-x-hidden bg-black bg-opacity-50 pr-0 backdrop-blur-sm"
      onClick={onClick}
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
