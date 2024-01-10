const Quiz = require('../quizModels/quizForm.js');
const express = require('express');
const { connectToMongoDB } = require('../connections/connectToDB.js');
const router = express.Router();

router.post('/quizForm/save', async (req, res) => {
    try {
        const { collection } = await connectToMongoDB();

        // Extracting form data and mapping it to the structure of the Quiz model
        const quizData = {
            quizName: req.body.quizName,
            quizForm: [{
                question: req.body.question,
                correctAnswer: req.body.correctAnswer,
                fakeAnswers: [
                    req.body.fakeAnswers
                ]
            }]
        };

        const saveResult = await collection.insertOne(new Quiz(quizData));

        if (saveResult.acknowledged === true) 
        {
            res.json({ message: `Successfully added`, data: saveResult });
            console.log(saveResult);
        } 
        
        else 
        {
            res.json({ message: `Failed to add` });
        }
    } 
    
    catch (err) 
    {
        res.status(500).json({ error: err });
        console.error(`Failed to save to DB:`, err);
    }
});

module.exports = router;