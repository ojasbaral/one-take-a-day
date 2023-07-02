export async function refreshUserToken(user_id){
    try{
        var result = true
        await fetch('https://onetakeaday.com' + '/auth/refresh', {
            method: "POST",
            body: JSON.stringify({
                user_id: user_id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            credentials: "include"
        }).then((response) => response.json())
        .then((json) => {
            if (json.message === "success"){
                result = false
            }
        })
        return result
    } catch (e) {
        console.log(e)
    }
}

export function checkCallback(callback){
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