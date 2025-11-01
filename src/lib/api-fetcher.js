/**
 * Generic fetch wrapper for API calls
 */
export const fetcher = async (url) => {
    const response = await fetch(url)

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.')
        error.status = response.status

        // Try to parse error details from response
        try {
            error.info = await response.json()
        } catch (parseError) {
            error.info = { message: response.statusText }
        }

        throw error
    }

    return response.json()
}