module.exports = (req) => {
    if(!req.session.isAuth)
        throw new Error("You have to Login first !"); 

    else if(!req.session.agent)
        throw new Error("Unauthorized !");    
  };