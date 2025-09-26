// components/SectionBreaker.jsx
import React from "react";
import { motion } from "framer-motion";

const SectionBreaker = ({ text, bgGradient }) => {
  return (
    <section className={`w-full py-2 flex items-center justify-center ${bgGradient}`}>
      <div className="max-w-2xl text-center px-4">
        <motion.p
          className="text-lg sm:text-xl md:text-2xl font-semibold text-white"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
};

export default SectionBreaker;
