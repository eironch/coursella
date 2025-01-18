import { AnimatePresence } from "framer-motion";

import SyllabusModal from "../components/SyllabusModal.jsx";

SyllabusPage.propTypes = {};

export default function SyllabusPage() {

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-secondary font-montserrat">
      <div className="absolute left-0 z-0 h-[100vh] w-[100vh] rounded-full bg-[radial-gradient(circle,_rgba(19,71,19,0.80),_rgba(19,71,19,0),_rgba(19,71,19,0))] opacity-55" />
      <AnimatePresence initial={false} mode="wait">
          <SyllabusModal
            handleClose={() => {}}
            isEditable={false}
          />
      </AnimatePresence>
    </div>
  );
}
