const passport=require('passport')

const authenticated=(req,res,next)=>{
  passport.authenticate('jwt',{session:false},(err,user)=>{
    if(err||!user) return res.status(401).json({status:'error',message:'Unauthenticated'})
    if(user){
      req.user=user
    }
    next()
  })(req,res,next)
}

const authenticatedAdmin=(req,res,next)=>{
    if(req.user&&req.user.admin) return next()
    res.status(403).json({status:'error',message:'permission denied'})
    next()
}

module.exports={
  authenticated,
  authenticatedAdmin
}