function watchForSignup() {
    $('.signup-submit-button').on('click', event => {
    console.log('beginning submit button')
    const username = $('.signup-new-username-entry').val();
    const password = $('.signup-new-password-entry').val();
    const confirmPassword = $('.signup-confirm-password-entry').val();
    const SIGNUP_URL_ENDPOINT = "../users"
    const newUserDetails = {"username": username, "password": password}
    const options = {contentType: "application/json", url: SIGNUP_URL_ENDPOINT, data: JSON.stringify(newUserDetails), dataType: "json", method: "POST", processData: false}
    if (password !== confirmPassword) {
        $('main').append(`<p>Passwords must match</p>`)
        console.log("error");
    }
    
    $.ajax(options).done(function(data) {
        $('main').append(`
            <p>Success! User created.</p>`)
        })
        .fail(function() {
            $('main').append(`
            <p>Sorry, something went wrong</p>`)
                       
        })
    })
}

watchForSignup()