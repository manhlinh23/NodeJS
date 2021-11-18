// thuc hien chuc nang tao user va hash password
import bcrypt from 'bcryptjs';
import db from "../models/index"

const salt = bcrypt.genSaltSync(10); // tai lieu

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password) //khoi tao ham moi chua du lieu da hash pw
            await db.User.create({ // hung du lieu de day len database
                email: data.email, // lay du lieu tu ben views
                password: hashPasswordFromBcrypt, // lay du lieu tu ham hashPasswordFromBcrypt
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
            })
            console.log(hashPasswordFromBcrypt)
            resolve('Success!') // thong bao 

        } catch (error) {
            reject(error)
        }
    })
    // console.log("data from services")
    // console.log(data)
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

module.exports = {
    createNewUser: createNewUser,
}