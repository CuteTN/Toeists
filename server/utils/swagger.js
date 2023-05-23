/**
 * @param {"post"|"get"|"put"|"delete"|"head"|"patch"} method 
 * @param {string} summary 
 * @param {[string]} tags 
 * @param {SwaggerApiParamsType[]} parameters
 * @param {{"$ref": "#/components/schemas/<Model>"}} bodySchema 
 * @param {{"$ref": "#/components/schemas/<Model>"}} responseSchema 
 * @param {boolean} consumesForm 
 */
export const createSwaggerPath = (summary, tags, parameters, bodySchema, responseSchema, consumesForm = false) => {
  const result = {
    summary: summary ?? "",
    tags: tags ?? [],
    parameters: parameters ?? [],
    responses: {
      "200": {
        content: { "application/json": { schema: responseSchema ?? {} } }
      }
    }
  }

  if (bodySchema) {
    const contentType = consumesForm ? "multipart/form-data" : "application/json";

    result.requestBody = {
      requrired: true,
      content: {
        [contentType]: { schema: bodySchema ?? {} }
      }
    }

  }

  if (consumesForm)
    result.consumes = ["multipart/form-data"]
  
  return result;
}

/** @param {SwaggerTypeCommonOptions} opt */
const createType = (type, opt) => ({ ...(opt ?? {}), type })

export const SwaggerTypes = {
  /** @param {SwaggerTypeCommonOptions} opt */
  string: (opt) => createType("string", opt),

  /** @param {SwaggerTypeCommonOptions} opt */
  number: (opt) => createType("number", opt),

  /** @param {SwaggerTypeCommonOptions} opt */
  integer: (opt) => createType("integer", opt),

  /** @param {SwaggerTypeCommonOptions} opt */
  boolean: (opt) => createType("boolean", opt),

  /** @param {SwaggerTypeCommonOptions} opt */
  file: (opt) => createType("string", { ...opt, format: "binary" }),

  /** @param {SwaggerTypeCommonOptions} opt */
  date: (opt) => createType("string", { ...opt, format: "date" }),

  /** @param {SwaggerTypeCommonOptions} opt */
  datetime: (opt) => createType("string", { ...opt, format: "date-time" }),

  /** @param {SwaggerTypeCommonOptions} opt */
  password: (opt) => createType("string", { ...opt, format: "password" }),

  /** @param {SwaggerTypeCommonOptions} opt */
  array: (itemsType, opt) => createType("array", { ...opt, items: itemsType }),

  /** 
   * @param {string[]} values
   * @param {SwaggerTypeCommonOptions} opt 
   */
  enum: (values, opt) => createType("enum", { ...opt, enum: values }),

  /** @param {SwaggerTypeCommonOptions} opt */
  object: (propertiesType, opt) => createType("object", { ...opt, properties: propertiesType }),

  /** @param {string} schemaName */
  ref: (schemaName) => ({ $ref: `#/components/schemas/${schemaName}` }),
}

/**
 * @typedef {object} SwaggerTypeCommonOptions
 * @property {string} description
 * @property {boolean} nullable
 * @property {boolean} readOnly Only appears in GET, not in POST/PUT/PATCH
 * @property {boolean} writeOnly Only appears in POST/PUT/PATCH, not in GET
 * @property {any} example
 */

/**
 * @typedef {object} SwaggerApiParamsType
 * @property {string} name
 * @property {string} description
 * @property {*} schema
 * @property {boolean} required
 * @property {"path"|"query"|"header"|"cookie"} in
 */