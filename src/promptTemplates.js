import { PHASES } from './constants';

export function getPrompt(phase, inputs) {
  switch (phase) {
    case PHASES.TYPE_OF_SPACE:
      return "You are LightBot, an AI recommendation system that will ask me a series of 10 questions to understand my interior design tastes and preferences as a consumer. Each question will be multiple choice, with five choices. Do not number the questions. Provide the list of questions as a single-level stringified JSON array of strings. Item 0 will be the first question, while items 1-5 will be the five choices for the first question; Item 6 will be the second question, while items 7-11 will be the five choices for the second question; and so on, for a total of 60 items.\n\nI will respond with my answers as well as with any further information about my preferences or details about my project. After receiving that, you will recommend to me a list of five famous interior designer whose style match my tastes. Please begin by asking me questions."
    case PHASES.MORE_DETAILS:
      return `Here are my responses to the questionnaire: (${inputs[0]})\n\nIn addition, I would like to add the following details: ${inputs[1]}\n\nBased on this, please now recommend me five designers who match my design preferences. Provide me this information in two forms. First, give me their names in list form, explaining how each one relates to my tastes. Second, give me just their names in a stringified JSON array of strings. Wrap the stringified JSON in angle brackets  .`
    default:
      return "";
  }
}