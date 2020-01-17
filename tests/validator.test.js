
const validator = require('../validator.js');
const badWords = require('../defBadWords.js');

describe('comments validator', () => {
    test('verify that the comment has forbidden words', () => {
        const comment = 'hello bitch';
        const input = validator.validator(comment, badWords)
        expect(input.isIncluded).toBeTruthy();
    });
    test('verify that the comment does not contain prohibited words', () => {
        const comment = 'hello people';
        const input = validator.validator(comment, badWords)

        expect(input.isIncluded).toBeFalsy();

    });
    test('verify that the comment has forbidden words in UPPERCASE', () => {
        const comment = 'hello BITCH';
        const input = validator.validator(comment, badWords)
        expect(input.isIncluded).toBeTruthy();
    })
});