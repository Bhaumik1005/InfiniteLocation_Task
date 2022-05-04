const LocationModel = require("../Model/LocationModel");
const mongoose = require('mongoose');

//Get Index
exports.Index = async function Index(req, res){
    let Locations = await LocationModel.find({parentLocation: null},{location:true, product:true, childProducts: true})
    res.render("index.ejs",{Location: Locations})
}

//Get Index 1
exports.Index1 = async function Index1(req, res){
    let Locations = await LocationModel.find({location:true, product:true, childProducts: true})
    console.log(Locations)
    res.render("index1.ejs",{Location: Locations})
}

//Get Products
exports.product = async function product(req, res){  
    try{ 
    let Locations = await LocationModel.find({}).sort({referIndex: 1});    
    console.log(Locations);   
    res.render("addProduct.ejs",{Location: Locations})
    }catch(error){
        res.send({
            message:"error",
            error: [error]
        })
    }
}

//Get Location
exports.location = function location(req, res){
    res.render("addLocation.ejs")
}

//Add Parent Location
exports.addLocation = async function addLocation(req, res){
try{
   
    let Location = req.body.location;   
    console.log(Location);

    let findLocation = await LocationModel.find({parentLocation:null},{location: true});

    console.log(findLocation.length);
    let referIndex = findLocation.length + 1;
    let AddLocation = await LocationModel.create({location :Location, referIndex: referIndex})
    console.log(AddLocation);
    
    let Locations = await LocationModel.find({parentLocation:null},{location: true});
    
    res.redirect("/location")
    // res.render("index.ejs",{Location: Locations});
   

    console.log(Locations);

}catch(error){
    res.send({
        message: "Please Check Your Locations",
        error: [error]
    })
    // console.log(error);

}
} 

//Add Products
exports.addProduct = async function addProduct(req, res) {
    try{
    console.log("Product  ====",req.body.product);


   const Location = req.body.Location.replace(/[,-]/g,'').trim();

   console.log(Location);
   let addProduct = await LocationModel.updateOne({location: Location},{$set: {product: req.body.product}} )

   let product = await LocationModel.find({location: Location},{location:true,product:true})


   let ref = await LocationModel.aggregate([
    {"$match":{"location": Location }},
    {"$graphLookup":{
       "from":"locations",
       "startWith":"$parentLocation", 
       "connectFromField":"parentLocation", 
       "connectToField":"_id", 
       "as":"parent"}}, 
    {"$project":{"_id":0 ,"result":"$parent.location"}}
   ])


   let parentLocations = []
   for (i= 0; i< ref.length; i++){
       for(j= 0; j < ref[i].result.length; j++){
        parentLocations.push(ref[i].result[j])
       }
       
   }
   console.log("Plocations",parentLocations);
   for(k = 0 ; k< parentLocations.length; k++){
    let AddParentProduct = await LocationModel.updateOne({location: parentLocations[k]},{$push : {childProducts: req.body.product}})
   }
  
    res.send({
        message:"Product Add Successfully",
        data:[product]
    })
    console.log(ref);
}catch(error){
    res.send({
        message:"error",
        error:[error]
    })
}
}

//List All Locations
exports.listLocations = async function listLocations(req, res){
    let ParentLocation = await LocationModel.findOne({_id: req.params._id},{location:true})
    let ChildLocations = await LocationModel.find({parentLocation: req.params._id},{location: true, product:true, childProducts: true});
     
    console.log("ParentLocation",ParentLocation);
    
    res.render("index1.ejs",{Location: ChildLocations, ParentLocation: ParentLocation});   
}

//Add Sub Location
exports.subLoc = async function subLoc(req, res){
    try{
    //     let ParentLocation = await LocationModel.findOne({_id: req.params._id},{location:true})
    // let ChildLocations = await LocationModel.find({parentLocation: req.params._id},{location: true, product:true, childProducts: true});
     
    // console.log("ParentLocation",ParentLocation);
    
    // res.render("index1.ejs",{Location: ChildLocations, ParentLocation: ParentLocation});   
    console.log(req.params._id);  
    res.render("addSecLocation.ejs",{ParentId: req.params._id});
}catch(error){
    res.send({
        message:"error",
        error:[error]
    })
}
}

//Add Second Location
exports.addSecLocation = async function addSecLocation(req, res){
try{
    let parentId = req.params.ParentId;  
    let loc = req.body.location;
    let referIndex;
    let findLocation = await LocationModel.find({parentLocation:parentId},{location: true});
    let parentrefIndex = await LocationModel.findOne({_id: parentId});

    
    if(findLocation){
        let subrefLocation = findLocation.length + 1
        referIndex = parentrefIndex.referIndex+"-"+subrefLocation ;
        console.log("referIndex==",referIndex);
    }else{

        referIndex = 1;
        console.log(referIndex);
    }
    

    

    let addparentLoc = await LocationModel.create({location:loc ,parentLocation:parentId, referIndex: referIndex})
    console.log(addparentLoc);
    let ParentLocation = await LocationModel.findOne({_id: parentId},{location:true})
    let ChildLocations = await LocationModel.find({parentLocation: parentId},{location: true, product:true, childProducts: true});
     
    console.log("ParentLocation",ParentLocation);
    
    res.render("index1.ejs",{Location: ChildLocations, ParentLocation: ParentLocation});   
    console.log("ChildLocations",ChildLocations);

}catch(error){
    res.send(error);
}
}

