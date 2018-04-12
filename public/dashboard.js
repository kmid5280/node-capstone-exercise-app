const token = localStorage.getItem("token")
if (!token) {
    window.location.href = "/login.html"
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
        const renderDateCreated = data[i].created || Date.now();
        console.log(renderWorkoutType, renderLengthOfTime, renderDetails)
        $('main').append(`
        <div class="dashboard-workout-entry">
            <p>Date: ${renderDateCreated}</p>
            <p>Type of Workout: ${renderWorkoutType}</p>
            <p>Amount of time spent: ${renderLengthOfTime} minutes</p>
            <p>Additional Workout Details: ${renderDetails}</p>
            <button class="dashboard-workout-update-button">Edit</button>
            <button class="dashboard-workout-delete-button">Delete</button>
        </div>
        `)
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

function watchForDelete() {
    $('.dashboard-workout-delete-button').on('click', event => {
        event.preventDefault()
        $.ajax({
            url: "/workouts/:id",
            method: "DELETE",
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .done(function(data) {
            $('main').append(
                renderWorkoutPosts(data)
            )
        })
    })
}

getWorkoutPosts()
watchForUpdate()
watchForDelete()