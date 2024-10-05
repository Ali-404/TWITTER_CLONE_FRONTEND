import { useState } from 'react';
import Textarea from 'react-expanding-textarea'
const TextAreaWithEllipsis  = ({text}) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const limitWords = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className='flex flex-wrap relative'>

    <Textarea
      className="text-sm py-4 resize-none w-full outline-none bg-transparent"
      spellCheck={false}
      readOnly
      value={isExpanded ? text : limitWords(text, 20)}
    >
    </Textarea>
    
    <button onClick={() => setIsExpanded(o => !o)} className='absolute bottom-0 right-0 text-emerald-400 italic outline-none'>{
        isExpanded ? 'read less' : 'read more ..'
    }</button>
    </div>
  );
};

export default TextAreaWithEllipsis;
