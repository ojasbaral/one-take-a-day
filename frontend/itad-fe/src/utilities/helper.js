async function refreshUserToken(){
    try{
        await fetch('/auth/refresh', {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((response) => response.json())
        .then((json) => {
            if (json.message === "success"){
                return false
            }
            return true
        })
    } catch (e) {
        console.log(e)
    }
}

function checkCallback(callback){
    if (callback.message === "success"){
        return 0
    }
    else if (callback.message === "unauthorized"){
        if(refreshUserToken()){
            return 1
        }
        return 2    //NEW ACCESS TOKEN
    }
    return 3
}

module.exports = { refreshUserToken, checkCallback }