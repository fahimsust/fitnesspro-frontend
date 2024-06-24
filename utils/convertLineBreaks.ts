export const convertLineBreaks = (text: string) => {
    let newText = text.replace(/\\r\\n/g, '<br />');
    return newText;
}