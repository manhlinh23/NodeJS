import db from "../models/index"
import bcrypt from 'bcryptjs';

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
                    attributes: ['email', 'roleId', 'password'], // lay 3 thuoc tinh
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


module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
}