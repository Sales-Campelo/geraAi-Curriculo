import api from "./client";

export const analyzeJob = (jobDescription, sessionId) =>
  api.post("/jobs/analyze/", { job_description: jobDescription, session_id: sessionId });

export const startInterview = (jobAnalysisId, sessionId) =>
  api.post("/interviews/start/", { job_analysis_id: jobAnalysisId, session_id: sessionId });

export const sendInterviewMessage = (interviewId, message) =>
  api.post("/interviews/message/", { interview_id: interviewId, message });

export const generateResume = (interviewId) =>
  api.post("/resumes/generate/", { interview_id: interviewId });

export const getResume = (resumeId) => api.get(`/resumes/${resumeId}/`);

export const generateCareerPlan = (resumeId) =>
  api.post("/career-plan/generate/", { resume_id: resumeId });

export const sendFeedback = (payload) => api.post("/feedback/", payload);

export const getStatistics = () => api.get("/statistics/");

export const listResumes = (sessionId) =>
  api.get("/resumes/", { params: { session_id: sessionId } });

export const updateResumeStatus = (resumeId, status) =>
  api.patch(`/resumes/${resumeId}/status/`, { status });
