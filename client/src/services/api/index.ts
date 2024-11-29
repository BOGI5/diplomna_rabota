import axios, { AxiosResponse } from "axios";
import environment from "../../environment";

export default class ApiService {
  private readonly baseUrl: string = environment.apiUrl;
  private readonly requestSettings = {
    withCredentials: true,
  };

  private async refresh(): Promise<void> {
    await axios
      .get(
        `${this.baseUrl}${environment.refreshCredentialsUrl}`,
        this.requestSettings
      )
      .catch(() => {
        console.error("Failed to refresh credentials");
        throw new Error("Failed to refresh credentials");
      });
  }

  public async get(url: string): Promise<AxiosResponse> {
    return await axios
      .get(`${this.baseUrl}${url}`, this.requestSettings)
      .catch(async (err) => {
        if (err.response.status === 401) {
          await this.refresh();
          return await axios.get(`${this.baseUrl}${url}`, this.requestSettings);
        }
        console.error(err);
        throw err;
      });
  }

  public async post(
    url: string,
    data: { [key: string]: unknown }
  ): Promise<AxiosResponse> {
    return await axios
      .post(`${this.baseUrl}${url}`, data, this.requestSettings)
      .catch(async (err) => {
        if (err.response.status === 401) {
          await this.refresh();
          return await axios.post(
            `${this.baseUrl}${url}`,
            data,
            this.requestSettings
          );
        }
        console.error(err);
        throw err;
      });
  }

  public async patch(
    url: string,
    data: { [key: string]: unknown }
  ): Promise<AxiosResponse> {
    return await axios
      .patch(`${this.baseUrl}${url}`, data, this.requestSettings)
      .catch(async (err) => {
        if (err.response.status === 401) {
          await this.refresh();
          return await axios.patch(
            `${this.baseUrl}${url}`,
            data,
            this.requestSettings
          );
        }
        console.error(err);
        throw err;
      });
  }

  public async delete(url: string): Promise<AxiosResponse> {
    return await axios
      .delete(`${this.baseUrl}${url}`, this.requestSettings)
      .catch(async (err) => {
        if (err.response.status === 401) {
          await this.refresh();
          return await axios.delete(
            `${this.baseUrl}${url}`,
            this.requestSettings
          );
        }
        console.error(err);
        throw err;
      });
  }
}
