export const decodeHtml = (html: string) => {
    if (typeof window !== 'undefined') {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return convertLineBreaks(txt.value);
    }
    return convertLineBreaks(html);
}