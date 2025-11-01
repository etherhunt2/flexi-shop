// Simple test runner for mongodb-utils.isValidObjectId
; (async () => {
    try {
        const mod = await import('../src/lib/mongodb-utils.js')
        const { isValidObjectId } = mod
        const assert = (cond, msg) => {
            if (!cond) throw new Error(msg)
        }

        // Valid ObjectId examples
        assert(isValidObjectId('507f1f77bcf86cd799439011') === true, 'valid ObjectId should return true')
        assert(isValidObjectId('000000000000000000000000') === true, 'all-zero ObjectId should be valid format')

        // Invalid examples
        assert(isValidObjectId('') === false, 'empty string should be invalid')
        assert(isValidObjectId(null) === false, 'null should be invalid')
        assert(isValidObjectId('123') === false, 'short string should be invalid')
        assert(isValidObjectId('zzzzzzzzzzzzzzzzzzzzzzzz') === false, 'non-hex should be invalid')

        console.log('mongodb-utils tests passed')
        process.exit(0)
    } catch (err) {
        console.error('mongodb-utils tests failed:', err)
        process.exit(1)
    }
})()
