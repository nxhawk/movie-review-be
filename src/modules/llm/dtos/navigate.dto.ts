export class NavigateDto {
  status: number;
  data: {
    route: string;
    params: {
      movie_ids: string[];
      keyword: string;
    };
  };
}
