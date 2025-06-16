
/**
 * Filters AI responses to extract only relevant interview content
 * Removes disclaimers, system instructions, and unnecessary context
 */

interface FilteredResponse {
  content: string;
  hasCodeTask: boolean;
  hasFollowUp: boolean;
}

export const filterAIResponse = (rawResponse: string): FilteredResponse => {
  if (!rawResponse) {
    return { content: rawResponse, hasCodeTask: false, hasFollowUp: false };
  }

  // Remove common AI disclaimers and system messages
  const disclaimerPatterns = [
    /I'm an AI (assistant|interviewer|language model)/gi,
    /As an AI (assistant|interviewer|language model)/gi,
    /Please note that I'm/gi,
    /It's important to note that/gi,
    /Remember that this is/gi,
    /This is a simulated interview/gi,
    /For the purpose of this interview/gi,
    /In a real interview setting/gi,
    /Disclaimer:/gi,
    /Note:/gi
  ];

  // Remove system instructions and meta content
  const systemPatterns = [
    /You are (an AI|conducting|interviewing)/gi,
    /Interview (Details|Context|Instructions):/gi,
    /Technology:/gi,
    /Experience Level:/gi,
    /Difficulty:/gi,
    /Previous conversation:/gi,
    /Candidate:/gi,
    /Interviewer:/gi,
    /As the interviewer,?/gi,
    /Keep responses? (concise|professional)/gi,
    /Format your response/gi
  ];

  // Remove section headers that are meant for system context
  const contextHeaders = [
    /^\s*Interview Context:\s*$/gm,
    /^\s*Context:\s*$/gm,
    /^\s*Background:\s*$/gm,
    /^\s*Instructions:\s*$/gm,
    /^\s*Guidelines:\s*$/gm
  ];

  let filtered = rawResponse;

  // Apply all filters
  [...disclaimerPatterns, ...systemPatterns, ...contextHeaders].forEach(pattern => {
    filtered = filtered.replace(pattern, '');
  });

  // Remove excessive line breaks and clean up formatting
  filtered = filtered
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ line breaks with 2
    .replace(/^\s*[-•]\s*/gm, '') // Remove bullet points at start of lines
    .trim();

  // Detect if response contains code tasks or follow-ups
  const hasCodeTask = /write\s+(code|function|method|algorithm)|implement|code\s+(challenge|example|snippet)/gi.test(filtered);
  const hasFollowUp = /follow[- ]?up|next\s+question|can\s+you\s+(also|explain|tell)/gi.test(filtered);

  // Extract main content by looking for question patterns
  const questionPatterns = [
    /(?:^|\n)\s*(?:Question|Q\d*)[:\s-]+(.+?)(?=\n\s*(?:Question|Q\d*)|$)/gis,
    /(?:^|\n)\s*\d+[\.)]\s*(.+?)(?=\n\s*\d+[\.)]|$)/gis,
    /Can you\s+.+?\?/gi,
    /How would you\s+.+?\?/gi,
    /What\s+(is|are|would|do)\s+.+?\?/gi,
    /Explain\s+.+?(?:\?|\.)/gi,
    /Describe\s+.+?(?:\?|\.)/gi
  ];

  // Try to extract the main question/content
  let mainContent = filtered;
  
  // If the response is very long, try to extract the core question
  if (filtered.length > 500) {
    for (const pattern of questionPatterns) {
      const matches = filtered.match(pattern);
      if (matches && matches.length > 0) {
        // Take the first substantial match
        const potentialContent = matches[0].trim();
        if (potentialContent.length > 20) {
          mainContent = potentialContent;
          break;
        }
      }
    }
  }

  // Final cleanup
  mainContent = mainContent
    .replace(/^\s*[-•*]\s*/gm, '') // Remove remaining bullets
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return {
    content: mainContent,
    hasCodeTask,
    hasFollowUp
  };
};

/**
 * Checks if a response appears to be a welcome/introduction message
 */
export const isWelcomeMessage = (content: string): boolean => {
  const welcomePatterns = [
    /welcome/gi,
    /hello/gi,
    /good\s+(morning|afternoon|evening)/gi,
    /nice\s+to\s+meet/gi,
    /let'?s\s+(begin|start)/gi,
    /ready\s+to\s+(start|begin)/gi,
    /interview\s+(process|will)/gi
  ];

  return welcomePatterns.some(pattern => pattern.test(content));
};

/**
 * Formats the filtered response for display
 */
export const formatInterviewResponse = (filtered: FilteredResponse): string => {
  let formatted = filtered.content;

  // Add appropriate formatting based on content type
  if (filtered.hasCodeTask) {
    // Ensure code tasks are clearly formatted
    formatted = formatted.replace(/code/gi, '**code**');
  }

  if (filtered.hasFollowUp) {
    // Add emphasis to follow-up questions
    formatted += '\n\n*Please provide your thoughts on this.*';
  }

  return formatted;
};
