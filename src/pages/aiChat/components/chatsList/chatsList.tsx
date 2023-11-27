import React, { useState } from 'react';
import styles from './chatsList.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import ChatCard from '../chatCard/chatCard';
import { Button } from '../../../../components/button';
import { Plus } from '../../../../assets/svg/SVGcomponent';
import { addChatAction, removeChatAction, setSelectedChatAction } from '../../aiChatSlice';
import ChatsListSettingsSidebar from '../chatsListSettingsSidebar/chatsListSettingsSidebar';

const ChatsList = () => {
  const { categories, selectedChat } = useAppSelector((state) => state.aiChatState);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ? categories[0].name : '');
  const [showSettingsSidebar, setShowSettingsSidebar] = useState<boolean>(false);
  const currentCategory = categories.find((cat) => cat.name === selectedCategory);

  const dispatch = useAppDispatch();

  return (
    <div className={styles.container}>
      <ChatsListSettingsSidebar
        isOpened={showSettingsSidebar}
        chat={currentCategory?.chats.find((c) => c.id === selectedChat?.id)}
      />
      <div className={styles.chatsWrapper}>
        <select
          defaultValue={categories[0]?.name}
          onChange={(e) => setSelectedCategory(e.currentTarget.value)}
        >
          {categories.map((category) => {
            return <option key={category.name}>{`@${category.name}`}</option>;
          })}
        </select>
        <div>
          {categories
            .find((cat) => cat.name === selectedCategory)
            ?.chats.map((chat, i) => {
              return (
                <ChatCard
                  name={chat.name}
                  active={selectedChat ? chat.id === selectedChat.id : false}
                  onClickHandler={() => dispatch(setSelectedChatAction(chat))}
                  key={i}
                  onSettingsPress={() => setShowSettingsSidebar((prev) => !prev)}
                  onRemovePress={() => dispatch(removeChatAction(chat.categoryName, chat.id))}
                  chatId={chat.id}
                  categoryName={chat.categoryName}
                />
              );
            })}
        </div>
      </div>
      <Button
        className={styles.addChatButton}
        variant={'contained'}
        text={'Add chat'}
        IconLeft={Plus}
        onClick={() => dispatch(addChatAction(selectedCategory))}
      />
    </div>
  );
};

export default ChatsList;