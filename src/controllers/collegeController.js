const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") return true;
};

const isvalidRequest = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const createCollege = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        const requestBody = req.body
        if (!isvalidRequest(requestBody)) return res.status(400).send({ status: false, message:"invalid request parameter ,please provied college detail" })

        let { name, fullName, logoLink } = requestBody

        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is invalid" })
        let newName = await collegeModel.findOne({ name })
        if (newName) return res.status(404).send({ status: false, message: "name is already used" })

        if (!fullName) return res.status(400).send({ status: false, message: "fullName is required" })
        if (!isValid(fullName)) return res.status(400).send({ status: false, message: "fullName is invalid" })

        if (!logoLink) return res.status(400).send({ status: false, msg: "Logo Link is required" })
        if(typeof logoLink!== "string") return res.status(400).send({ status: false, message: "logo Link is invalid" })
        if(!logoLink.trim().match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)$/)) return res.status(400).send({status:false,message:"provide valid logo link"})


        let saveData = await collegeModel.create(requestBody)
        return res.status(201).send({ status: true, data: saveData })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getCollegeDetails = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        let query = req.query
        if (!(isvalidRequest(query))) return res.status(400).send({ status: false, msg: "provide request parameter " })
        if(!query.collegeName) return res.status(400).send({ status: false, msg: "provide College Name " })

        if (!query.collegeName.trim().length) return res.status(400).send({ status: false, message: "provide name of college" })

        let getDetails = await collegeModel.findOne({name:query.collegeName}).select({ name: 1, fullName: 1, logoLink: 1, _id: 1 })
        if (!getDetails) return res.status(404).send({ status: false, message: "no such college found" })

        let internDetails = await internModel.find({ collegeId: getDetails._id }).select({ name: 1, email: 1, mobile: 1 })

        let collegeData = {
            name: getDetails.name,
            fullName: getDetails.fullName,
            logoLink: getDetails.logoLink,
            interns: internDetails
        }
        if (internDetails.length == 0) return res.status(200).send({ status: true, data:collegeData, message: "no intern found" })
        return res.status(200).send({ status: true, data: collegeData })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {
    createCollege,
    getCollegeDetails
}