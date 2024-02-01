const express = require('express');
const router = express.Router();

const { connectToMongoDB } = require('../connections/connectToDB.js');
const { ObjectId } = require('mongodb');

router.use(express.json());

router.delete('/deleteQuestion/:quizId/:questionId', async (req, res) => {
  try 
  {
    const { collection } = await connectToMongoDB();
    
    const quizId = req.params.quizId;
    const questionId = req.params.questionId;

    // Validate if quizId and questionId are valid ObjectIDs
    if (!ObjectId.isValid(quizId) || !ObjectId.isValid(questionId)) 
    {
      res.status(400).json({ error: 'Invalid quizId or questionId!' });
      return;
    }

    // Using $pull to remove the nested object from the collection
    const deleteResult = await collection.updateOne(
      { _id: new ObjectId(quizId) },
      { $pull: { quizForm: { _id: new ObjectId(questionId) } } }
    );

    if (deleteResult) 
    {
      res.status(200).json({ message: 'Deletion successful.' });
      console.log(`Successful Deletion!`)
    } 
    
    else 
    {
      res.status(404).json({ error: 'Deletion Error.' });
      console.log(`Couldn't Delete!`)
    }
  } 
  
  catch (err) 
  {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;