const connect=require('./db');
const express=require("express");
connect();
const app=express();
app.use(express.json())
const port=5000;
const authRoutes=require("./routes/auth")
const notesRoutes=require("./routes/notes")
// const notesRoutes=require("")
app.get('/',(req,res)=>{
    res.send("hey");
})
app.use('/api/auth',authRoutes);
app.use('/api/notes',notesRoutes);

app.listen(port,()=>{
    console.log("i am running");
})