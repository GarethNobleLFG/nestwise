export const textizer = async (profileData, lastChatbotResponse, formattedData, setFormattedData, setIsFormatting) => {
    if (Object.keys(profileData).length === 0) {
        return;
    }

    setIsFormatting(true);

    try {
        const response = await fetch('http://localhost:8000/textizer/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                profileData: profileData,
                lastChatbotResponse: lastChatbotResponse,
                formattedContext: formattedData
            })
        });

        if (!response.ok) {
            throw new Error('Textizer API call failed.');
        }

        const textizerReturn = await response.json();
        setFormattedData(textizerReturn);
    }
    catch (error) {
        // FALL BACK FORMATTING IF THIS BREAKS
        console.error('Textizer API error:', error);
        const fallback = {};
        Object.entries(profileData).forEach(([key, value]) => {
            fallback[key] = value === false || value === null ? "" : String(value);
        });
        setFormattedData(fallback);
    }
    finally {
        setIsFormatting(false);
    }
};