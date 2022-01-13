import db from "../models/index"
import emailServices from './emailServices'

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameters"
                })
            } else {

                //send email

                await emailServices.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: "Nguyễn Văn A",
                    time: "9:00 - 10:00 - Chủ nhật - 23/7/2022",
                    doctorName: "Mạnh Linh",
                    redirectLink: "https://github.com/manhlinh23?tab=repositories"
                })
                //upsert 
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                });

                console.log('>>check user:', user[0]);


                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
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

module.exports = {
    postBookAppointment,
}