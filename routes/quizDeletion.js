const express = require('express');
const router = express.Router();

const { connectToMongoDB } = require('../connections/connectToDB.js');
const { ObjectId } = require('mongodb');

router.use(express.json());

router.delete('/deleteQuiz/:quizId', async (req, res) => {
  try 
  {
    const { collection } = await connectToMongoDB();
    
    const quizId = req.params.quizId;

    // Quiz deletion via quizId
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(quizId) });

    // Validation for a quizId
    if (!ObjectId.isValid(quizId)) 
    {
      res.status(400).json({ error: 'Invalid Quiz ID!' });
      return;
    }

    if (deleteResult.acknowledged === true) 
    {
      res.status(200).json({ message: 'Quiz Deletion successful.' });
      console.log(`Successful Quiz Deletion!`)
    } 
    
    else 
    {
      res.status(404).json({ error: 'Deletion Error.' });
      console.log(`Couldn't Delete!`)
    }
  } 
  
  catch (err) 
  {
    console.error('Error deleting Quiz:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
