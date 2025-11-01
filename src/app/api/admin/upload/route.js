import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import { writeFile } from 'fs/promises'

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            )
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPG, PNG and WEBP are allowed' },
                { status: 400 }
            )
        }

        // Create a unique filename
        const timestamp = Date.now()
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-')
        const filename = `${timestamp}-${originalName}`

        // Save the file
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Define the upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        // Save the file
        await writeFile(path.join(uploadDir, filename), buffer)

        // Return the URL
        return NextResponse.json({
            url: `/uploads/${filename}`
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}