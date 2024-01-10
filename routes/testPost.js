// const express = require('express');
// const router = express.Router();
// const { connectToMongoDB } = require('../connections/connectToDB.js');        
// // testing, change this to whatever data parsing is needed after successful completion
// router.use(express.json());

// router.post("/testPost", async (req, res) => {
//     try
//     {
//         // collection = online Quiz System
//         const { collection } = await connectToMongoDB();
        
//         // testing save method .insertOne() for post route
//         const saveTest = req.body;
//         const saveResult = await collection.insertOne( saveTest );

//         // testing conditional statement with chosen method
//         if (saveResult.acknowledged === true)
//         {
//             res.status(200)
//                 .json({ message: `Test successful!, Received information and saved it to the database! Here is the unique ID for referencing: ${ saveResult.insertedId }` });
    
//             console.log(`Test Successful! Reference ID: ${ saveResult.insertedId }`);
//         }

//         else
//         {
//             res.status(404)
//                 .json({ message: `Test failed! Couldn't upload the data to the database` });
            
//             // console.log(`Test failed! Couldn't upload the data to the database `);
//         }
//     }

//     catch (error)
//     {
//         res.status(500)
//             .json({ message: `Test failed!. Couldn't connect to the database / save the data with the post route!: ${ error }` });

//         // console.log(`There was an error connecting to the database with the post route!`, error);
//     }
// });

// module.exports = router;