module.exports = {
    isAuthenticated: ({ session }, res, next) => {
        if(!session.admin){
            return res.status(401).json({ msg: 'unauthorized'})
        }
        next()
    },
    isPublic: ({ session }, res, next) => {
        if(session.admin || !session.admin) return next()
    },
}