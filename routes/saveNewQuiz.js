const Quiz = require('../quizModels/quizForm.js');
const express = require('express');
const { connectToMongoDB } = require('../connections/connectToDB.js');
const router = express.Router();

// Route to save a quiz model instance to designated DB collection
router.post('/quizForm/save', async (req, res) => {
    try {   
        const { collection } = await connectToMongoDB();

        /* Extracting form data and mapping it to the structure of the Quiz model to ensure correct
            structure that the model expects */
        const quizData = 
        {
            quizName: req.body.quizName,
            quizForm: req.body.quizSet.map((question) => {
                return {
                    question: question.question,
                    correctAnswer: question.correctAnswer,
                    fakeAnswers: [question.fakeAnswer1, question.fakeAnswer2, question.fakeAnswer3],
                };
            }),
        };

        const saveResult = await collection.insertOne(new Quiz(quizData));

        if (saveResult.acknowledged === true) 
        {
            res.json({ message: 'Successfully added', data: saveResult });
            console.log(saveResult);
        } 
        
        else 
        {
            res.json({ message: 'Failed to add' });
        }
    } 
    
    catch (err) 
    {
        res.status(500).json({ error: err });
        console.error('Failed to save to DB:', err);
    }
});

module.exports = router;