const express = require('express');
const router = express.Router();
const { connectToMongoDB } = require('../connections/connectToDB.js');
const { ObjectId } = require('mongodb');

router.use(express.json());

// PATCH route for both adding a question to the quizForm array and updating a quiz that already exists
router.patch('/updateQuiz/:quizId/:questionId?', async (req, res) => {
    const quizId = req.params.quizId;
    const questionId = req.params.questionId;

    try 
    {
        console.log('Received quizId:', quizId);
        console.log('Received questionId:', questionId);

        const { collection } = await connectToMongoDB();

        if (questionId) 
        {
            // Update existing question and ensure correct data structure
            const updateResult = await collection.findOneAndUpdate(
                { _id: new ObjectId(quizId), 'quizForm._id': new ObjectId(questionId) },
                {
                    $set: 
                    {
                        'quizForm.$[elem].question': req.body.question,
                        'quizForm.$[elem].correctAnswer': req.body.correctAnswer,
                        'quizForm.$[elem].fakeAnswers': req.body.fakeAnswers,
                    }
                },
                {
                    arrayFilters: [{ 'elem._id': new ObjectId(questionId) }],
                    returnDocument: 'after'
                }
            );

            if (updateResult) 
            {
                res.status(200).json({ message: 'Updated Successfully!' });
                console.log('Updated Successfully!');
            } 
            
            else 
            {
                res.status(404).json({ error: 'Could not save the requested Document!' });
                console.log('Document Could not be saved!');
            }
        
        } 
        
        else 
        {
            // Add new question when no questionId is passed and ensure a quizForm's object ID is generated by DB
            const newQuestion = {
                question: req.body.question,
                correctAnswer: req.body.correctAnswer,
                fakeAnswers: req.body.fakeAnswers,
                _id: new ObjectId()
            };

            // Using $push as the method to add a question to the quizForm array
            const addQuestionResult = await collection.findOneAndUpdate(
                { _id: new ObjectId(quizId) },
                {
                    $push: 
                    {
                        quizForm: newQuestion
                    }
                },
                {
                    returnDocument: 'after'
                }
            );

            if (addQuestionResult) 
            {
                res.status(200).json({ message: `Successfully updated!` });
                console.log('Successfully updated!');
            } 
            
            else 
            {
                res.status(404).json({ error: `Couldn't update the document!` });
                console.log(`Couldn't update the document!`);
            }
        }
    } 
    
    catch (err) 
    {
        res.status(500).json({ error: 'Internal server error' });
        console.error('There was an error trying to perform the update:', err);
    }
});

module.exports = router;
