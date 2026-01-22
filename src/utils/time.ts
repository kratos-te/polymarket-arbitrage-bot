export const getCurrentTime = () => {
    return Math.floor(Date.now() / 1000);
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));