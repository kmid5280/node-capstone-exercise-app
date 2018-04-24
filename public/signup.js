function watchForSignup() {
    $('.signup-form').on('submit', event => {
    console.log('beginning submit button')
    event.preventDefault();
    const username = $('.signup-new-username-entry').val();
    const password = $('.signup-new-password-entry').val();
    const confirmPassword = $('.signup-confirm-password-entry').val();
    const SIGNUP_URL_ENDPOINT = "../users"
    const newUserDetails = {"username": username, "password": password}
    let options = {contentType: "application/json", url: SIGNUP_URL_ENDPOINT, data: JSON.stringify(newUserDetails), dataType: "json", method: "POST", processData: false}
    if (password !== confirmPassword) {
        $('main').append(`<p>Passwords must match</p>`)
        console.log("error");
    }
    
    
    $.ajax(options).done(function(data) {
        $('main').append(`
            <p>Success! User created. Logging in...</p>`)
            window.setTimeout(function() {
            event.preventDefault();
            let token = '';
            const LOGIN_URL_ENDPOINT = "/auth/login"
            const credentials = {"username": username, "password": password}
            options = {contentType: "application/json", url: LOGIN_URL_ENDPOINT, data: JSON.stringify(credentials), dataType: "json", method: "POST", processData: false}
                $.ajax(options).done(function(data) {
                localStorage.setItem("token", data.authToken)
                window.location.href = "/dashboard.html"
            })
            .fail(function() {
                 $('main').append(`Internal server error`)
            })
        }, 3000)
        
        })
        .fail(function(err) {
            console.log(err)
            $('main').append(`
                <p>Sorry, something went wrong - ${err.responseJSON.location} ${err.responseJSON.message.toLowerCase()}.</p>`)
                       
        })
    })
}

watchForSignup()