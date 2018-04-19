const token = localStorage.getItem("token")
if (!token) {
    window.location.href = "/login.html"
}

let workoutData = []

function getWorkoutPosts() {
    $.ajax({
        url: "/workouts",
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + token }
    })
    
    .done(function(data) {
        workoutData = data;
        $('main').append(
            renderWorkoutPosts(data)
        )
    })
}

function renderWorkoutPosts(data) {
    $('main').html('');
    console.log(data)
    //data.sort()
    for (i=0; i<data.length; i++) {
        const renderWorkoutType = data[i].workoutType || '';
        const renderLengthOfTime = data[i].lengthOfTime || '';
        const renderDetails = data[i].details || '';
        const itemId = data[i]._id;
        console.log(itemId)
        const renderDateCreated = data[i].created || Date.now();
        $('main').append(`
        <div class="dashboard-workout-entry" id=${itemId}>
            <p>Date: ${renderDateCreated}</p>
            <p>Type of Workout: ${renderWorkoutType}</p>
            <p>Amount of time spent: ${renderLengthOfTime} minutes</p>
            <p>Additional Workout Details: ${renderDetails}</p>
            <button class="dashboard-workout-update-button" data-update-id=${itemId}>Edit</button>
            <button class="dashboard-workout-delete-button" data-delete-id=${itemId}>Delete</button>
        </div>
        `)
 
    }
}

function watchForWorkoutPost() {
    
    $('.blog-entry-form').on('submit', event => {
        event.preventDefault();
        console.log('watch for workout post')
        const WORKOUT_URL_ENDPOINT = "/workouts"
        const workoutType = $('#workout-type').val();
        console.log(workoutType)
        const lengthOfTime = $('#time-spent').val();
        console.log(lengthOfTime)
        const workoutDetails = $('#workout-details').val();
        //const totalWorkoutData = {"workoutType": workoutType, "lengthOfTime": lengthOfTime, "details": workoutDetails}
        const postFields = {"workoutType": workoutType, "lengthOfTime": lengthOfTime, "details": workoutDetails}
        const options = {contentType: "application/json", url: WORKOUT_URL_ENDPOINT, data: JSON.stringify(postFields), dataType: "json", method: "POST", headers: { 'Authorization': 'Bearer ' + token }, processData: false}
        console.log(options)
        
        
        $.ajax(options).done(function(data) {
            console.log("success")
            $('main').html(getWorkoutPosts())
        })
    
        .fail(function() {
            console.log("fail")
        })
    })
}

function watchForUpdate() {
    $('main').on('click', '.dashboard-workout-update-button', event => {
        event.preventDefault();
        const itemId = $(event.target).data('update-id')
        const found = workoutData.find(function(item) {
            return itemId === item._id;
        })
        $('.blog-entry-form-update').remove();
        $(event.target).parent().append(`
        <form class="blog-entry-form-update">
                
                <div class="dashboard-type-of-workout-dropdown">Type of workout: <select id="workout-type-update" value=${found.workoutType}>
                    <option ${found.workoutType == 'Upper body/arms'?"selected":""}>Upper body/arms</option>
                    <option ${found.workoutType == 'Lower body/legs'?"selected":""}>Lower body/legs</option>
                    <option ${found.workoutType == 'Cardiovascular'?"selected":""}>Cardiovascular</option>
                    <option ${found.workoutType == 'Nothing'?"selected":""}>Nothing</option>
                </select>
                </div>
                <div class="dashboard-time-spent-dropdown">
                Amount of time spent: <select id="time-spent-update">
                    <option ${found.lengthOfTime == 15?"selected":""}>15</option>
                    <option ${found.lengthOfTime == 30?"selected":""}>30</option>
                    <option ${found.lengthOfTime == 45?"selected":""}>45</option>
                    <option ${found.lengthOfTime == 60?"selected":""}>60</option>
                    <option ${found.lengthOfTime == 75?"selected":""}>75</option>
                    <option ${found.lengthOfTime == 90?"selected":""}>90</option>
                </select> minutes
                </div>
                <div class="dashboard-workout-details-entry">
                Additional details: <input type="text" id="workout-details-update" value=${found.details}>
                </div>
                <button class="dashboard-update-submit-button">Submit</button>
            </form>`)
        $('.blog-entry-form-update').on('submit', event => {
            event.preventDefault();
            const WORKOUT_URL_ENDPOINT = "/workouts/" + itemId;
            const updateWorkoutType = $('#workout-type-update').val();
            //console.log(updateWorkoutType)
            const updateLengthOfTime = $('#time-spent-update').val();
            //console.log(updateLengthOfTime)
            const updateWorkoutDetails = $('#workout-details-update').val();
            const updateFields = {"id": itemId, "workoutType": updateWorkoutType, "lengthOfTime": updateLengthOfTime, "details": updateWorkoutDetails}
            const options = {contentType: "application/json", url: WORKOUT_URL_ENDPOINT, data: JSON.stringify(updateFields), dataType: "json", method: "PUT", headers: { 'Authorization': 'Bearer ' + token }, processData: false}
            console.log(options)
             
            $.ajax(options).done(function() {
                $('main').html(
                    getWorkoutPosts())
                })
            .fail(function() {
                console.log('error');
                
            })
    })
    })
}



function watchForDelete() {
    $('main').on('click', '.dashboard-workout-delete-button', event => {
        event.preventDefault()
        const itemId = $(event.target).data('delete-id')
        console.log(itemId)
        $.ajax({
            
            url: "/workouts/" + itemId,
            method: "DELETE",
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .done(function() {
            $('main').html(
                getWorkoutPosts()
                
            )
            
        })
    })
    
}

getWorkoutPosts()
watchForWorkoutPost()
watchForUpdate()
watchForDelete()