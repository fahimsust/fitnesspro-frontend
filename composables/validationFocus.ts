
export const validationFocus = (fieldList:object, erros:object) => {
    for (const [key, value] of Object.entries(fieldList)) {
        if(key in erros)
        {
            document.getElementById(key)?.focus();
            break
        }
    }
}