const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require('express-validator');

// route 1: get all the notes using get:"/api/auth/getuser".login requirred;
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        return res.status(200).json({ notes });
    }
    catch (error) {
        return res.status(500).json({ notes });
    }
});

//router 2:get all the notes using get:"/api/notes/postuser"login required 
// router.post("/addnote", fetchuser, [
//     body('title').withMessage('Enter valid title').notEmpty().withMessage('title is required'),
//     body('description').isEmail().withMessage('Email must be valid').notEmpty().withMessage('Email is required'),
// ], async (req, res) => {
//     const errors=validationResult(req); 
//     const{title,description,tag}=req.body;
//     if(!errors.isEmpty()) 
//     {
//         return res.status(400).json({errors:errors.array()}); 
//     } 
//     const note=new Notes({ 
//        title,description,tag,user:req.user.id
//     });
//     await note.save();
// }); 

router.post("/addnote", fetchuser, [
    body('title').notEmpty().withMessage('Title is required'),  // Fixed validation for title
    body('description').notEmpty().withMessage('Description is required'),  // Fixed validation for description
], async (req, res) => {
    // If there are validation errors show the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the data from the body
    const { title, description, tag } = req.body;

    try {
        // Create a new note
        const newNote = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        await newNote.save();

        return res.status(201).json({ message: 'Note added successfully', newNote });  // Return 201 on successful creation
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//route 3: update an existing note using :put "/api/note/updatenote login required. "
// we can use post request for updation but here we will use put for updation  
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create a new note object 
        const newnote = {};
        //if title or description present by the user then only update 
        if (title) { newnote.title = title };
        if (description) { newnote.description = description };
        if (tag) { newnote.tag = tag };

        //find the note to be updated and update it  
        let note = await Notes.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: 'not found' });
        if (note.user.toString() != req.user.id)
            return res.status(401).json({ message: "not allowed" });
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        //$set:newnote is used so that the fields changed in the newnote are only changed in note and not the 
        // entire note doesnt copies the entire new note 
        //The findByIdAndUpdate behaves as follows =>
        //new: false (default)	returns The old/original document  
        //new: true	The new/updated document 
        return res.status(200).json({ message: "successfully updated", note: note });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//router 4:delete and existing note by using delete "/api/note/deletenote"  
// try {
//     router.delete("/deletenote/:id", fetchuser, async (req, res) => {
//         // find the note to be delete and delete it 
//         let note = await Notes.findById(req.params.id);
//         if (!note) { return res.status(404).send("Not found") };

//         //allow deletion if and only if user owns this
//         if (note.user.toString() !== req.user.id)
//             return res.status(401).send("Not allowed");

//         note = await Notes.findByIdAndDelete(req.params.id); 
//     }  
//     catch (error) {
//         console.error(error);
//         return res.status(200).json({ error: "internal server error" });
//     }
// });
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
      // Find the note by ID
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      // Check if the logged-in user owns the note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not allowed" });
      }
  
      // Delete the note
      await Notes.findByIdAndDelete(req.params.id);
  
      // Send success response
      res.status(200).json({ message: "Note has been successfully deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
module.exports = router;