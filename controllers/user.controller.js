import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';
import createError from "../utils/createError.js";


const getUsers = async (req, res) => {


}
const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You con delete only  your account"));

  }



  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("Deleted successfully");
}

 const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};


export { deleteUser , getUser}