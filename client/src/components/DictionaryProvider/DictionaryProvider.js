import React from 'react';
import { message } from 'antd';
import { fetchWordInfo } from '../../services/api/dictionary';
import DictionaryModal from './DictionaryModal';

const MESSAGE_KEY = "dictionary-suggest"

const DictionaryProvider = ({children}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalInitWord, setModalInitWord] = React.useState();

  const handleOpenModal = (word) => {
    setModalInitWord(word);
    setIsModalVisible(true);
  }

  const handleModalCancel = () => {
    setIsModalVisible(false);
  }

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString().trim();
    if(selectedText) {
      message.destroy(MESSAGE_KEY);

      fetchWordInfo(selectedText)
        .then(() => {
          message.info({
            key: MESSAGE_KEY,
            content: `Click here to view the definitions of "${selectedText}".`,
            onClick: () => {
              message.destroy(MESSAGE_KEY);
              handleOpenModal(selectedText);
            },
          })
        })
    }
  }

  return (
    <div onMouseUp={handleMouseUp} >
      {children}
      <DictionaryModal
        visible={isModalVisible}
        initWord={modalInitWord}
        onCancel={handleModalCancel}
      />
    </div>
  )
}

export default DictionaryProvider;