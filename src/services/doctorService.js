import db from "../models/index"
require('dotenv').config() //import tham so mns tu .env
import _ from 'lodash'
import res from "express/lib/response"

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

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

let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' }, //lay truong roleId co ma la R2
                attributes: {
                    exclude: ['password', 'image'] // bo truong password
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let createInforDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData.doctorId
                || !inputData.contentHTML
                || !inputData.contentMarkdown
                || !inputData.action
                || !inputData.selectedProvince
                || !inputData.nameClinic
                || !inputData.addressClinic
                || !inputData.note
                || !inputData.selectedPrice
                || !inputData.selectedPayment
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameters'
                })
            } else {

                //upsert Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description
                    })
                } else if (inputData.action === 'UPDATE') {
                    let doctorMD = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMD) {
                        doctorMD.contentHTML = inputData.contentHTML
                        doctorMD.contentMarkdown = inputData.contentMarkdown
                        doctorMD.description = inputData.description
                        await doctorMD.save()
                    }

                    //upsert Doctor_infor
                    let doctor = await db.Doctor_info.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctor) {
                        //update
                        doctor.priceId = inputData.selectedPrice
                        doctor.provinceId = inputData.selectedProvince
                        doctor.paymentId = inputData.selectedPayment
                        doctor.addressClinic = inputData.addressClinic
                        doctor.note = inputData.note
                        doctor.nameClinic = inputData.nameClinic
                        doctor.doctorId = inputData.doctorId
                        await doctor.save()
                    } else {
                        //create
                        await db.Doctor_info.create({
                            priceId: inputData.selectedPrice,
                            provinceId: inputData.selectedProvince,
                            paymentId: inputData.selectedPayment,
                            addressClinic: inputData.addressClinic,
                            note: inputData.note,
                            nameClinic: inputData.nameClinic,
                            doctorId: inputData.doctorId,
                        })
                    }

                }
                resolve({
                    errCode: 0,
                    errMessage: 'Create succeed'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorsService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing input parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputData }, //lay truong roleId co ma la R2
                    attributes: {
                        exclude: ['password'] // bo truong password
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        }, //gop 2 truong en va vi vao 1 truong tao moi la position Data
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                //gom 2 truong tra ve 1 object
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if (!data) { data = {} }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameters'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    //ham gan gtri max_number_schedule vao db
                    //tao vong map, gan gtri mns vao nhung truong maxNumber *phai co return gtri
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }

                /**
                 * ham lay dlieu da ton tai trong db de so sanh 2 truong doctorId va data
                 * attributes : tra ve 4 truong
                 */
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date
                    },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                })
                //ham convert date da lay tu db sang string
                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        // item.date = new Date(item.date).getTime();
                        item.date = data.date //tu sua
                        return item
                    })
                }
                //ham so sanh dlieu tu db va tu react gui ve (existing,toCreate)
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })

                //sau khi so sanh se push dlieu khac biet so vs db vao db
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                console.log('toCreate ', toCreate);
                console.log('existing ', existing);
                resolve({
                    errCode: 0,
                    errMessage: "Succeed"
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}

let getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: -1,
                    errMessage: 'missing input parameters'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    // lay trong bang allcode 2 truong en,vi gop vao 1 truong timetypedata
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = []

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    errMessage: 'missing input parameters'
                })
            } else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId }, //lay truong roleId co ma la R2
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        //gom 2 truong tra ve 1 object
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = []

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    errMessage: 'missing input parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId }, //lay truong roleId co ma la R2
                    attributes: {
                        exclude: ['password'] // bo truong password
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description']
                        }, //gop 2 truong en va vi vao 1 truong tao moi la position Data
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                //gom 2 truong tra ve 1 object
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if (!data) { data = {} }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorsService: getAllDoctorsService,
    createInforDoctorService: createInforDoctorService,
    getDetailDoctorsService: getDetailDoctorsService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleDoctorByDateService, getExtraInfoDoctorById,
    getProfileDoctorById,
}