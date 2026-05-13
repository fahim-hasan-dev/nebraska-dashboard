import MessagesView from "@/components/page/messages/MessagesView";
import { demoMessagesData } from "@/demoData/messages";

const MessagesPage = async () => {
  return (
    <>
      <MessagesView messages={demoMessagesData as never[]} />
    </>
  );
};

export default MessagesPage;

