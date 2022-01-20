const db = require("../models")

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.contentHTML || !data.contentMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    contentMarkDown: data.contentHTML,
                    contentHTML: data.contentMarkDown,
                    address: data.address
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Succeed'
                })
            }

        } catch (error) {
            reject(error)
        }

    })
}

module.exports = {
    createNewClinic
}