function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathroom");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}




function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1;
}



function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    const sqft = document.getElementById("uiSqft").value;
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocation").value;
    const estPrice = document.getElementById("uiEstimatedPrice");

    // Input validations
    if (!sqft || isNaN(sqft) || parseFloat(sqft) <= 0) {
        alert("Please enter a valid area in square feet.");
        return;
    }

    if (bhk === -1) {
        alert("Please select number of BHK.");
        return;
    }

    if (bathrooms === -1) {
        alert("Please select number of Bathrooms.");
        return;
    }

    if (!location) {
        alert("Please select a location.");
        return;
    }

    const url = "http://127.0.0.1:5000/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location
    }, function (data, status) {
        console.log(data);
        if (data.estimated_price) {
            estPrice.innerHTML = "<h2>Estimated Price: ₹ " + data.estimated_price.toLocaleString() + " Lakhs</h2>";
        } else {
            estPrice.innerHTML = "<h2>Could not estimate price. Try again.</h2>";
        }
    });
}







function onPageLoad() {
    console.log("Page loaded successfully");

    const url = "http://127.0.0.1:5000/get_location_names";

    $.get(url, function (data, status) {
        if (data && data.locations) {
            const locations = data.locations;
            const uiLocation = document.getElementById("uiLocation");

            uiLocation.innerHTML = '<option value="" disabled selected>Select Location</option>';

            for (let i = 0; i < locations.length; i++) {
                let option = document.createElement("option");
                option.text = locations[i];
                option.value = locations[i];
                uiLocation.appendChild(option);
            }
        } else {
            console.error("No location data received from server.");
        }
    }).fail(function () {
        console.error("Failed to load location data from server.");
    });
}

window.onload = onPageLoad;
