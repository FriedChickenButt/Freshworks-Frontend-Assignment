// Animating the initial load of the page
function bodyOnload(){
    console.log(document.getElementById("body_id").className += " load_animation");
}

// Moves search bar to top
function moveSearchTop() {
    form = document.getElementById("form1");
    form.style.position = "fixed";
    form.style.top = 20;
}

// Creates a column of cards
/* 
    Params: 
        data: json fetch data
        coln_width: width of every card in column
*/
function createColumnCard(data, coln_width) {
    var colnDiv = document.createElement("div");
    var outerDiv = document.createElement("div");
    var flagImg = document.createElement("img");
    var countryDetails = document.createElement("div");
    var name = document.createElement("h2");   // Name
    var capital = document.createElement("p");
    var region = document.createElement("p");   // Region
    var currency = document.createElement("p");
    
    colnDiv.setAttribute("style", "width:"+coln_width);
    colnDiv.setAttribute("class", "column");
    colnDiv.setAttribute("onclick", "cardClick(\"" + data["name"] + "\")");
    outerDiv.setAttribute("class", "card");
    flagImg.setAttribute("style", "width: 100%");
    flagImg.setAttribute("alt", "Country Flag");
    flagImg.setAttribute("src", data["flag"]);
    countryDetails.setAttribute("class", "card-container");
    region.innerHTML = "Region: " + data["region"];
    capital.innerHTML = "Capital: " + data["capital"];
    name.innerHTML = data["name"];
    currency.innerHTML = "Currencies: " + data["currencies"][0]["code"];
    for (let i = 1; i < data["currencies"].length; i++) {
            currency.innerHTML += ", " + data["currencies"][i]["code"] ;
    }    
    
    countryDetails.appendChild(name);
    countryDetails.appendChild(region);
    countryDetails.appendChild(capital);
    countryDetails.appendChild(currency);
    outerDiv.appendChild(flagImg);
    outerDiv.appendChild(countryDetails);
    colnDiv.appendChild(outerDiv);
    
    return colnDiv;
}

