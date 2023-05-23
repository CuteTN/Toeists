import React from 'react';
import { notification } from 'antd';
import { fetchWordInfo } from '../../services/api/dictionary';
import DictionaryModal from './DictionaryModal';
import { CgSearchFound } from 'react-icons/all';
import COLOR from '../../constants/colors';

const NOTI_KEY = "dictionary-suggest"

const DictionaryContext = React.createContext();

/**
 * @returns {{ openDictionaryModal: (word: string) => void, closeDictionaryModal: () => void }}
 */
export const useDictionary = () => {
  return React.useContext(DictionaryContext)
}

const DictionaryProvider = ({ children }) => {
  const messageTimeoutKey = React.useRef(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalInitWord, setModalInitWord] = React.useState();

  const handleOpenModal = (word) => {
    setModalInitWord(word);
    setIsModalVisible(true);
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
  }

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString().trim();
    
    if(modalInitWord?.toLowerCase() === selectedText.toLowerCase() && isModalVisible)
    return;
    clearTimeout(messageTimeoutKey.current);
    
    if (selectedText) {
      messageTimeoutKey.current = setTimeout(() => {
        notification.destroy(NOTI_KEY);

        fetchWordInfo(selectedText)
          .then(() => {
            notification.open({
              key: NOTI_KEY,
              placement: "bottomRight",
              type: "success",
              duration: 2,
              message: `What is "${selectedText}"?`,
              description: `Click here to view the definitions for this word.`,
              icon: <CgSearchFound style={{ color: COLOR.orange }}/>,
              onClick: () => {
                notification.destroy(NOTI_KEY);
                handleOpenModal(selectedText);
              },
              style: {
                cursor: "pointer",
                backgroundColor: COLOR.orangeSmoke,
              }
            })
          })
      }, 500)
    }
  }

  return (
    <DictionaryContext.Provider
      value={{
        openDictionaryModal: handleOpenModal,
        closeDictionaryModal: handleCloseModal,
      }}
    >
      <div onMouseUp={handleMouseUp}>
        {children}
        <DictionaryModal
          visible={isModalVisible}
          initWord={modalInitWord}
          onCancel={handleCloseModal}
        />
      </div>
    </DictionaryContext.Provider>
  )
}

export default DictionaryProvider;