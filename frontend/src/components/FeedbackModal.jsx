import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

import { sendFeedback } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

export default function FeedbackModal({ open, onClose }) {
  const { sessionId, resumeId } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!rating) return;
    setSending(true);
    try {
      await sendFeedback({
        rating,
        comment,
        session_id: sessionId,
        generated_resume_id: resumeId,
      });
      setSent(true);
      setTimeout(onClose, 1200);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-card"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
        >
          {sent ? (
            <p className="modal-success">Obrigado pelo seu feedback! 🎉</p>
          ) : (
            <>
              <h3>Como foi sua experiência?</h3>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={28}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    color={(hoverRating || rating) >= star ? "#10B981" : "#cbd5e1"}
                    style={{ cursor: "pointer", marginRight: 4 }}
                  />
                ))}
              </div>
              <textarea
                placeholder="Conte o que achou (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="modal-textarea"
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>
                  Fechar
                </button>
                <button
                  className="btn-primary"
                  disabled={!rating || sending}
                  onClick={handleSubmit}
                >
                  {sending ? "Enviando..." : "Enviar Feedback"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
