import db from "../models/index"
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let checkUserEmail = (userEmail) => { // ham check email
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ // tim user theo email
                where: { email: userEmail } // gan email tu body (userEmail) vao user db (user)
            })

            if (user) { // neu co user tra ve true
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email) // gan ham isExist cho ham checkUserEmail
            if (isExist) { //neu true
                let user = await db.User.findOne({ //tim user
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'], // lay 3 thuoc tinh
                    where: { email: email }, // tim user theo email tu body
                    raw: true, // thong tin raw
                })

                if (user) { // neu co user
                    let check = await bcrypt.compareSync(password, user.password); // docs

                    if (check) { // neu true
                        userData.errCode = 0
                        userData.errMessage = `OK`
                        console.log(user)
                        delete user.password // xoa thuoc tinh pw phia client
                        userData.user = user; // tra ve object user
                    } else {
                        userData.errCode = 3 // false tra ve stt loi 3
                        userData.errMessage = `wrong password` // + message
                    }
                } else { // k co user
                    userData.errCode = 2
                    userData.errMessage = `user not found`
                }
            } else { //k co user, check ki cho tot vi co the xay ra TH xoa email giua 2 giai doan
                userData.errCode = 1
                userData.errMessage = `your's email doesnt exist, pls try again`
            }
            resolve(userData) // tra ve bien thong bao
        } catch (e) {
            reject(e)
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'all') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: 'password',
                    }
                })
            }
            if (userId && userId !== 'all') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: 'password',
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => { // ham hash pw
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt); // thuc hien hash pw
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }

    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email
            let check = await checkUserEmail(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email is exist'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password) //khoi tao ham moi chua du lieu da hash pw
                await db.User.create({ // hung du lieu de day len database
                    email: data.email, // lay du lieu tu ben views
                    password: hashPasswordFromBcrypt, // lay du lieu tu ham hashPasswordFromBcrypt
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing input parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Edited"
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User not found"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: "User isnt exist"
            });
        }

        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode: 0,
            errMessage: "Deleted"
        })
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) { //kiem tra neu k co dl dau vao
                resolve({ //tra ve 1 object thong bao
                    errCode: 1,
                    errMessage: "Missing input parameters"
                })
            } else { //neu co du lieu dau vao
                let res = {} //tao 1 object rong
                let allcode = await db.Allcode.findAll({ // tao ham hung dieu lay tu database
                    where: { type: typeInput }
                })
                res.errCode = 0 // tra ve ma code la 0 neu lay du lieu thanh cong
                res.data = allcode // gan du lieu lay tu database vao
                resolve(res) // tra ve du lieu gom errCode va data 
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,
}