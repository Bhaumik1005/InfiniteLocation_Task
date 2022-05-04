const router = require("express").Router();
const controller = require("../controller/controller")

router.get("/", controller.Index)

router.get("/index1", controller.Index1)

router.get("/product",controller.product)

router.get("/location", controller.location)

router.post("/addLocation", controller.addLocation)

router.post("/addProducts", controller.addProduct)

router.get("/listLocations/:_id", controller.listLocations)
router.get("/subLocation/:_id",controller.subLoc)

router.post("/addSecLocation/:ParentId", controller.addSecLocation)

router.get("/editLocation/:_id", controller.editLocation)

router.post("/editOneLocation/:Id", controller.editOneLocation)

router.get("/editChildLocation/:_id", controller.editChild)

router.post("/editChildLocation/:Id", controller.editChildLocation)

router.get("/deleteLocation/:_id", controller.deleteLoc);

router.post("/deleteLocation/:Id",controller.deleteLocation)
module.exports = router;