import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

    const token = jwt.sign(
        {userId}, 
        process.env.JWT_SECRET, 
        {expiresIn: "7days"}
    );

    res.cookie("chat_token", token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,// milli-secs
        httpOnly: true,// prevent XSS attacks cross-site scripting attacks
        sameSite: true,// prevent CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" //meaning it will be true in production
    });

    return token;
};