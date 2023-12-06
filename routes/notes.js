const express=require('express');
const router=express.Router();
const Note= require("../models/Note");
const fetchuser=require("../middeware/fetchuser");
const {body,validationResult}=require('express-validator');
const { findByIdAndDelete } = require('../models/User');

router.get("/fetchallnotes" , fetchuser , async(req,res)=>{
    try {
        // console.log(req.id)
        const notes= await Note.find({user:req.id});
        // console.log(notes);
        return res.json(notes);
    } catch (error) {
        return res.status(500).send("oops")
    }
})

// insert notes

router.post("/addnote",fetchuser, [
    body('title' , 'Please enter the title').exists(),
    body('description', 'Description must be atleast 5 characters').isLength({min:5})
] ,async(req,res)=>{
    try {
        const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(400).json({
            errors:errors.array()
        });
    }
    const {title,description,tag}=req.body;
    const note=new Note({
        title:title,description,tag,user:req.id
    })
    const savednote=await note.save();
    
    //the create method also have  the same functionality a more concise and clean

    // const savednote=await Note.create({
    //     title,description,tag,user:req.id
    // })

    return res.send(savednote);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("errror occured")
    }
})


// update

router.put("/update/:id",fetchuser,async(req,res)=>{
    try {
        const {title,description,tag}=req.body;
    const newnote={};
    if(title){
        newnote.title=title;
    }
    if(description){
        newnote.desciption=description;
    }
    if(tag){
        newnote.tag=tag;
    }
    let  note=await Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not found");
    }

    if(note.user.toString() !== req.id){
        return res.status(404).send("not allowed");
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true});
    return res.json({note});
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("error occured");
    }
})


//delete
router.delete("/delete/:id",fetchuser,async(req,res)=>{
    try {
        let note=await Note.findById(req.params.id);
        if(!note){
            return res.status(400).send("not allowed");
        }
        if(req.id!==note.user.toString()){
            return res.status(404).send("Not allowed");
        }
        await Note.findByIdAndDelete(req.params.id);
        return res.status(200).send("done successfully");
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error Occured");
    }
})
module.exports=router; 