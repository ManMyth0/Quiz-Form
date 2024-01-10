const express = require('express');
const router = express.Router();
const { connectToMongoDB } = require('../connections/connectToDB.js');
const { ObjectId } = require('mongodb');    // remove unless needed for use-case?

// change the middleware method to suit needs after test
router.use(express.json());

// testing .findOne() method with conditional statement using the unique ID 
router.get('/testGet/:id', async (req, res) => {
    try
    {
        const { collection } = await connectToMongoDB();
        const getInfo = await collection.findOne({ _id: new ObjectId(req.params.id) });

        // expanding the depth to see all the returned data. Arrays from the fakeAnswers weren't 
        // showing in the console because of depth issues
        console.dir(getInfo, {depth: null});
        if ( ObjectId.isValid(req.params.id) && getInfo )
        {    
            res.status(200)
                .json({ message: `Test successful! Information retrieved:`, data: getInfo });
    
            console.dir(`Test Successful!`);
        }

        else
        {
            res.status(404)
                .json({ message:`Test Failed! Couldn't find the requested object(s) or the entered ID was invalid.`});
            
                // console.log(`Test Failed! Couldn't find the requested object(s) or the entered ID was invalid.`);
        }

    }

    catch (error)
    {
        res.status(500)
        .json({ message:`Test failed! ${ error }` });

        console.log(`There was an error connecting to the database with the get route!`, error);
    }
});

module.exports = router;