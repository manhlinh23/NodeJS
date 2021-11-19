import db from "../models/index"
import CRUDServices from "../services/CRUDServices"

let getHomePage = async (req, res) => {
    try {

        let data = await db.User.findAll(); // lay data tu database User
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
    return res.render("crud.ejs"); // dieu huong qua view crud.ejs
}

let postCRUD = async (req, res) => { // tao interface de client nhap du lieu
    let message = await CRUDServices.createNewUser(req.body); // hung du lieu client
    console.log(message)
    return res.send('hello from homeController');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDServices.getAllUser();
    console.log(data)
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id
    console.log(userId)
    if (userId) {
        let userData = await CRUDServices.getUserInfoById(userId)


        return res.render('editCRUD.ejs', {
            user: userData
        })
    } else {
        return res.send('no user')
    }

    return res.send('edit from controller')
}

let putCRUD = async (req, res) => {
    let data = req.body
    let allUser = await CRUDServices.updateUserData(data)
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })
}

module.exports = {
    getHomePage: getHomePage,
    getAbout: getAbout,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
}