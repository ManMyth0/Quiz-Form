// this will be the mongoose schema model for how a quiz will be set up
// the quiz will allow for 1 question, 1 correct answer, and 3 incorrect answers to chosen from for now
// will add scalability for added questions, answers and fakeAnswers later on

const mongoose = require('mongoose');
// will store the type as mixed to allow for flexibility for question and answers to be numbers, strings etc...
// separated into object literals that are stored in an array

const quizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: [true, 'Please provide a name for the form'],
        unique: true    // help ensure each quiz name is unique
    },

    quizForm: [{
        question: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Please provide a question!'],
            unique: true    // help ensure each question is unique
        },

        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Please provide the correct answer here']
        },

        fakeAnswers: {
            type: [{
                type: mongoose.Schema.Types.Mixed,
                required: [true, 'Please provide the fake answers']
            }],

            required: true,
            // help ensure fakeAnswers has exactly three elements, change for scaling
            validate: {
                validator: function(value) {
                    return value.length === 3;
                },
                message: 'FakeAnswers array must contain exactly three elements'
            }
        }
    }]
});

const Quiz = mongoose.model('QuizForm', quizSchema);
module.exports = Quiz;