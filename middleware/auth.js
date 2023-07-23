const passport=require('passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false },(err,user)=>{
    if (err || !user) return res.status(401).json({ status: 'error', message:'unauthorized'})
    if(user) {
      req.user=user
    }
    next()
  })(req,res,next)
}

const publicAuthenticated=(req,res,next)=>{
  passport.authenticate('jwt',{session:false},(err,user)=>{
    if(user){
      req.user=user
    }
    next()
  })(req,res,next)
}

const authenticatedAdmin=(req,res,next)=>{
    if(req.user&&req.user.isAdmin) return next()
    res.status(403).json({status:'error',message:'permission denied'})
    next()
}

module.exports={
  authenticated,
  publicAuthenticated,
  authenticatedAdmin
}