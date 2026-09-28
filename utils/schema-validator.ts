import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv'
import { createSchema } from 'genson-js'
import addFormats from 'ajv-formats'

const SCHEMA_BASE_PATH = 'response-schemas'
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

export async function validateSchema(directoryName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
  const schemaPath = path.join(SCHEMA_BASE_PATH, directoryName, `${fileName}_schema.json`)
  if (createSchemaFlag) await generateNewSchema(responseBody, schemaPath)
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

async function loadSchema(schemaPath: string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8')
    return JSON.parse(schemaContent)
  } catch (error) {
    throw new Error(`Failed to read the schema file: ${getErrorMessage(error)}`)
  }
}

async function generateNewSchema(responseBody: object, schemaPath: string) {
  try {
    const generatedSchema = createSchema(responseBody)
    await fs.mkdir(path.dirname(schemaPath), { recursive: true }) // recursive will make sure that if the folder already exists, it will not replace it
    await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 2))
  } catch (error) {
    throw new Error(`Failed to create schema file: ${getErrorMessage(error)}`)
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}