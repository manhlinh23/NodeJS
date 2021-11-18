import express from "express";
import homeController from "../controllers/homeController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAbout);
    router.get('/crud', homeController.getCRUD); // lay thong tin user

    router.post('/post-crud', homeController.postCRUD); // day thong tin user 

    return app.use("/", router);
}

module.exports = initWebRoutes;