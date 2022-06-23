import axios from "axios"
import {BusStopArrivalModel} from "../models/BusStopArrivalModel.js";
import {BusStopModel} from "../models/BusStopModel.js";

export class TFLStopPointService {
    constructor() {
        this.base_url = "https://api.tfl.gov.uk/StopPoint/";
    }

    async get_bus_stop_arrivals(stop_code) {
        const url = this.base_url + stop_code + "/Arrivals";
        const response = await axios.get(url);
            //console.log("arrivals", response.data)
        return response.data.map((bus) => {
            //console.log("BUS INFO:", bus);
            return new BusStopArrivalModel(
                bus.lineName,
                bus.destinationName,
                bus.timeToStation
            )
        })
    }

    async get_bus_stops_around_coordinate(coordinate, radius=500) {
        const url = this.base_url +"?lat="+coordinate.latitude + "&lon="+coordinate.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius="+radius
        const response = await axios.get(url);


        return response.data.stopPoints.map((stop) => {

            return new BusStopModel(
                stop.id,
                stop.commonName,
                stop.distance
            )
        });
    }
}
