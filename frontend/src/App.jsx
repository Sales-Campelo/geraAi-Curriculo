import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

import AdSlot from "./components/AdSlot";
import Header from "./components/Header";
import { SessionProvider } from "./context/SessionContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CareerPlanPage from "./pages/CareerPlanPage";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import ResultPage from "./pages/ResultPage";
import ResumePage from "./pages/ResumePage";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <SessionProvider>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/entrevista" element={<PageTransition><InterviewPage /></PageTransition>} />
          <Route path="/resultado" element={<PageTransition><ResultPage /></PageTransition>} />
          <Route path="/curriculo" element={<PageTransition><ResumePage /></PageTransition>} />
          <Route path="/plano-carreira" element={<PageTransition><CareerPlanPage /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <footer style={{ padding: "24px 20px" }}>
        <AdSlot label="Banner horizontal de rodapé" style={{ height: 90, maxWidth: 880, margin: "0 auto" }} />
      </footer>
    </SessionProvider>
  );
}
