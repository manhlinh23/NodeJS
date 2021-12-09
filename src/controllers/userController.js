import userServices from "../services/userServices"


let handleLogin = async (req, res) => {
    let email = req.body.email //lay du lieu tu input email 
    let password = req.body.password //lay du lieu tu input password

    if (!email || !password) //neu k co 1 trong 2
    {
        return res.status(500).json({ //tra ve status 500 (status bao loi)
            errCode: 1,
            message: 'Missing input parameter'
        })
    }

    let userData = await userServices.handleUserLogin(email, password) // check neu da dien day du email pw

    return res.status(200).json({ // status tra ve 200 (status thanh cong)
        errCode: userData.errCode, // tra ve stt loi code
        message: userData.errMessage, // tra ve thong tin loi code 
        user: userData.user ? userData.user : {}, // neu dung thong tin dang nhap -> tra ve object ng dung nguoc lai se la rong
    })
}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id //sd parameter trong postman
    let users = await userServices.getAllUsers(id)
    console.log(users)

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'missing input parameters',
            users: []
        })
    }
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })

}

let handleCreateUser = async (req, res) => {
    let message = await userServices.createNewUser(req.body)
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body
    let message = await userServices.editUser(data)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "missing input parameters"
        })
    }
    let message = await userServices.deleteUser(req.body.id)
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {
        let data = await userServices.getAllCodeService(req.query.type) //hung du lieu tu userServices
        res.status(200).json(data) // tra ve du lieu la 1 object
    } catch (error) { // bat loi de k bi dung chuong trinh
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateUser: handleCreateUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}