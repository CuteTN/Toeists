import { Tag } from 'antd';
import React from 'react';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/all';

const WordPhonetic = ({ phonetic }) => {
  const audio = React.useMemo(() => {
    if (!phonetic?.audio)
      return null;
    else
      return new Audio(phonetic.audio);
  }, [phonetic])

  const handlePlaySound = () => {
    audio?.play();
  }

  return (
    <Tag
      icon={audio? <GiSpeaker size={20} className='mr-1'/> : <GiSpeakerOff size={20} className='mr-1'/>}
      onClick={handlePlaySound}
      style={{ fontSize: 16, cursor: audio? "pointer" : "no-drop" }}
    >
      /{phonetic?.text}/
    </Tag>
  )
}

export default WordPhonetic;