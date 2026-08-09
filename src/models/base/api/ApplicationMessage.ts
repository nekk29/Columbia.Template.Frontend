import { ApplicationMessageType } from './ApplicationMessageType';

export interface ApplicationMessage {
  key: string;
  message: string;
  messageType: ApplicationMessageType;
  messageTypeTitle: string;
  isVisible?: boolean;
}
