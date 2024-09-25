import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import createError from "../utils/createError.js";

const register = async (req, res, next) => {


    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        }
        )
        await newUser.save();
        res.status(201).send("User has been created");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const login = async (req, res, next) => {

    const jwtKey = process.env.JWT_SECRET_KEY;

    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) return next(createError(404, "User not found!"));

        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect)
            return next(createError(400, "Wrong password or username!"));

        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
            {
                id: user._id,
                isSeller: user.isSeller,
            },
            jwtKey,
            { expiresIn: age }
        );

        const { password, ...info } = user._doc;
        res
            .cookie("accessToken", token, {
                httpOnly: true,
            })
            .status(200)
            .send(info);
    } catch (err) {
        next(err);
    }
};


 const logout = async (req, res) => {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send("User has been logged out.");
  };

export { register, login, logout }