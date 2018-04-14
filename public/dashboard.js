const token = localStorage.getItem("token")
if (!token) {
    window.location.href = "/login.html"
}

function watchForWorkoutPost() {
    
    $('.dashboard-post-button').on('click', event => {
        console.log('watch for workout post')
        const WORKOUT_URL_ENDPOINT = "/workouts"
        const workoutType = $('#workout-type').val();
        const lengthOfTime = $('#time-spent').val();
        const workoutDetails = $('#workout-details').val();
        //const totalWorkoutData = {"workoutType": workoutType, "lengthOfTime": lengthOfTime, "details": workoutDetails}
        const options = {contentType: "application/json", url: WORKOUT_URL_ENDPOINT, data: JSON.stringify(workoutType), data: lengthOfTime, data: JSON.stringify(workoutDetails), dataType: "json", method: "POST", processData: false}
        console.log(options)
    })
    $.ajax(options).done(function(data) {
        console.log("success")
        $('main').html(
            renderWorkoutPosts(data)
        )
    })
    .fail(function() {
        console.log("fail")
               
    })

}

function getWorkoutPosts() {
    $.ajax({
        url: "/workouts",
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .done(function(data) {
        $('main').append(
            renderWorkoutPosts(data)
        )
    })
}

function renderWorkoutPosts(data) {
    $('main').html('');
    console.log(data)
    for (i=0; i<=2; i++) {
        const renderWorkoutType = data[i].workoutType || '';
        const renderLengthOfTime = data[i].lengthOfTime || '';
        const renderDetails = data[i].details || '';
        const itemId = data[i]._id;
        const renderDateCreated = data[i].created || Date.now();
        $('main').append(`
        <div class="dashboard-workout-entry" data-post-id=${itemId}>
            <p>Date: ${renderDateCreated}</p>
            <p>Type of Workout: ${renderWorkoutType}</p>
            <p>Amount of time spent: ${renderLengthOfTime} minutes</p>
            <p>Additional Workout Details: ${renderDetails}</p>
            <button class="dashboard-workout-update-button">Edit</button>
            <button class="dashboard-workout-delete-button" data-delete-id=${itemId}>Delete</button>
        </div>
        `)
        watchForWorkoutPost()
        watchForUpdate()
        watchForDelete(data)
    }
    $('main').html(`
    
    `)
}

function watchForUpdate() {
    $('.dashboard-workout-update-button').on('click', event => {
        event.preventDefault();
        $.ajax({
            url: "/workouts/:id",
            method: "PUT",
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .done(function(data) {
            $('main').append(
                renderWorkoutPosts(data)
            )
        })
    })
}

function watchForDelete(data) {
    $('.dashboard-workout-delete-button').on('click', event => {
        event.preventDefault()
        const itemId = $('.dashboard-workout-delete-button').data('delete-id')
        console.log(itemId)
        $.ajax({
            
            url: "/workouts/",
            method: "DELETE",
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .done(function() {
            $('main').html(
                renderWorkoutPosts()
                
            )
            
        })
    })
    console.log("done function")
}

getWorkoutPosts()
