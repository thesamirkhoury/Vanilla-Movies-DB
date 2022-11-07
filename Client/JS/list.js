
$(document).ready(function () {
    $(".new-seasons-check").hide();
    $(".edit-seasons-check").hide();
    $("#already-exists-actor").hide();

    $.ajax({
        type: "GET",
        url: "/movie",
        success: function (response) {
            $.each(response, function (index, details) { 
                 createRow(details.id,details.name,details.picture,details.rating,details.date);
            });
        }
    });

});


// table row template
function createRow(movieId,name,picture,rating,prodDate){
    let table=document.getElementById("movies-table-body");

    let tr=document.createElement("tr");
    
    let td="<td>"+movieId+"</td>\n"+
    "<td class=\"sortTable\">"+name+"</td>\n"+
    "<td class=\"sortTable\"> <a href=\""+picture+"\" target=\"_blank\">"+picture+"</td>\n"+
    "<td>"+rating+"</td>\n"+
    "<td>"+prodDate+"</td>\n"+
    "<td>\n"+
    "<button type=\"button\" class=\"btn btn-primary\" value=\""+movieId+"\" onclick=\"getMovieDetails(this)\" data-bs-toggle=\"modal\" data-bs-target=\"#edit-movie\">Edit Details</button>\n"+
    "<button type=\"button\" class=\"btn btn-secondary\" value=\""+movieId+"\" onclick=\"actorMovieID(this)\" data-bs-toggle=\"modal\" data-bs-target=\"#add-actor\">Add Actor</button>\n"+
    "<button type=\"button\" class=\"btn btn-info\"value=\""+movieId+"\" onclick=\"viewActors(this)\" data-bs-toggle=\"modal\" data-bs-target=\"#view-actors\" >View Actors</button>\n"+
    "<button type=\"button\" class=\"btn btn-danger\" value=\""+movieId+"\" onclick=\"deleteMovie(this)\" >Delete Movie</button>\n"+
    "</td>\n";

    tr.innerHTML=td;
    table.appendChild(tr);
}

//check if the media is a series
function isSeriesCheck(btn){
    let submitBtn=document.getElementById("new-movie-submit");
    let seasonsInput=document.getElementById("new-episode");

    if(document.getElementById('isSeries').checked){
        $(".new-seasons-check").show();
        seasonsInput.required=true; 
    }
    else{
        $(".new-seasons-check").hide();
        seasonsInput.required=false;
    }
}

