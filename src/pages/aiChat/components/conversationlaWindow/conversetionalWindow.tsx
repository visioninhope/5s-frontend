import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './conversationalWindow.module.scss';
import { IoIosAttach, IoMdSettings } from 'react-icons/io';
import { Button } from '../../../../components/button';
import { askChatAction, editChatAction } from '../../aiChatSlice';
import CategoryForm from '../categoryForm/categoryForm';
import { Modal } from '../../../../components/modal';
import { BiCopy } from 'react-icons/bi';
import { ClipLoader } from 'react-spinners';

const ConversetionalWindow = () => {
  const { selectedChat, chats, isLoading, categories } = useAppSelector(
    (state) => state.aiChatState
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<
    'create' | 'edit' | 'remove' | 'removeSource' | 'addSource' | 'chatSettings'
  >('addSource');
  const [prompt, setPrompt] = useState('');
  const dispatch = useAppDispatch();
  const currentChat = chats.find((chat) => chat.id === selectedChat.id);

  const onAskPressHandler = () => {
    dispatch(askChatAction(selectedChat.id, prompt, selectedCategory));
    setPrompt('');
  };

  const onCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    dispatch(editChatAction({ categoryName, chatId: selectedChat.id }));
  };

  return (
    <div className={styles.container}>
      <Modal
        className={styles.modal}
        isOpen={showAddCategoryModal}
        handleClose={() => setShowAddCategoryModal(false)}
      >
        <CategoryForm
          actionType={modalAction}
          closeHandler={() => setShowAddCategoryModal(false)}
        />
      </Modal>
      <div className={styles.chatMessageWrapper}>
        {currentChat?.history.map((message, i) => {
          return (
            <>
              <div
                className={message.author === 'chat' ? styles.chatMessage : styles.userMessage}
                key={i}
              >
                {message.message}
                {message.author === 'chat' && (
                  <div onClick={() => navigator.clipboard.writeText(message.message)}>
                    <BiCopy />
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>
      <div className={styles.inputWrapper}>
        {isLoading && (
          <div>
            <ClipLoader size={28} color={'rgba(254, 97, 0, 1)'} />
          </div>
        )}
        <div
          onClick={() => {
            setModalAction('addSource');
            setShowAddCategoryModal(true);
          }}
        >
          <IoIosAttach />
        </div>
        <div className={styles.useContextTag}>
          <select
            onChange={(e) => {
              onCategorySelect(e.currentTarget.value);
            }}
          >
            <option value={undefined}>@Default</option>
            {categories.map((category) => {
              return (
                <option key={category.name} value={category.name}>{`@${category.name}`}</option>
              );
            })}
          </select>
        </div>
        <input
          className={styles.input}
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
        />
        <Button
          disabled={!prompt}
          className={styles.addChatButton}
          variant={'contained'}
          text={'Chat'}
          onClick={onAskPressHandler}
        />
        <div
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => {
            setModalAction('chatSettings');
            setShowAddCategoryModal(true);
          }}
        >
          <IoMdSettings />
        </div>
      </div>
    </div>
  );
};

export default ConversetionalWindow;
