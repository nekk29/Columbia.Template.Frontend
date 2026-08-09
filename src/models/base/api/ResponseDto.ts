import { type ResponseBaseDto } from './ResponseBaseDto';

export interface ResponseDto<T> extends ResponseBaseDto {
  data: T | null;
}
