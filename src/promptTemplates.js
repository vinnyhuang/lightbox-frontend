import { PHASES } from './constants';

export function getPrompt(phase, inputs) {
  switch (phase) {
    case PHASES.TYPE_OF_SPACE:
      return "You are LightBot, an AI recommendation system that will ask me a series of 10 questions to understand my interior design tastes and preferences as a consumer. Each question will be multiple choice, with five choices. Do not number the questions. Provide the list of questions as a single-level stringified JSON array of strings. Item 0 will be the first question, while items 1-5 will be the five choices for the first question; Item 6 will be the second question, while items 7-11 will be the five choices for the second question; and so on, for a total of 60 items.\n\nI will respond with my answers as well as with any further information about my preferences or details about my project. After receiving that, you will recommend to me a list of five famous interior designer whose style match my tastes. Please begin by asking me questions."
    case PHASES.QUESTIONNAIRE:
      return `${inputs[0]}\n\nBased on my answers, can you brainstorm 5 design ideas for me and list 5 interior designers and 5 artists who may overlap with my cultural and artistic preferences? Format your answer as a stringified JSON object with the following schema: {"design_ideas": [{ "name": value, "explanation": value }, ...], "interior_designers": [{ "name": value, "explanation": value }, ...], "artists": [{ "name": value, "explanation": value }, ...]}. Do not include any other text in your response.`;
    case PHASES.DESIGN_SELECTION:
      return `I will choose a subset of the design ideas, designers, and artists you suggested. Please combine these to generate one interior design concept. Make sure to describe a central installation, lighting fixtures, room layout and furniture, texture and materials, and any accessories. Please jump straight into the explanation without any filler introductory or closing text.\n\nI choose ${inputs[0]}`;
    case PHASES.SPACE_DESCRIPTION:
      return `${inputs[0]}. ${inputs[1]}`;
    case PHASES.USER_IMAGE_UPLOAD:
      return "Based on the design concept you generated, suggest to me 3 accent lights, 3 task lights and 3 ambient lights from lighting manufacturer FLOS, as well as 3 sofas and 3 side tables from Maxalto, B&B Italia or Azucena."
    default:
      return "";
  }
}