/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import fetch from '../fetch'
import { postAuditLog } from '../audit/audit-endpoint'
import { LazyQueryResult } from '../../../js/model/LazyQueryResult/LazyQueryResult'

export enum Transformer {
  Metacard = 'metacard',
  Query = 'query',
}

export type ResultSet = {
  cql: string
  src?: string
  srcs?: string[]
  start?: number
  count: number
}

export type ExportBody = {
  searches: ResultSet[]
  count: number
  sorts: Object[]
  args?: Object
}

export interface ExportCountInfo {
  exportSize: string
  selectionInterface: any
  customExportCount: number
}

export type DownloadInfo = {
  exportFormat: string
  exportSize: string
  customExportCount: number
  selectionInterface: any
  filteredAttributes: any[]
}

export const getExportResults = (results: LazyQueryResult[]) => {
  return results.map((result) => getExportResult(result))
}

const getResultId = (result: LazyQueryResult) => {
  const id = result.plain.id

  return encodeURIComponent(id)
}

const getResultSourceId = (result: LazyQueryResult) => {
  const sourceId = result.plain.metacard.properties['source-id']

  return encodeURIComponent(sourceId)
}

export const getExportResult = (result: LazyQueryResult) => {
  return {
    id: getResultId(result),
    source: getResultSourceId(result),
    attributes: Object.keys(result.plain.metacard.properties),
  }
}

export const getExportOptions = async (type: Transformer) => {
  const response = await fetch(`./internal/transformers/${type}`)
  return await response.json()
}

export const exportResult = async (
  source: string,
  id: string,
  transformer: string,
  attributes: string
) => {
  const response = await fetch(
    `/services/catalog/sources/${source}/${id}?transform=${transformer}&columnOrder=${attributes}`
  )
  await postAuditLog({
    action: 'exported',
    component: 'metacard',
    items: [{ id, 'source-id': source }],
  })
  return response
}

export const exportResultSet = async (
  transformer: string,
  body: ExportBody
) => {
  return await fetch(`./internal/cql/transform/${transformer}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
