import { TokenService } from "./TokenService";

export class ConversationService {
  static getOtherMembers(conversation) {
    const { userId } = TokenService.decodeAccessToken() ?? {};
    return conversation?.members?.filter(member => member?.memberId !== userId);
  }

  static getSeeners(conversation) {
    return conversation?.members?.filter(member => member.hasSeen);
  }

  static getName(conversation) {
    if (conversation?.name)
      return conversation?.name;
    if (conversation?.type === "private")
      return this.getOtherMembers(conversation)?.[0]?.member.username;
    return null;
  }

  static getLastMessage(conversation) {
    if (!conversation?.messages?.length)
      return null;
    return conversation.messages[conversation?.messages?.length-1];
  }

  static getMemberInfo(conversation, userId) {
    if (!conversation?.members)
      return null;

    return conversation?.members?.find(member => member.memberId === userId);
  }
}