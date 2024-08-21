const jwt=require('jsonwebtoken');
const JWT_SECRET='123!';

const fetchuser=(req,res,next)=>{
    // console.log(req);
    const token=req.header("auth-token");
    // console.log(req);
    if(!token){
        return res.status(401).json({"error" : "please authenticate using a valid token"});
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        // console.log(data);
        req.id=data.user.id;
        // console.log(req);
        next();

    } catch (error) {
        return res.status(401).json({"error" : "please authenticate using a valid token"});
    }
    // next();
}
module.exports=fetchuser;
