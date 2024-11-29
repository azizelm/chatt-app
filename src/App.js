import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, LoadingIndicator } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";  // StreamChat styles
import "./styles.css";  // Your custom styles
import { chatConfig } from "./config";

// User data
const user = {
  id: 'john',
  name: 'John Doe',
  image: 'https://getstream.imgix.net/images/random_svg/FS.png'
};

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(chatConfig.apiKey);

      // Connect the user
      await chatClient.connectUser(user, chatClient.devToken(user.id));

      // Create and watch the channel
      const channel = chatClient.channel('messaging', 'react-talk', {
        image: 'https://www.drupal.org/files/project-images/react.png',
        name: 'Talk about React',
        members: [user.id],
      });

      await channel.watch();

      setChannel(channel);
      setClient(chatClient);
    }

    init();

    // Cleanup function
    return () => {
      if (client) client.disconnectUser();
    };
  }, [client]);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <div className="chat-container">
      <Chat client={client} theme="team light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader className="channel-header" />
            <MessageList className="message-list" />
            <MessageInput className="message-input-container" />
          </Window>
          <Thread className="thread" />
        </Channel>
      </Chat>
    </div>
  );
}
