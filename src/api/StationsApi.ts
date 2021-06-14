import {
  API_BASE_URL,
  API_SBB_DATASET,
  API_SBB_FACET,
  API_SBB_ROWS,
  API_SBB_START,
} from '@/constants';
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
    facet: string,
    nbRows: number,
    startAt: number,
  ): Promise<StationsResponse> => {
    const url = `${API_SBB_DATASET}${dataset}${API_SBB_FACET}${facet}${API_SBB_ROWS}${nbRows}${API_SBB_START}${startAt}`;
    const res = await this.instance.get<StationsResponse>(url);
    return res.data;
  };
}
