export const scanAndMoveContestAnswers = (contestPart) => {
  const part = parseInt(contestPart.part)
  contestPart.part = part;
  if (part < 1 || part > 7)
    throw "The part must be an integer between 1 and 7.";

  const answers = [];
  if ([3, 4, 6, 7].includes(part))
    contestPart?.resource?.paragraphs?.forEach?.(p => {
      p?.questions?.forEach?.(q => {
        const answer = q?.answer?.toUpperCase?.();
        if (answer) {
          q.id = answers.length;
          answers.push(answer);
          delete q.answer
        }
        else
          throw "There are unanswered questions."
      })
    })
  else
    contestPart?.resource?.questions?.forEach?.(q => {
      const answer = q?.answer?.toUpperCase?.();
      if (answer) {
        q.id = answers.length;
        answers.push(answer);
        delete q.answer
      }
      else
        throw "There are unanswered questions."
    })

  contestPart.answers = answers;
}


export const validateContestPart = (contestPart) => {
  if (!contestPart?.title)
    throw "The 'title' field is required."

  if (!(contestPart?.part && contestPart?.resource && contestPart?.answers && contestPart?.title))
    throw "Not enough information";


  const part = parseInt(contestPart.part)
  contestPart.part = part;
  if (part < 1 || part > 7)
    throw "The part must be an integer between 1 and 7.";

  if (!Array.isArray(contestPart.answers))
    throw "The 'answers' must be an array.";
  contestPart.answers = contestPart.answers.map(ans => ans.toUpperCase());

  try {
    // Validation for each parts
    specificPartValidators[part - 1](contestPart);
  }
  catch (error) {
    throw `In part ${part}: ${error}`;
  }

  return true;
}

const validateQuestionsBase = (contestPart) => {
  const { resource, answers } = contestPart;

  if (!Array.isArray(resource.questions))
    throw "resource 'questions' is required and must be an array.";
  if (answers.length !== resource.questions.length)
    throw "the number of answers must match with that of questions."
}

const validateParagraphsBase = (contestPart) => {
  const { resource, answers } = contestPart;

  if (!Array.isArray(resource.paragraphs))
    throw "resource 'paragraphs' is required and must be an array."
  if (!resource.paragraphs.every(p => Array.isArray(p?.questions)))
    throw "each paragraph must contain an array of questions."

  const numberOfQuestions = resource.paragraphs.map(p => p?.questions?.length ?? NaN).reduce((a, b) => a + b, 0);
  if (answers.length !== numberOfQuestions)
    throw "the number of answers must match with that of questions."
}

const validateAnswerRangeBase = (contestPart, acceptedAnswers = []) => {
  const { answers } = contestPart;

  if (!answers.every(ans => acceptedAnswers.includes(ans)))
    throw `answers must only be either ${acceptedAnswers.join(', ')} (case insensitive)`
}

const validateContestPart1 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C', 'D']);
  validateQuestionsBase(contestPart);

  const { resource } = contestPart;
  if (!resource.questions.every(q => q?.audio && q?.image))
    throw "each question must contain an audio and an image."

  return true;
}

const validateContestPart2 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C']);
  validateQuestionsBase(contestPart);

  const { resource } = contestPart;

  if (!resource.questions.every(q => q?.audio))
    throw "each question must contain an audio."

  return true;
}

const validateContestPart3 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C', 'D']);
  validateParagraphsBase(contestPart);

  const { resource } = contestPart;

  resource.paragraphs.forEach(p => {
    if (!p?.audio)
      throw "each paragraph must contain an audio."

    p.questions.forEach(q => {
      if (!q?.question)
        throw "each question must have a 'question' field"
      if ((!Array.isArray(q?.options)) || (q.options.filter(o => o).length !== 4))
        throw "each question must have exactly 4 options."
    })
  })

  return true;
}

const validateContestPart4 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C', 'D']);
  validateParagraphsBase(contestPart);

  const { resource } = contestPart;

  resource.paragraphs.forEach(p => {
    if (!p?.audio)
      throw "each paragraph must contain an audio."

    p.questions.forEach(q => {
      if (!q?.question)
        throw "each question must have a 'question' field"
      if ((!Array.isArray(q?.options)) || (q.options.filter(o => o).length !== 4))
        throw "each question must have exactly 4 options."
    })
  })

  return true;
}

const validateContestPart5 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C', 'D']);
  validateQuestionsBase(contestPart);

  const { resource } = contestPart;

  resource.questions.forEach(q => {
    if (!q?.question)
      throw "each question must have a 'question' field"
    if ((!Array.isArray(q?.options)) || (q.options.filter(o => o).length !== 4))
      throw "each question must have exactly 4 options."
  })

  return true;
}

const validateContestPart6 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C', 'D']);
  validateParagraphsBase(contestPart);

  const { resource } = contestPart;

  resource.paragraphs.forEach(p => {
    if (!p?.paragraph)
      throw "each paragraph must contain a 'paragraph' field."

    p.questions.forEach(q => {
      if ((!Array.isArray(q?.options)) || (q.options.filter(o => o).length !== 4))
        throw "each question must have exactly 4 options."
    })
  })

  return true;
}

const validateContestPart7 = (contestPart) => {
  validateAnswerRangeBase(contestPart, ['A', 'B', 'C', 'D']);
  validateParagraphsBase(contestPart);

  const { resource } = contestPart;

  resource.paragraphs.forEach(p => {
    if (!p?.paragraph)
      throw "each paragraph must contain a 'paragraph' field."

    p.questions.forEach(q => {
      if (!q?.question)
        throw "each question must have a 'question' field"
      if ((!Array.isArray(q?.options)) || (q.options.filter(o => o).length !== 4))
        throw "each question must have exactly 4 options."
    })
  })

  return true;
}

const specificPartValidators = [
  validateContestPart1,
  validateContestPart2,
  validateContestPart3,
  validateContestPart4,
  validateContestPart5,
  validateContestPart6,
  validateContestPart7,
]