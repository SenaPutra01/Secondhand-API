const express = require("express");
const { refreshToken } = require("../controllers/refreshToken");
const { verifyToken } = require("../middleware/verifyToken");
const cloudinary = require("../../cloudinary/cloudinary");
const  upload = require("../../cloudinary/multer");

const { 
    Register, 
    Login, 
    Logout, 
    getUser, 
    updateUser, 
    emailVerif
} = require("../controllers/userController");

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getProductCategory,
    getProductDetail,
    getAllSellerProduct
} = require("../controllers/productController")

const {
    getUserTransaction,
    getTransactionDetail,
    addTransaction,
    buyerUpdateTransaction,
    sellerRejectTransaction,
    sellerAcceptTransaction,
    finalTransaction,
} = require("../controllers/transactionController");

const { 
    checkUserAuth, 
    checkTransactionBuyerAuth, 
    checkTransactionSellerAuth 
} = require("../middleware/transaction");

const { getUserNotification } = require("../controllers/notificationController");

function apply(app) {
    app.post("/register", Register);
    app.post("/login", Login);
    app.get("/token", refreshToken);
    app.delete("/logout", Logout);
    app.get("/whoami", verifyToken, getUser);
    app.put("/profile", verifyToken, upload.single("image"), updateUser);

    // Product
    app.post("/product", verifyToken, upload.single("image"), createProduct);
    app.put("/product/:id", verifyToken, upload.single("image"), updateProduct);
    app.delete("/product/:id", verifyToken, deleteProduct);
    app.get("/products", getAllProduct);
    app.get("/category/:id", getProductCategory);
    app.get("/product/:id", getProductDetail);
    app.get("/sellerproduct", verifyToken, getAllSellerProduct);

    // Transaction
    app.get("/transaction", [verifyToken, checkUserAuth], getUserTransaction)
    app.get("/transaction-detail/:id", verifyToken, checkUserAuth, getTransactionDetail);
    app.post("/transaction/:id", verifyToken, addTransaction);
    app.put("/updateBuyer/:id", [verifyToken, checkTransactionBuyerAuth], buyerUpdateTransaction);
    app.put("/seller-reject/:id", [verifyToken, checkTransactionSellerAuth], sellerRejectTransaction);
    app.put('/seller-accept/:id', [verifyToken, checkTransactionSellerAuth], sellerAcceptTransaction);
    app.put("/final-transaction/:id", [verifyToken, checkTransactionSellerAuth], finalTransaction)
    
    // Notification
    app.get("/notification", verifyToken, checkUserAuth, getUserNotification);
    
    return app;
}

module.exports = { apply };