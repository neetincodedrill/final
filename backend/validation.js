
function dataValidation(first_name,last_name,age){
    const data = [18,19,20,21,22,23,24,25,26]
    if(typeof first_name != 'string'){
        return "first_name is in wrong format"
    }
    else if( typeof last_name != 'string'){
        return "last_name is in wrong format"
    }
    else if(parseInt(age) === NaN){
        return 'Age is in wrong format'
    }
    else{
        return true
    }
}

function emailvalidation(email,User){
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if(email.match(emailRegex)){
        return true;
    } else{
        return false
    } 
    

}

function imagevalidation(imageType){
    if(imageType === 'image/png' || imageType === 'image/jpg'){
        return true
    }else{
        return false
    }
}


module.exports = { dataValidation,emailvalidation,imagevalidation}