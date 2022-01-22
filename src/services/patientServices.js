import db from "../models/index"
import emailServices from './emailServices'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.name) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameters"
                })
            } else {

                //send email
                let token = uuidv4()

                await emailServices.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.name,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })
                //upsert 
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        firstName: data.name,
                        address: data.address,
                        gender: data.selectedGenders,
                        phonenumber: data.phonenumber,
                    }
                });

                console.log('>>check user:', user[0]);

                //booking
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
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
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameters"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                console.log('check appointment: ', appointment);
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: "Succeed"
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: "This appointment has been verified or doesnt exists"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postBookAppointment, postVerifyBookAppointment
}