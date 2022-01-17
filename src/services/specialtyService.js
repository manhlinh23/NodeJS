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

let getSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if (data && data.length > 0) {
                data.map((item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                }))
            }
            resolve({
                errCode: 0,
                data
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewSpecialty, getSpecialties
}