import { Menu } from 'antd';
import Text from 'antd/lib/typography/Text';
import React from 'react';
import COLOR from '../../constants/colors';
import WordMeaning from './WordMeaning';
import WordPhonetic from './WordPhonetic';

const WordDefinitionList = ({ wordDefinitions }) => {
  return (
    <div>
      {wordDefinitions.map((definition, i) => (
        <div
          key={"word-def-" + i}
          style={{ backgroundColor: COLOR.pastelOrange, borderRadius: 20 }}
          className='row m-1 p-3'
        >
          <div className='row d-flex'>
            <div className='d-flex col-12 flex-column mb-1'>
              <Text strong style={{ fontSize: 20 }}>
                {definition?.word}
              </Text>
            </div>
            <div className='d-flex col-12 flex-column'>
              <div>
                {definition?.phonetics?.map((phonetic, i) =>
                  <WordPhonetic key={i} phonetic={phonetic} />
                )}
              </div>
            </div>
            <div className='d-flex col-12 flex-column'>
              <div>
                {definition?.meanings?.map((meaning, i) =>
                  <WordMeaning key={i} meaning={meaning} />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WordDefinitionList;