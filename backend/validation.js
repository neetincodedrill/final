function dataValidation(first_name,last_name,age){
    const value  = parseInt(age);
    if(typeof first_name != 'string'){
        return "first_name is in wrong format"
    }
    else if( typeof last_name != 'string'){
        return "last_name is in wrong format"
    }
    else  if(isNaN(value) === true){
        return 'Age is in wrong format'
    }
    else{
        return true
    }
}

function emailformatvalidation(email){
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if(email.match(emailRegex)){
        return true;
    }else{
        return 'Email format is wrong'
    } 
}

function emailduplicationvalidation(user,email){
    const User = user.find({_id:"624d3146460094030a2bf273"})
    return User  
}


function imagevalidation(imageType){
    if(imageType === 'image/png' || imageType === 'image/jpg'){
        return true
    }else{
        return 'Image consist of wrong extension'
    }
}


module.exports = { dataValidation,emailformatvalidation,imagevalidation,emailduplicationvalidation}