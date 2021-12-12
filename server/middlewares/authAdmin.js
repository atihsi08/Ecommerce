
//Array is added instead of checking for single user. timestamp -> 2:43:40
export const authAdmin = (req, res, next) => {

    if (req.user.role === 'user') return res.status(403).json({ message: 'You are not allowed to access this page.' });

    next();
}