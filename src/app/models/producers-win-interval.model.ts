export interface ProducerWinInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducersWinIntervalResponse {
  min: ProducerWinInterval[];
  max: ProducerWinInterval[];
} 