//Get Edit Location
exports.editLocation = async function editLocation(req, res){
try{
    console.log(req.params._id);  
    res.render("editLocation.ejs", {Id: req.params._id})
    // res.render("addSecLocation.ejs",{Id: req.params.Id});
}catch(error){
            res.send({
                message: "error",
                error:[error]
            })
    }
}
//Post Edit Location
exports.editOneLocation = async function editOneLocation(req, res){
    try{
    console.log(req.params.Id); 
    console.log(req.body.editlocation); 

    let editLocation = await LocationModel.updateOne({_id : req.params.Id},{$set: {location: req.body.editlocation}})

    // let UpdatedLocation = await LocationModel.find({_id : req.params.Id},{location: true})
    
    res.redirect("/location");
    }catch(error){
        res.send({
            message:"error",
            error:[error]
        })
    }
}

//Get Edit Child Location
exports.editChild = async function editChild(req, res){
    try{
    console.log(req.params._id);  
    // let parentLocation = await LocationModel.findOne({_id:req.params._id},{parentLocation:true,_id:false})
    // console.log(parentLocation);
    res.render("editChildLocation.ejs", {Id: req.params._id})
    // res.render("addSecLocation.ejs",{Id: req.params.Id});
    }catch(error){
        req.send({
            message:"error",
            error:[error]
        })
    }
}

//Post Edit Child Location
exports.editChildLocation = async function editChildLocation(req, res){
    try{
    console.log(req.params.Id); 
    console.log(req.body.editlocation); 
//     console.log(req.params.parentLocation);
// console.log(req.params);
    let editLocation = await LocationModel.updateOne({_id : req.params.Id},{$set: {location: req.body.editlocation}})

    let updatedLocation = await LocationModel.findOne({_id : req.params.Id},{location: true})
    res.send({
        message: "Location Edit Successfully",
        data:[updatedLocation]
    })
    // // let UpdatedLocation = await LocationModel.find({_id : req.params.Id},{location: true})
    // let ParentLocation = await LocationModel.findOne({_id: parentId},{location:true})
    // let ChildLocations = await LocationModel.find({parentLocation: parentId},{location: true, product:true, childProducts: true});
     
    // console.log("ParentLocation",ParentLocation);
    
    // res.render("index1.ejs",{Location: ChildLocations, ParentLocation: ParentLocation});   
    // // res.render("/index1.ejs");
} catch(error){
    res.send({
        message:"error",
        error:[error]
    })
}
}


exports.deleteLoc = async function deleteLoc(req, res) {
    try{
    console.log(req.params._id);
    //  res.redirect("/deleteLocation")
     res.render("deleteLocation.ejs", {Id: req.params._id})
}catch(error){
    res.send({
        message:"error",
        error:[error]
    })
}

}

//For Delete Locations
exports.deleteLocation = async function deleteLocation(req, res){
   try{
    console.log(req.params.Id);
    let ref = await LocationModel.aggregate([

        {"$match": {_id:  mongoose.Types.ObjectId(req.params.Id) }},
        {"$graphLookup":{
           "from":"locations",
           "startWith":"$_id", 
           "connectFromField":"_id", 
           "connectToField":"parentLocation", 
           "as":"child"}}, 
        {"$project":{"_id":0 ,"result":"$child.location"}}
       ])

       console.log("ref",ref);
   
   let childLocations = []
   for (i= 0; i< ref.length; i++){
       for(j= 0; j < ref[i].result.length; j++){
        childLocations.push(ref[i].result[j])
       }
       
   }
   console.log("Child locations",childLocations);
   console.log(childLocations.length);
   for(k = 0 ; k < childLocations.length; k++){
    console.log(childLocations[k]);
    let AddParentProduct = await LocationModel.deleteOne({location: childLocations[k]})
    
   }
   console.log(childLocations)
   console.log(childLocations.length);
//    if(childLocations.length === 0){
   let deleteLocation = await LocationModel.deleteOne({_id: req.params.Id})
//    console.log("Location Delete",deleteLocation);
//     }
    if(deleteLocation){
        res.send({
            message:"Delete Location Successfully",
        })
    }
}catch(error){
    console.log(error)
    res.send({
        message:"error",
        error:[error]

    })
}
}




