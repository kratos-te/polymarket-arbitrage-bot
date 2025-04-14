const sendSolayerTx = async (signedTxbase58: string) => {
    const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sendTransaction",
        params: [
            signedTxbase58,
            {
                encoding: "base58",
                skipPreflight: true,
                preflightCommitment: "processed",
                maxRetries: 0,
            },
        ],
    });

    try {
        const res = await fetch("https://acc.solayer.org", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const data = await res.json();
        console.log("TX Response:", data);
        return data;
    } catch (error) {
        console.error("TX Error:", error);
    }
};

export {
    sendSolayerTx
}