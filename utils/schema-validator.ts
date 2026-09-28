import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv'

const SCHEMA_BASE_PATH = 'response-schemas'
const ajv = new Ajv({ allErrors: true })

export async function validateSchema(directoryName: string, fileName: string, responseBody: object) {
  const schemaPath = path.join(SCHEMA_BASE_PATH, directoryName, `${fileName}_schema.json`)
  const schema = await loadSchema(schemaPath)
  const validate = ajv.compile(schema)
  const valid = validate(responseBody)
  if (!valid) {
    throw new Error(
      `Schema validation failed: ${fileName}_schema.json failed: \n` +
      `${JSON.stringify(validate.errors, null, 2)}\n\n` +
      `Actual response body: \n` +
      `${JSON.stringify(responseBody, null, 2)}`
    )
  }
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