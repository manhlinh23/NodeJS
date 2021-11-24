import userServices from "../services/userServices"


let handleLogin = async (req, res) => {
    let email = req.body.email //lay du lieu tu input email 
    let password = req.body.password //lay du lieu tu input password

    if (!email || !password) //neu k co 1 trong 2
    {
        return res.status(500).json({ //tra ve status 500 (status bao loi)
            errCode: 1,
            message: 'Missing input parameter'
        })
    }

    let userData = await userServices.handleUserLogin(email, password) // check neu da dien day du email pw

    return res.status(200).json({ // status tra ve 200 (status thanh cong)
        errCode: userData.errCode, // tra ve stt loi code
        message: userData.errMessage, // tra ve thong tin loi code 
        user: userData.user ? userData.user : {}, // neu dung thong tin dang nhap -> tra ve object ng dung nguoc lai se la rong
    })
}

module.exports = {
    handleLogin: handleLogin
}