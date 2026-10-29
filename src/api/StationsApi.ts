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

  public getRecords = async <T>(
    dataset: string,
    nbRows: number,
    startAt: number,
    where: string,
  ): Promise<StationsResponse<T>> => {
    const params = new URLSearchParams({
      limit: String(nbRows),
      offset: String(startAt),
      where,
    });
    const res = await this.instance.get<StationsResponse<T>>(
      `${dataset}/records?${params.toString()}`,
    );
    return res.data;
  };
}