// Call of onsubmit listener
function submitForm() {
    searchBox = document.getElementById("searchBox");
    searchTitle = document.getElementById("searchTitle");
    if(searchBox.value == "")
        return false;
    else {
        moveSearchTop();
        header = document.getElementsByTagName("header")[0];
        // Eliminating header for cleaner look
        header.style = "display: none;";
        searchTitle.style.display = "none";
        // console.log(searchBox.value);
        container = document.getElementsByClassName("search-results")[0];

        // Clears DIV
        while(container.firstChild) {
            container.removeChild(container.firstChild);
        }                
        h2 = document.createElement("h2");
        select = document.getElementById('select');
        var endpoint = "";
        var extraparam = "";

        // Setting value from dropdown
        if(select.value == "fullname") {
            endpoint = "name";
            extraparam = "&fullText=true";
        }
        else {
            endpoint = select.value;
        }
        
        // Fetch results
        fetch('https://restcountries.eu/rest/v2/'+ endpoint + '/' + searchBox.value + "?fields=name;capital;currencies;flag;region" + extraparam)
            .then(
                function(response) {
                    // Error Handling
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        h3 = document.createElement("h3");
                        ul = document.createElement("ul");
                        li1 = document.createElement("li");
                        li2 = document.createElement("li");
                        li3 = document.createElement("li");
                        h2.setAttribute("class", "result-text");
                        h3.setAttribute("class", "result-text");
                        ul.setAttribute("class", "result-text");
                        h2.innerHTML = "Your search for \"" + searchBox.value + "\" did not match any Countries.";
                        h3.innerHTML = "You might need to:";
                        li1.innerHTML = "Make sure that the country is spelled correctly.";
                        li2.innerHTML = "Type fewer characters.";
                        li3.innerHTML = "Not include special characters.";
                        // container.appendChild(bold);
                        ul.appendChild(li1);
                        ul.appendChild(li2);
                        ul.appendChild(li3);
                        container.appendChild(h2);
                        container.appendChild(h3);
                        container.appendChild(ul);

                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        h2.setAttribute("class", "result-text");
                        h2.innerHTML = "Your search for \"" + searchBox.value + "\" matched " + data.length + " Countries.";
                        container.appendChild(h2);
                        n_coln = parseInt(screen.width/300);
                        let index = 0;
                        coln_width = ""
                        if(n_coln == 0) {
                            n_coln = 1;
                        }
                        coln_width = 100/n_coln + "%";

                        n_row = (data.length/n_coln);
                        console.log(n_row, n_coln, data.length, coln_width);
                        for (let i = 0; i < n_row; i++) {
                            var rowDiv = document.createElement("div");
                            rowDiv.setAttribute("class", "row");
                            for (; index < n_coln*(i+1) && index < data.length; index++) {
                                var colnDiv = createColumnCard(data[index], coln_width);
                                rowDiv.appendChild(colnDiv);
                            }
                            container.appendChild(rowDiv);
                        }
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    }
    return false;
}

// Call of onclick listener of cards
/*
    Params: 
        name: Full country name of the card clicked
*/
function cardClick(name) {
    countryWindow = document.getElementsByClassName("country-window")[0];
    overlay = document.getElementsByClassName("overlay")[0];

    // Checking internet connection
    if(!navigator.onLine) {
        errmsg = document.createElement("h2");
        errmsg.innerHTML = "Please check your internet connection";
        countryWindow.appendChild(errmsg);
        overlay.style.display = "initial";
    }
    fetch('https://restcountries.eu/rest/v2/name/' + name + '?fullText=true')
        .then(
            function(response) {
                if(response.status != 200) {
                    console.log("Error in fetching card details");
                    return;
                }
                response.json().then(function(data) {
                    data = data[0];
                    // Creating a card
                    var card = createColumnCard(data, 300);
                    console.log(data)
                    
                    // Appending extra information to the card
                    var callingCodes = document.createElement("p");
                    var population = document.createElement("p");
                    var latlng = document.createElement("p");
                    var demonym = document.createElement("p");
                    var bordercountry = document.createElement("p");
                    var languages = document.createElement("p");
                    var regionalBlocs = document.createElement("p");

                    callingCodes.innerHTML = "Caling codes: " + data["callingCodes"];
                    for (let i = 1; i < data["callingCodes"].length; i++) {
                        callingCodes.innerHTML += ", " + data["callingCodes"][i];
                    }
                    
                    bordercountry.innerHTML += "Bordering Countries: ";
                    if(data["borders"].length == 0)
                        bordercountry.innerHTML += "None";
                    else {
                        bordercountry.innerHTML += data["borders"][0];
                        for (let i = 1; i < data["borders"].length; i++) {
                            bordercountry.innerHTML += ", " + data["borders"][i];
                            
                        }
                    }

                    languages.innerHTML += "Languages: " + data["languages"][0]["name"];
                    for (let i = 1; i < data["languages"].length; i++) {
                        languages.innerHTML += ", " + data["languages"][i]["name"];
                        
                    }

                    regionalBlocs.innerHTML += "Regional Blocs: ";
                    if(data["regionalBlocs"].length == 0)
                        regionalBlocs.innerHTML += "None";
                    else {
                        regionalBlocs.innerHTML += data["regionalBlocs"][0]["name"] + "(" + data["regionalBlocs"][0]["acronym"] + ")";
                        for (let i = 1; i < data["regionalBlocs"].length; i++) {
                            regionalBlocs.innerHTML += ", " + data["regionalBlocs"][i]["name"] + "(" + data["regionalBlocs"][i]["acronym"] + ")";
                        }
                    }
                    population.innerHTML = "Population: " + data["population"];
                    latlng.innerHTML = "Latitude, Longitude: " + data["latlng"];
                    demonym.innerHTML = "Demonym: " + data["demonym"];
                    
                    var card_con = card.childNodes[0].childNodes[1];
                    card_con.appendChild(callingCodes);
                    card_con.appendChild(latlng);
                    card_con.appendChild(demonym);
                    card_con.appendChild(bordercountry);
                    card_con.appendChild(languages);
                    card_con.appendChild(regionalBlocs);
                    console.log(card);

                    country_win = document.getElementsByClassName("country-window")[0];
                    while(country_win.firstChild) {
                        country_win.removeChild(country_win.firstChild);
                    }            
                    country_win.appendChild(card);

                    overlay.style.display = "initial";
                });
            }
        )
}

// Call of onclick of "x" button
function hideCountryWindow() {
    country_win = document.getElementsByClassName("country-window")[0];
    while(country_win.firstChild) {
        country_win.removeChild(country_win.firstChild);
    }            

    overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "none";
}