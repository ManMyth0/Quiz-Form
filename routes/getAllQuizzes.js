const express = require('express');
const router = express.Router();

const { connectToMongoDB } = require('../connections/connectToDB.js');

router.use(express.json());

// Obtain all existing quizzes in a new page / tab
router.get('/getAllQuizzes', async (req, res) => {
    try
    {
        const { collection } = await connectToMongoDB();
        const returnedQuizData = await collection.find({}).toArray();

        if (returnedQuizData.length > 0) 
        {
            res.status(200)
                .json({ message: `Quizzes Found!`, data: returnedQuizData });

            console.log(`Success, all Quizzes have been retrieved!`);
        }

        else
        {
            res.status(404)
                .json({message: `There are no Quizzes to display!` });
            
            console.log(`No quizzes found!`);
        }
    }

    catch (err)
    {
        res.status(500)
            .json({ message: err });

        console.log(`Error using get route to access All Quizzes!`, err);
    }
});

module.exports = router;