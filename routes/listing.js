const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} =require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



//  Index Route
//Create Route

router.route("/")
.get(wrapAsync (listingController.index ))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync (listingController.createListing));

// New Route

router.get("/new",isLoggedIn,(listingController.renderNewForm))




//Update Route
//Delete Route
// show Route
router.route("/:id")
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateLising))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)
)
.get(wrapAsync(listingController.showListing));

//Edit Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing ));


//check route
router.get("/check",validateListing, wrapAsync (async (req, res) => {
    try {
        const allListings = await Listing.find();

        // Log only the image URLs
        allListings.forEach((listing, index) => {
            console.log(`Listing ${index + 1} Image URL: `, listing.image);
        });

        // Send the data as a response if needed

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));




module.exports = router;
