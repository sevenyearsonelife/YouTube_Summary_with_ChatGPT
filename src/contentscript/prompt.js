// export function getSummaryPrompt(transcript) {
//   return `Title: "${document.title
//     .replace(/\n+/g, " ")
//     .trim()}"\nVideo Transcript: "${truncateTranscript(transcript)
//     .replace(/\n+/g, " ")
//     .trim()}"\nVideo Summary:`;
// }

//优化了提示词
export function getSummaryPrompt(transcript) {
  return `Title: "${document.title
    .replace(/\n+/g, " ")
    .trim()}"\n\nVideo Transcript: "${truncateTranscript(transcript)
    .replace(/\n+/g, " ")
    .trim()}"\n\n------\n\nSummarize the above CONTENT into brief sentences of key points, then provide complete highlighted information in a list, choosing an appropriate emoji for each highlight.
    Your output should use the following format:
    ### Summary
    {brief summary of this content}
    ### Highlights
    - [Emoji] Bullet point with complete explanation\n\n------\n\nAfter summarizing the CONTENT, you need to ask 5 relevant questions based on the CONTENT and answer them strictly based on the CONTENT. Presented in the form of question and answer pairs:
    ### Questions & Answers
    #### Q1: question1
    A1: answer1
    #### Q2: question2
    A2: answer2`;
}

// Seems like 15,000 bytes is the limit for the prompt
//const limit = 14000; // 1000 is a buffer

// 扩充了提示词的长度
const limit = 14000*1000; // 1000 is a buffer

export function getChunckedTranscripts(textData, textDataOriginal) {

  // [Thought Process]
  // (1) If text is longer than limit, then split it into chunks (even numbered chunks) 
  // (2) Repeat until it's under limit
  // (3) Then, try to fill the remaining space with some text 
  // (eg. 15,000 => 7,500 is too much chuncked, so fill the rest with some text)

  let result = "";
  const text = textData.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
  const bytes = textToBinaryString(text).length;

  if (bytes > limit) {
    // Get only even numbered chunks from textArr
    const evenTextData = textData.filter((t, i) => i % 2 === 0);
    result = getChunckedTranscripts(evenTextData, textDataOriginal);
  } else {
    // Check if any array items can be added to result to make it under limit but really close to it
    if (textDataOriginal.length !== textData.length) {
      textDataOriginal.forEach((obj, i) => {
        
        if (textData.some(t => t.text === obj.text)) { return; }
        
        textData.push(obj);
        
        const newText = textData.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
        const newBytes = textToBinaryString(newText).length;
        
        if (newBytes < limit) {

          const nextText = textDataOriginal[i + 1];
          const nextTextBytes = textToBinaryString(nextText.text).length;

          if (newBytes + nextTextBytes > limit) {
            const overRate = ((newBytes + nextTextBytes) - limit) / nextTextBytes;
            const chunkedText = nextText.text.substring(0, Math.floor(nextText.text.length * overRate));
            textData.push({ text: chunkedText, index: nextText.index });
            result = textData.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
          } else {
            result = newText;
          }
        }

      })
    } else {
      result = text;
    }
  }

  const originalText = textDataOriginal.sort((a, b) => a.index - b.index).map(t => t.text).join(" ");
  return (result == "") ? originalText : result; // Just in case the result is empty
  
}

function truncateTranscript(str) {
  const bytes = textToBinaryString(str).length;
  if (bytes > limit) {
    const ratio = limit / bytes;
    const newStr = str.substring(0, str.length * ratio);
    return newStr;
  }
  return str;
}

function textToBinaryString(str) {
  let escstr = decodeURIComponent(encodeURIComponent(escape(str)));
  let binstr = escstr.replace(/%([0-9A-F]{2})/gi, function (match, hex) {
    let i = parseInt(hex, 16);
    return String.fromCharCode(i);
  });
  return binstr;
}