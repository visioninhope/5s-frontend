export const getIsInternet = (URL) =>{
    return URL.includes('localhost') || URL.includes('com')|| URL.includes('app') ? true : false;
    
}