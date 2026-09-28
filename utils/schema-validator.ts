import fs from 'fs/promises';
import path from 'path';

const SCHEMA_BASE_PATH = 'response-schemas'

export async function validateSchema(directoryName: string, fileName: string) {
  const schemaPath = path.join(SCHEMA_BASE_PATH, directoryName, `${fileName}_schema.json`)
  const schema = await loadSchema(schemaPath)
  console.log(schema)
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function loadSchema(schemaPath: string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8')
    return JSON.parse(schemaContent)
  } catch (error) {
    throw new Error(`Failed to read the schema file: ${getErrorMessage(error)}`)
  }
}