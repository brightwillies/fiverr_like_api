import Gig from "../models/gig.model.js"
import createError from "../utils/createError.js"


const createGig = async (req, res, next) => {

    if (!req.isSeller) return next(createError(403, "Onlly sellerss can create a gig"));

    const newGig = new Gig({
        userId: req.userId,
        ...req.body
    });


    try {
        const saveGig = await newGig.save();
        // console.log(saveGig);
        res.status(201).json(saveGig);
    } catch (error) {
        return next(createError(500, error));
    }
}

 const getGigs = async (req, res, next) => {
  // console.log(("meee"));
    const q = req.query;
    const filters = {
    //   ...(q.userId && { userId: q.userId }),
      ...(q.cat && { cat: q.cat }),
      ...((q.min || q.max) && {
        price: {
          ...(q.min && { $gt: q.min }),
          ...(q.max && { $lt: q.max }),
        },
      }),
      ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };
    try {
      const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
      res.status(200).send(gigs);
    } catch (err) {
      next(err);
    }
  };


const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) next(createError(404, "Gig not found!"));
        res.status(200).send(gig);
      } catch (err) {
        next(err);
      }
}
const deleteGig = async (req, res, next) => {
    try {

        const gig = await Gig.findById(req.params.id);

        if (!gig) return next(createError(403, "Record not found"));

        if (gig.userId !== req.userId) {
            return next(createError(403, "You can only  delete your gig"));
        }
        await Gig.findByIdAndDelete(req.parrams.id);
        res.status(200).send("Gig has been deleted");
    } catch (err) {
        next(err);
    }
}

export { createGig, deleteGig, getGig, getGigs }