import React from 'react';
import { Button, Input, Menu, Modal, Row } from 'antd';
import Text from 'antd/lib/typography/Text';
import { fetchWordInfo } from '../../services/api/dictionary';
import WordDefinitionList from './WordDefinitionList';

const DictionaryModal = ({ visible, initWord, onCancel }) => {
  const [word, setWord] = React.useState("");
  const [wordDefinitions, setWordDefinitions] = React.useState(null);

  React.useEffect(() => {
    if (visible) {
      setWord(initWord);
      handleFetchWordInfo(initWord);
    }
  }, [visible, initWord])

  // React.useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     handleFetchWordInfo(word);
  //   }, 1000);

  //   return () => clearTimeout(timeout);
  // }, [word]);

  const handleFetchWordInfo = (word) => {
    if (word)
      fetchWordInfo(word)
        .then(res => setWordDefinitions(res.data))
        .catch(() => setWordDefinitions(null))
    else
      setWordDefinitions(null);
  }

  return (
    <Modal
      visible={visible}
      title={"Dictionary"}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button className='orange-button' key="submit" type="primary" onClick={onCancel}>
          OK
        </Button>
      ]}
    >
      <Input.Search
        value={word}
        onChange={e => setWord(e.target.value)}
        className='mb-3'
        placeholder='Enter a word to look it up!'
        onSearch={() => handleFetchWordInfo(word)}
      />
      {wordDefinitions ?
        <WordDefinitionList wordDefinitions={wordDefinitions} />
        :
        word? <Text>{"We couldn't find any definitions of your word."}</Text> : <></>
      }
    </Modal>
  );
}

export default DictionaryModal;