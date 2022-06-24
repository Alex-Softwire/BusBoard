import moment from "moment"

export class Util {
    static seconds_to_formatted_string(seconds) {
       return moment.utc(seconds * 1000).format("HH:mm:ss");
    }
}