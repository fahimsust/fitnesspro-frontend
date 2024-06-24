export const convertLineBreaksPlain = (text: string) => {
    let newText = text.replace(/\\r\\n/g, '\n');
    return newText;
}