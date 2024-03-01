const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken});

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs"); 
 };


 module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing= await  Listing.findById(id).populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
   // console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async(req,res)=>{
    //let {title,description,image,price,country,location} =req.params;
    //  let result = listingSchema.validate(req.body);
    // console.log(result);
    //  if(result.error){
    //     throw new ExpressError(400,result.error);
    //  }

    let response = await geocodingClient
        .forwardGeocode({
            query:req.body.listing.location,
            limit:1,
        })
        .send();
        

 let url = req.file.path;
 let filename = req.file.filename;

const newlisting = new Listing(req.body.listing);
newlisting.owner = req.user._id;
newlisting.image = {url,filename};
newlisting.geometry = response.body.features[0].geometry;
let savedListing = await newlisting.save();
//console.log(savedListing);
 await  newlisting.save();
 req.flash("success","New Listing Created");
    res.redirect("/listings");
};



module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing= await  Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let orginalImageUrl = listing.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload","/upload/h_50,w_50");
    res.render("listings/edit.ejs",{listing,orginalImageUrl});

};


module.exports.updateLising = async (req,res)=>{
    let {id} = req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
   if(typeof req.file !== "undefined"){ 
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url,filename};
   await listing.save();
   }

   req.flash("success"," Listing Updated");
   res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
};