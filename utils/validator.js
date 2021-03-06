//Verify that the comment does not contain any offensive words

exports.validator = function (comment, offensiveWords) {
  let isIncluded = false;
  let forbiddenWords = [];
  offensiveWords.forEach(word => {
    const commentToLowerCase = comment.toLowerCase();
    if (commentToLowerCase.includes(word.badword.toLowerCase())) {
      forbiddenWords.push(word);
      isIncluded = true;
    }
  });

  return { isIncluded, forbiddenWords };
};
