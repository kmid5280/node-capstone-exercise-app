function watchForLogin() {
    $('.login-login-button').on('click', event => {
        event.preventDefault();
        let token = '';
        const username = $('.login-username-entry').val();
        const password = $('.login-password-entry').val();
        const LOGIN_URL_ENDPOINT = "/auth/login"
        const credentials = {"username": username, "password": password}
        const options = {contentType: "application/json", url: LOGIN_URL_ENDPOINT, data: JSON.stringify(credentials), dataType: "json", method: "POST", processData: false}
        $.ajax(options).done(function(data) {
            localStorage.setItem("token", data.authToken)
            window.location.href = "/dashboard.html"
        })
        .fail(function() {
            $('main').append(`Invalid login name or password`)
        })

    })
}

function renderBlogEntryForm() {
    $('main').append(`
    `)
}

watchForLogin()