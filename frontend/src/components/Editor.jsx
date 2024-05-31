import React, { useCallback, useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { ACTIONS } from '../socket/actions';

function Editor({socketRef, code}) {

  const [codeState, setCodeState] = useState();
  useEffect(()=>{
    setCodeState(code)
    console.log("Code Change")
  },[code])

  console.log("Code: ", code)
  socketRef.current?.on(ACTIONS.SYNC_CODE,({code})=>{
    setCodeState(code)
    console.log("SYNC_CODE: ", code)
  })

  const onChange = useCallback((value, viewUpdate) => {

    socketRef.current.emit(ACTIONS.CODE_CHANGE,{code: value})

 
  }, []);

  return (
    <CodeMirror
      value={codeState}
      height="100vh"
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
      theme={"dark"}
      className='text-2xl'
      placeholder={"Please enter the code"}
    
    />
  );
}
export default Editor;
