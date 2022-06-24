import axios from "axios"
import {BusStopArrivalModel} from "../models/BusStopArrivalModel.js";
import {BusStopCoreInformationModel} from "../models/BusStopCoreInformationModel.js";
import log4js from "log4js";

const logger = log4js.getLogger('TFLStopPointService.js');

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

        logger.info("Requesting bus stops around coordinate ")

        return axios.get(url)
                   .then((response) => {
                       return response.data.stopPoints.map((stop) => {
                           return new BusStopCoreInformationModel(
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
