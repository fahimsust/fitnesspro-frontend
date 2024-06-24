export const floatToInteger = (floatNumber:number) => 
{
    return floatNumber > 0 ? Math.floor(floatNumber*10000):0;
}