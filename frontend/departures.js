function handle_form() {
    let post_code = document.getElementById("post_code").value;

    get_departures_info(post_code)
}

function get_departures_info(post_code) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', `http://localhost:3000/departureBoards/${post_code}`, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = () => {
        switch (xhttp.status) {
            case 200:
                    const data = JSON.parse(xhttp.response);

                    document.getElementById("results").innerHTML = `
                        <h2>Results</h2>
                        ${
                                data.map((stop) => {
                                    return `
                                    <h3>${stop.core_information.name} (Distance ${stop.core_information.distance_to.toFixed(1)}m)</h3>
                                   ${
                                        (stop.arrivals.length) ? (`
                                        <ul>
                                            ${
                                                stop.arrivals.map((bus) => {
                                                    return `<li>${seconds_to_hh_mm_ss(bus.eta)}: ${bus.line} to ${bus.destination}</li>`
                                                }).join("")
                                            }
                                        </ul>`
                                        ): "No buses."
                                      }
                                `;
                                }).join("")
                            }
                    `;
                break;
            case 404:
                document.getElementById("results").innerHTML = `<h3>Unable to find departures around postcode ${post_code}.</h3>`;
                break;
            default:
                document.getElementById("results").innerHTML = `<h3>Unable to find departures (error code ${xhttp.status}).</h3>`;
                break;
        }
    }

    xhttp.send();
}

function seconds_to_hh_mm_ss(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);

    return `${h}h ${m}m ${s}s`;
}