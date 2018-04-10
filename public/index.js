function watchForLogin() {
    $('.login-login-button').on('click', event => {
        event.preventDefault();
        const username = $('.login-username-entry').val();
        const password = $('.login-password-entry').val();
        const LOGIN_URL_ENDPOINT = "/auth/login"
        const credentials = {"username": username, "password": password}
        const options = {contentType: "application/json", url: LOGIN_URL_ENDPOINT, data: JSON.stringify(credentials), dataType: "json", method: "POST", processData: false}
        $.ajax(options).done(function(data) {
            console.log(data)
            //store token in local storage
            //redirect to dashboard
            //do same thing with signup page
        })
    })
}

function renderBlogEntryForm() {
    $('main').append(`
    `)
}

watchForLogin()