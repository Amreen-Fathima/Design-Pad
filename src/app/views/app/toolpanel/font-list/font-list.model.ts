export const PAGE_LOAD_SIZE = 25;
export const MINIMUM_RESULT_SIZE = 5;

export class PageChangeModel {
  offset: number;
  pageSize: number;
  searchText: string;
  isEnablePageLoad: boolean;
}
