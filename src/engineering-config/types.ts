export type OptionDetail = {
  whatIsIt: string;
  example: string;
  bestFor: string;
  considerations: string;
  recommendation: string;
  learnMore: string;
};

export type EngineeringOption = {
  id: string;
  label: string;
  detail: OptionDetail;
};

export type EngineeringQuestion = {
  id: string;
  title: string;
  description: string;
  question: string;
  options: EngineeringOption[];
};

export type EngineeringSectionId = "principles" | "decisions" | "conventions";

export type EngineeringSection = {
  id: EngineeringSectionId;
  title: string;
  description: string;
  questions: EngineeringQuestion[];
};

export type EngineeringConfigAnswers = Record<string, string>;

export type EngineeringConfigResult = {
  answers: EngineeringConfigAnswers;
  completed: boolean;
};
