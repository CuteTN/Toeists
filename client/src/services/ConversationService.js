import { TokenService } from "./TokenService";

export class ConversationService {
  static getOtherMembers(conversation) {
    const { userId } = TokenService.decodeAccessToken() ?? {};
    return conversation.members.filter(member => member?.memberId !== userId);
  }

  static getName(conversation) {
    if (conversation?.name)
      return conversation?.name;
    if (conversation?.type === "private")
      return this.getOtherMembers(conversation)?.[0]?.member.username;
    return null;
  }
}