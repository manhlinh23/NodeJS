const db = require("../models")

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.contentHTML || !data.contentMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    contentMarkDown: data.contentHTML,
                    contentHTML: data.contentMarkDown,
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
    createNewSpecialty
}