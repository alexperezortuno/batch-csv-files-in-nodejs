export default class Utils {
    private static _instance: Utils;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }
}
