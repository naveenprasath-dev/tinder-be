const adminAuth = (req, res, next) => {
    console.log("Admin auth ");
    const token = "xyz";
    const isAdminAuth = token === "xyz";

    if (isAdminAuth) {
        next();
    } else {
        res.status(401).send("un Authorized");
    }
};

const userAuth = (req, res, next) => {
    console.log("user auth ");
    const token = "xyz";
    const isAdminAuth = token === "xyz";

    if (isAdminAuth) {
        next();
    } else {
        res.status(401).send("un Authorized");
    }
};

module.exports = {
    adminAuth,
    userAuth
}
