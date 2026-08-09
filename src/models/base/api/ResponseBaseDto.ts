import type { ApplicationMessage } from './ApplicationMessage';

export interface ResponseBaseDto {
  isValid: boolean;
  messages: ApplicationMessage[];
}

export class ResponseBaseUtils {
  static getMessages(response: ResponseBaseDto): string {
    let messages = '';

    if (response.messages) {
      response.messages.forEach((item) => messages = messages + item.message + '\n')
    }

    return messages;
  };
}
