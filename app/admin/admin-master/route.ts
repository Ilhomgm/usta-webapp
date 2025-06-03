import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const mastersFile = path.join(process.cwd(), 'data', 'masters.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.category || !body.phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const newMaster = {
      id: Date.now(),
      name: body.name,
      category: body.category,
      phone: body.phone,
    }

    let masters = []
    if (fs.existsSync(mastersFile)) {
      const fileData = fs.readFileSync(mastersFile, 'utf-8')
      masters = JSON.parse(fileData)
    }

    masters.push(newMaster)
    fs.writeFileSync(mastersFile, JSON.stringify(masters, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
