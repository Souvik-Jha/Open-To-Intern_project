const mongoose = require('mongoose');
// const mongooseUrl = require('mongoose-type-url');



const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        validate:{validator: function(email){
            return (!(/'[a-z0-9]+@[a-z]+\.edu\.[a-z]{2,3}'/.test(email)))
        }, message: "please enter valid email", isAsync: false
    }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        validate: {validator: function validatePhoneNumber(mobile) 
        {
            var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        
            return re.test(mobile);
        }
    }

    },
    collegeId:{
        type: mongoose.Types.ObjectId,
        ref: "College"
    },
    isDeleted:{

        type: Boolean,
        default: false
    }


}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema)