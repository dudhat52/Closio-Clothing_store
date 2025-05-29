const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const multer = require("multer");
const path = require("path");

function isClerk(req, res, next) {
  if (req.session.user && req.session.user.role === "clerk") {
    return next();
  }
  res.status(403).send("Access denied.");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg"].includes(ext)) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};
const upload = multer({ storage, fileFilter });

router.get("/products", isClerk, inventoryController.viewAllProducts);
router.get("/products/create", isClerk, inventoryController.getCreateProduct);
router.post("/products/create", isClerk, upload.single("image"), inventoryController.postCreateProduct);
router.get("/products/edit/:id", isClerk, inventoryController.getEditProduct);
router.post("/products/edit/:id", isClerk, upload.single("image"), inventoryController.postEditProduct);
router.get("/products/delete/:id", inventoryController.deleteProduct);

module.exports = router;