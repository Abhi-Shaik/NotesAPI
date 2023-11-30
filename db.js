const mongoose = require('mongoose');

const uri= "mongodb+srv://abhishekbansal:abcd@cluster0.u1mbkoq.mongodb.net/cluster0?retryWrites=true&w=majority";

const connect = async() => {
    console.log("connected successully")
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports=connect;
