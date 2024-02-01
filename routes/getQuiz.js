const express = require('express');
const router = express.Router();

const { connectToMongoDB } = require('../connections/connectToDB.js');
const { ObjectId } = require('mongodb');

router.use(express.json());
 
// Separate route to obtain a single quiz instance by object ID
router.get('/getQuiz/:id', async (req, res) => {
    try
    {
        const { collection } = await connectToMongoDB();
        const getInfo = await collection.findOne({ _id: new ObjectId(req.params.id) });

        // console.dir(getInfo, {depth: null});
        if ( ObjectId.isValid(req.params.id) && getInfo )
        {    
            res.status(200)
                .json({ message: `Success! Quiz Information retrieved:`, data: getInfo });
    
            console.log(`Successfully retrieved Quiz!`);
        }

        else
        {
            res.status(404)
                .json({ message:`Failed! Couldn't find the requested Quiz or the entered ID was invalid.`});
            
            console.log(`Failed! Couldn't find the requested Quiz or the entered ID was invalid.`);
        }

    }

    catch (error)
    {
        res.status(500)
        .json({ message:`Failed! ${ error }` });

        console.log(`There was an error connecting to the database with the get route!`, error);
    }
});

module.exports = router;