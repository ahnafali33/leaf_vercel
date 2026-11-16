import React from "react";
import QuizModal from "../components/QuizModal";
import { motion } from "motion/react";

export default function PlantFinderPage() {
  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10"
    >
      <QuizModal />
    </motion.div>
  );
}
