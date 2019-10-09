var express = require('express');
var router = express.Router();
var {Blog}=require('../models/blog')
const jwt =require("jsonwebtoken");
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const {HttpCodes , CustomErrors }=require('../response');

router.post("/register", async (req, res) => {
   let blog= new Blog(req.body)
   blog.save().then((result)=>{
       res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
   })
   .catch((error)=>{
    res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
   })
   
   
});

router.get('/get/:blog_id',async(req,res)=>{
 Blog.findOne({_id:req.params.blog_id})
 .then((result)=>{
    res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
})
.catch((error)=>{
 res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
})
 
})
router.get('/getall',auth,async(req,res)=>{
    Blog.find({$or:[{created_by:req.body.user_id},{permissions:req.body.user_id}]}).skip(req.query.limit*((req.query.page)-1)).limit(req.query.limit)
    .then((result)=>{
       res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
   })
   .catch((error)=>{
    res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
   })
    
   })
   
   router.put('/updatepermission',admin,auth, async(req,res)=>{
Blog.findOneAndUpdate({_id:req.params.blog_id},{$push:{permissions:{$each:req.body.permissions}}})
    .then((result)=>{
        res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
    })
    .catch((error)=>{
        res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})

    })

})
router.put('/updateblog',admin,auth, async(req,res)=>{
    Blog.findOneAndUpdate({_id:req.params.blog_id},{$set:req.body})
        .then((result)=>{
            res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
        })
        .catch((error)=>{
            res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
    
        })
    
    })
    

router.delete('/updateblog',admin,auth, async(req,res)=>{
        Blog.findOneAndDelete({_id:req.params.blog_id})
            .then((result)=>{
                res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
            })
            .catch((error)=>{
                res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
        
            })
        
        })
module.exports = router;