//deletes a movie from the DB.
function deleteMovie(btn){
    let id=btn.value;
    $.ajax({
        type: "DELETE",
        url: `movie/${id}`,
        success: function (response) {
            location.href="/list";
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

// Displays all the actors of a movie
function viewActors(btn){
    let id=btn.value;
    clearActorsTable();

    $.ajax({
        type: "GET",
        url: `/movie/${id}`,
        success: function (response) {
            let name=response.name;
            response=response.actors;
            document.getElementById("view-actors-title").innerHTML=`${name}'s Actors list`;
            document.getElementById("del-actor-movie-id").value=id;
            $.each(response, function (index, details) {
                 createActorTable(details.name, details.picture, details.site)
            });
        },error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}
//actor table row template
function createActorTable(actorName,actorPicture,actorSite){
    let table=document.getElementById("actors-table-body");

    let tr=document.createElement("tr");
    let td="<td>"+actorName+"</td>\n"+
    "<td> <a href=\""+actorPicture+"\" target=\"_blank\">"+actorPicture+"</td>\n"+
    "<td> <a href=\""+actorSite+"\" target=\"_blank\">"+actorSite+"</td>\n"+
    "<td>\n"+
    "<button type=\"button\" class=\"btn btn-danger\" value=\""+actorName+"\" onclick=\"deleteActor(this)\"> Delete </button>\n"+ 
    "</td>\n";
    tr.innerHTML=td;
    table.appendChild(tr);
}
//delete all actor table elements
function clearActorsTable(){
    let table=document.getElementById("actors-table-body");
    while(table.hasChildNodes()){
        table.removeChild(table.firstChild);
    }
}

// gets the movie details and displays them in the edit modal
function getMovieDetails(btn){

    let id=btn.value;
    $(".edit-seasons-check").hide();
    document.getElementById("edit-isSeries").checked = false;
    document.getElementById("edit-seasons").defaultValue="";
    document.getElementById("edit-seasons").required=false;

    $.ajax({
        type: "GET",
        url: `/movie/${id}`,
        success: function (response) {
            document.getElementById("movie-id").value=response.id;
            document.getElementById("edit-name").defaultValue=response.name;
            document.getElementById("edit-picture").defaultValue=response.picture;
            document.getElementById("edit-director").defaultValue=response.director;
            document.getElementById("edit-prod-date").defaultValue=response.date;
            document.getElementById("edit-rating").defaultValue=response.rating;
            document.getElementById("edit-isSeries").checked=response.isSeries;
            if(response.isSeries===true){
                 $(".edit-seasons-check").show();
                document.getElementById("edit-seasons").defaultValue=response.series_details;
                document.getElementById("edit-seasons").required=true;

            }
            else{
                $(".edit-seasons-check").hide();
                document.getElementById("edit-seasons").required=false;
            }
        }
    });
}

// checks if a movie is updated to a series and if so, displays the seasons input, and the other way around.
function updateIsChecked(){
    let seasonsInput=document.getElementById("edit-seasons");

    if(document.getElementById('edit-isSeries').checked){
        $(".edit-seasons-check").show();
        seasonsInput.required=true; 
    }
    else{
        $(".edit-seasons-check").hide();
        document.getElementById("edit-seasons").defaultValue="";
        seasonsInput.required=false; 
    }
}

// gets all actors from the DB and displays them in the add actor modal
function actorMovieID(btn){
    let id=btn.value;
    document.getElementById("actor-movie-id").defaultValue=id;
    clearOptions();
    $("#already-exists-actor").hide();
    $.ajax({
        type: "GET",
        url: "/actors",
        success: function (response) {
            createOption("", "Select an actor");
            $.each(response, function (index, details) {
                createOption(details._id, details.name)
            });
        },error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });

}
// creates a new option for every actor in the DB
function createOption(actorID, actorName){
    let dropdown=document.getElementById("actors-select");
    let option=document.createElement("option");
    option.value=actorID;
    option.innerHTML=actorName;
    dropdown.appendChild(option);
}
// clears the options of the select element
function clearOptions(){
    let dropdown=document.getElementById("actors-select");
    while(dropdown.hasChildNodes()){
        dropdown.removeChild(dropdown.firstChild);
    }
}

//creates the movie in the DB
function addMovie(){
    let id=document.getElementById("new-id").value;
    let name=document.getElementById("new-name").value;
    let picture=document.getElementById("new-picture").value;
    let director=document.getElementById("new-director").value;
    let date=document.getElementById("new-prod-date").value;
    let rating=document.getElementById("new-rating").value;
    
    let data;

    if(document.getElementById('isSeries').checked){
        let seasons=document.getElementById("new-episode").value;
        let seasonsArr=seasons.split(",");
        data=JSON.stringify({
            "id": id,
            "name": name,
            "picture": picture,
            "director": director,
            "date": date,
            "rating":rating,
            "isSeries": true,
            "series_details":seasonsArr
        });

    }
    else{
        data=JSON.stringify({
            "id": id,
            "name": name,
            "picture": picture,
            "director": director,
            "date": date,
            "rating":rating,
            "isSeries": false
        });
    }
    
    document.getElementById("new-movie-submit").setAttribute("data-bs-dismiss", "modal")
    $.ajax({
        type: "POST",
        url: "/movie",
        contentType: 'application/json',
        data: data,
        processData: false,
        encode: true,
        success: function (response) {
            location.href="/list";
        },
        error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
        }
        });
}
// adds an actor to a movie from a list of dropdown options
function addActor(e){
    e.preventDefault();

    let movieId=document.getElementById("actor-movie-id").value;
    let actorId=document.getElementById("actors-select").value;


    $.ajax({
        type: "POST",
        url: `/movie/${movieId}/actor/${actorId}`,
        contentType: 'application/json',
        processData: false,
        encode: true,
        success: function (response) {
            location.href="/index";
        },
        error: function( jqXhr, textStatus, errorThrown ){
            if(jqXhr.responseText==="Actor already added to this movie"){
                $("#already-exists-actor").show();
            }
            console.log(errorThrown);
        }
    });   

}

// creates a new actor.
function createActor(){
    let name=document.getElementById("create-actor-name").value;
    let picture=document.getElementById("create-actor-picture").value;
    let site=document.getElementById("create-actor-site").value;

    let data=JSON.stringify({
        "name": name,
        "picture": picture,
        "site": site
    });

    $.ajax({
        type: "POST",
        url: `/actor`,
        contentType: 'application/json',
        data: data,
        processData: false,
        encode: true,
        success: function (response) {
            location.href="/index";
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });   

}
// removes an actor from a movie
function deleteActor(btn){
    let actorName=btn.value;
    let movieID=document.getElementById("del-actor-movie-id").value;
    $.ajax({
        type: "DELETE",
        url: `movie/${movieID}/actor/${actorName}`,
        success: function (response) {
            location.href="/index";
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

//updates a movie
function updateData(){
    let id=document.getElementById("movie-id").value;
    let name=document.getElementById("edit-name").value;
    let picture=document.getElementById("edit-picture").value;
    let director=document.getElementById("edit-director").value;
    let date=document.getElementById("edit-prod-date").value;
    let rating=document.getElementById("edit-rating").value;

    let data;

    if(document.getElementById('edit-isSeries').checked){
        let seasons=document.getElementById("edit-seasons").value;
        let seasonsArr=seasons.split(",");
        data=JSON.stringify({
            "name": name,
            "picture": picture,
            "director": director,
            "date": date,
            "rating":rating,
            "isSeries": true,
            "series_details":seasonsArr
        });


    }
    else{
        data=JSON.stringify({
            "name": name,
            "picture": picture,
            "director": director,
            "date": date,
            "rating":rating,
            "isSeries": false
        });
    }
    $.ajax({
        type: "PUT",
        url: `/movie/${id}`,
        contentType: 'application/json',
        data: data,
        processData: false,
        encode: true,
        success: function (response) {
            location.href="/list";   
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}


//Sort Table. --check value if 0;

//sort by ratings
let ratingAscending=false;
function sortByRating(){
    if(ratingAscending===false){
        ratingAscending=true;
        sortRatingAsc();
    }
    else{
        ratingAscending=false;
        sortRatingDesc();
    }
}
// sort rating ascending order
function sortRatingAsc(){
    let table=document.getElementById("movies-table-body");
    let rows=table.rows;
    let rowArray=[];
    for(let i=0;i<rows.length;i++){
        rowArray.push(rows[i]);
    }
    rowArray.sort(function(a,z){
            return a.cells[3].innerHTML-z.cells[3].innerHTML;
    }
    );
    for(let i=0;i<rowArray.length;i++){
        table.appendChild(rowArray[i]);
    }
}
// sort rating descending order
function sortRatingDesc(){
    let table=document.getElementById("movies-table-body");
    let rows=table.rows;
    let rowArray=[];
    for(let i=0;i<rows.length;i++){
        rowArray.push(rows[i]);
    }
    rowArray.sort(function(a,z){
            return z.cells[3].innerHTML-a.cells[3].innerHTML;
    }
    );
    for(let i=0;i<rowArray.length;i++){
        table.appendChild(rowArray[i]);
    }
}

//sort by name
let nameAscending=false;
function sortByName(){
    if(nameAscending===false){
        nameAscending=true;
        sortNameAsc();
    }
    else{
        nameAscending=false;
        sortNameDesc();
    }
}
// sort name ascending order
function sortNameAsc(){
    let table=document.getElementById("movies-table-body");
    let rows=table.rows;
    let rowArray=[];
    for(let i=0;i<rows.length;i++){
        rowArray.push(rows[i]);
    }
    rowArray.sort(function(a,z){
            return a.cells[1].innerHTML.localeCompare(z.cells[1].innerHTML);
    }
    );
    for(let i=0;i<rowArray.length;i++){
        table.appendChild(rowArray[i]);
    }
}
// sort name descending order
function sortNameDesc(){
    let table=document.getElementById("movies-table-body");
    let rows=table.rows;
    let rowArray=[];
    for(let i=0;i<rows.length;i++){
        rowArray.push(rows[i]);
    }
    rowArray.sort(function(a,z){
            return z.cells[1].innerHTML.localeCompare(a.cells[1].innerHTML);
    }
    );
    for(let i=0;i<rowArray.length;i++){
        table.appendChild(rowArray[i]);
    }
}

//sort by date
let dateAscending=false;
function sortByDate(){
    if(dateAscending===false){
        dateAscending=true;
        sortDateAsc();
    }
    else{
        dateAscending=false;
        sortDateDesc();
    }
}
// sort date ascending order
function sortDateAsc(){
    let table=document.getElementById("movies-table-body");
    let rows=table.rows;
    let rowArray=[];
    for(let i=0;i<rows.length;i++){
        rowArray.push(rows[i]);
    }
    rowArray.sort(function(a,z){
        return new Date(a.cells[4].innerHTML)-new Date(z.cells[4].innerHTML);
    }
    );
    for(let i=0;i<rowArray.length;i++){
        table.appendChild(rowArray[i]);
    }
}
// sort date descending order
function sortDateDesc(){
    let table=document.getElementById("movies-table-body");
    let rows=table.rows;
    let rowArray=[];
    for(let i=0;i<rows.length;i++){
        rowArray.push(rows[i]);
    }
    rowArray.sort(function(a,z){
            return new Date(z.cells[4].innerHTML)-new Date(a.cells[4].innerHTML);
    }
    );
    for(let i=0;i<rowArray.length;i++){
        table.appendChild(rowArray[i]);
    }
}