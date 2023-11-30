const express=require('express');
const router=express.Router();
const Note= require("../models/Note");
const fetchuser=require("../middeware/fetchuser");
const {body,validationResult}=require('express-validator')
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
module.exports=router; 