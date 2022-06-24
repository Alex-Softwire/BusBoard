import axios from "axios";

import { Coordinate } from "../models/Coordinates.js"

export class PostCodeService {
    constructor() {
        this.base_url = "https://api.postcodes.io/postcodes/";
    }
    
    async post_code_to_coordinate(post_code) {
        const url = this.base_url + post_code;
        return axios.get(url)
                   .then((response) => {
                       const post_code_information = response.data.result;

                       return new Coordinate(
                           post_code_information.latitude,
                           post_code_information.longitude
                       );
                   })

    }
}