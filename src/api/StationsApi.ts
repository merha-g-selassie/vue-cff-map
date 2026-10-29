import { API_BASE_URL } from '@/constants';
import { StationsResponse } from '@/types';
import HttpClient from './HttpClient';

export class StationsApi extends HttpClient {
  private static instance?: StationsApi;

  private constructor() {
    super(API_BASE_URL);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new StationsApi();
    }

    return this.instance;
  }

  public getStations = async (
    dataset: string,
    nbRows: number,
    startAt: number,
  ): Promise<StationsResponse> => {
    const params = new URLSearchParams({
      limit: String(nbRows),
      offset: String(startAt),
      where: "isocountrycode='CH' AND meansoftransport='TRAIN'",
    });
    const res = await this.instance.get<StationsResponse>(
      `${dataset}/records?${params.toString()}`,
    );
    return res.data;
  };
}
