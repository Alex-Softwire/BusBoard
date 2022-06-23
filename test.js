
import {question} from "readline-sync"
import axios from "axios"
import moment from "moment"

function sort_buses_by_time_to_station(buses) {
    return buses.sort((a, b) => a.timeToStation - b.timeToStation);
}

async function get_first_n_buses(stop_code, n) {
    const url = "https://api.tfl.gov.uk/StopPoint/" + stop_code + "/Arrivals"
    const response = await axios.get(url);

    let buses = response.data;
    buses = sort_buses_by_time_to_station(buses);

    return buses.slice(0, n);
}

function seconds_to_formatted_string(seconds) {
    return moment.utc(seconds * 1000).format("HH:mm:ss");
}

function display_bus_information(bus) {
    console.log(
        `Line: ${bus.lineName}, ` +
        `Destination: ${bus.destinationName}, ` +
        `ETA: ${seconds_to_formatted_string(bus.timeToStation)}.`
    );
}

async function display_stop_information(stop_code) {
    const first_five_buses = await get_first_n_buses(stop_code, 5);

    first_five_buses.forEach(display_bus_information);
}

const stop_code = question("Enter a stop code: ")
await display_stop_information(stop_code)

// 490015367S

