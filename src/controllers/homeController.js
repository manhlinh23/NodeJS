import db from "../models/index"
import CRUDServices from "../services/CRUDServices"

let getHomePage = async (req, res) => {
    try {

        let data = await db.User.findAll();
        console.log("----------");
        console.log(data);
        console.log("----------");
        return res.render("homepage.ejs", {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e)
    }
}

let getAbout = (req, res) => {
    return res.render("test/about.ejs")
}

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
}

let postCRUD = async (req, res) => {
    let message = await CRUDServices.createNewUser(req.body);
    console.log(message)
    return res.send('hello from homeController');
}

module.exports = {
    getHomePage: getHomePage,
    getAbout: getAbout,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
}