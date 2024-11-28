import axios, { AxiosResponse } from "axios";
import environment from "../../environment";

export default class ApiService {
  private readonly baseUrl: string = environment.apiUrl;
  private readonly requestSettings = {
    withCredentials: true,
  };

  private async refresh(): Promise<AxiosResponse> {
    return await axios
      .get(
        `${this.baseUrl}${environment.refreshCredentialsUrl}`,
        this.requestSettings
      )
      .catch(() => {
        throw new Error("Failed to refresh credentials");
      });
  }

  public async get(url: string): Promise<AxiosResponse> {
    return await axios
      .get(`${this.baseUrl}${url}`, this.requestSettings)
      .catch(async (err) => {
        if (err.response.status !== 401) {
          return err;
        }
        await this.refresh();
        return await axios.get(`${this.baseUrl}${url}`, this.requestSettings);
      });
  }

  public async post(
    url: string,
    data: { [key: string]: unknown }
  ): Promise<AxiosResponse> {
    return await axios
      .post(`${this.baseUrl}${url}`, data, this.requestSettings)
      .catch(async (err) => {
        if (err.response.status !== 401) {
          console.log(err);
          return err;
        }
        await this.refresh();
        return await axios.post(
          `${this.baseUrl}${url}`,
          data,
          this.requestSettings
        );
      });
  }
}
