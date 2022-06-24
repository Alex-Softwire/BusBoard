var xhttp = new XMLHttpRequest();

xhttp.open('GET', 'http://localhost:3000/departureBoards/nw51tl', true);

xhttp.setRequestHeader('Content-Type', 'application/json');

xhttp.onload = () => {
    const data = JSON.parse(xhttp.response);
    console.log(data);

    document.getElementById("results").innerHTML = `
        <h2>Results</h2>
        ${
            data.map((stop) => {
                return `
                    <h3>${stop.core_information.name} (Distance ${stop.core_information.distance_to.toFixed(2)} m)</h3>
                    <ul>
                       ${
                            stop.arrivals.map((bus) => {
                                return `
                                    <li>ETA ${bus.eta}: ${bus.line} to ${bus.destination} </li>
                                `
                            }).join("")
                        }
                    </ul>
                `;
            }).join("")
        }
    `;
    // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
}

xhttp.send();