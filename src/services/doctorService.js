import db from "../models/index"

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit, //gioi han lay
                where: { roleId: 'R2' }, //lay truong roleId co ma la R2
                order: [['createdAt', 'DESC']], // sap xep tu tren xuong duoi cua trường createdAt
                attributes: {
                    exclude: ['password'] // bo truong password
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }, //gop 2 truong en va vi vao 1 truong tao moi la position Data
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
}