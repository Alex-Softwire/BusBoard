import axios from "axios"
import {BusStopArrivalModel} from "../models/BusStopArrivalModel.js";
import {BusStopModel} from "../models/BusStopModel.js";

export class TFLStopPointService {
    constructor() {
        this.base_url = "https://api.tfl.gov.uk/StopPoint/";
    }

    async get_bus_stop_arrivals(stop_code) {
        const url = this.base_url + stop_code + "/Arrivals";
        return axios.get(url)
            .then((response) => {
                return response.data.map((bus) => {
                    return new BusStopArrivalModel(
                        bus.lineName,
                        bus.destinationName,
                        bus.timeToStation
                    )
                })
            })
            .catch((e) => {
                console.error(`Error while getting bus buses at stop code: "${stop_code}". Message: ${e}`)
            });
    }

    async get_bus_stops_around_coordinate(coordinate, radius=500) {
        const url = this.base_url +"?lat="+coordinate.latitude + "&lon="+coordinate.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius="+radius

        return axios.get(url)
                   .then((response) => {
                       return response.data.stopPoints.map((stop) => {
                           return new BusStopModel(
                               stop.id,
                               stop.commonName,
                               stop.distance
                           )
                       });
                   })
                   .catch((e) => {
                      console.error(`Error while getting bus stops around coordinate (${coordinate}). Message: ${e}`)
                      reject(e);
                   });
    }
}
