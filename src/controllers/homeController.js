import db from "../models/index"

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
    return res.render("hello from homeController")
}
module.exports = {
    getHomePage: getHomePage,
    getAbout: getAbout,
    getCRUD: getCRUD,
}