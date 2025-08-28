import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true })
    } catch { }
}

function getUserFile(userId: string) {
    return path.join(DATA_DIR, `${userId}.json`)
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }

        await ensureDataDir()
        const file = getUserFile(userId)
        try {
            const content = await fs.readFile(file, 'utf8')
            const debates = JSON.parse(content)
            return NextResponse.json({ debates })
        } catch (e: any) {
            if (e?.code === 'ENOENT') {
                return NextResponse.json({ debates: [] })
            }
            return NextResponse.json({ error: 'Failed to read debates' }, { status: 500 })
        }
    } catch {
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, debate } = body as { userId?: string, debate?: any }
        if (!userId || !debate) {
            return NextResponse.json({ error: 'Missing userId or debate' }, { status: 400 })
        }

        await ensureDataDir()
        const file = getUserFile(userId)

        let debates: any[] = []
        try {
            const content = await fs.readFile(file, 'utf8')
            debates = JSON.parse(content)
        } catch (e: any) {
            if (e?.code !== 'ENOENT') {
                return NextResponse.json({ error: 'Failed to read debates' }, { status: 500 })
            }
        }

        const newDebate = {
            ...debate,
            id: debate.id || Date.now().toString(),
            createdAt: debate.createdAt || new Date().toISOString()
        }
        debates = [newDebate, ...debates]

        try {
            await fs.writeFile(file, JSON.stringify(debates, null, 2), 'utf8')
        } catch {
            return NextResponse.json({ error: 'Failed to write debates' }, { status: 500 })
        }

        return NextResponse.json({ debate: newDebate, debates })
    } catch {
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
    }
}


