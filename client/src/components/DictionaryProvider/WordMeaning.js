import Text from 'antd/lib/typography/Text';
import React from 'react';
import COLOR from '../../constants/colors';

const WordMeaning = ({ meaning }) => {
  return (
    <div className='mt-2'>
      <Text strong style={{ color: COLOR.orange, fontSize: 20 }}>
        {meaning?.partOfSpeech}
      </Text>
      {meaning?.definitions?.map((def, i) => (
        <div key={"word-meaning-" + i} className='mb-2'>
          {def?.definition &&
            <Text className='ml-2'>✏️ {def?.definition}</Text>
          }
          <br />
          {def?.example &&
            <div className='ml-4'>
              <Text italic strong style={{ color: COLOR.darkOrange }}>Example: </Text>
              <Text italic>{def?.example}</Text>
            </div>
          }
          {def?.synonyms?.length > 0 &&
            <div className='ml-4'>
              <Text italic strong style={{ color: COLOR.darkOrange }}>Synonyms: </Text>
              <Text italic>{def?.synonyms.join(", ")}.</Text>
            </div>
          }
          {def?.antonyms?.length > 0 &&
            <div className='ml-4'>
              <Text italic strong style={{ color: COLOR.darkOrange }}>Antonyms: </Text>
              <Text italic>{def?.antonyms.join(", ")}.</Text>
            </div>
          }
        </div>
      ))}
    </div>
  )
}

export default WordMeaning;