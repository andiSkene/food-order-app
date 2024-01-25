import { useState, useEffect, useCallback } from 'react';

async function sendHttpRequest(url, config) {
    const response = await fetch(url, config);

    const resData = await response.json();

    //oops! not ok
    if (!response.ok) {
        throw new Error(resData.message || "Something went wrong. Failed to send request.")
    }

    //nothing went wrong so return the data
    return resData;
}

export default function useHttp(url, config, initialData) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [data, setData] = useState(initialData);

    function clearData() {
        setData(initialData);
    }

    //the sendRequest function is stored in local memory and will only be
    //run when the url and/or config are updated from previous
    const sendRequest = useCallback(
        async function sendRequest(data) {
            //set the loading state
            setIsLoading(true);

            try {
                const resData = await sendHttpRequest(url, { ...config, body: data });
                setData(resData);
            } catch (error) {
                setError(error.message || 'Something went wrong!')
            }

            //no longer loading
            setIsLoading(false);
        }, [url, config])

    //sendRequest is defined outside the useEffect function so
    //it has be set as a dependency
    useEffect(() => {
        //check if the config method is GET
        if ((config && (config.method === 'GET' || config.method === undefined)) || !config) {
            sendRequest()
        }
    }, [sendRequest, config]);

    return {
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    }

}