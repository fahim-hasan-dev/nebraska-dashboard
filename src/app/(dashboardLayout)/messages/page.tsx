export const dynamic = "force-dynamic";

import MessagesView from "@/components/page/messages/MessagesView";
import { myFetch } from "@/utils/myFetch";

const MessagesPage = async () => {
  let initialMessages: any[] = [];

  try {
    const response = await myFetch("/message?limit=100", {
      method: "GET",
      cache: "no-store", // Ensure server-side fetch is dynamic
    });

    if (response.success && response.data) {
      // In case backend wraps the list in data.data or similar pagination formats, handle both array and object containing data
      if (Array.isArray(response.data)) {
        initialMessages = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        initialMessages = response.data.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial messages on server-side:", error);
  }

  return (
    <>
      <MessagesView initialMessages={initialMessages} />
    </>
  );
};

export default MessagesPage;

