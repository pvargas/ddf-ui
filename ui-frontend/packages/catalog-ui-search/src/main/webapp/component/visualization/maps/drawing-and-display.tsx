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
import React from 'react'
import wreqr from '../../../js/wreqr'
import { useListenTo } from '../../selection-checkbox/useBackbone.hook'
import { useIsDrawing } from '../../singletons/drawing'
import { TypedUserInstance } from '../../singletons/TypedUser'
import { zoomToHome } from './home'
import LocationModel from '../../location-old/location-old'
export const SHAPE_ID_PREFIX = 'shape'
export const getIdFromModelForDisplay = ({ model }: { model: any }) => {
  return `${SHAPE_ID_PREFIX}-${model.cid}-display`
}
export const getIdFromModelForDrawing = ({ model }: { model: any }) => {
  return `${SHAPE_ID_PREFIX}-${model.cid}-drawing`
}
export type DrawModeType = 'line' | 'poly' | 'circle' | 'bbox' | 'keyword'
// from these all other drawings are constructed
const BasicDrawModeTypes: Array<DrawModeType> = [
  'bbox',
  'circle',
  'line',
  'poly',
]
type LocationTypeType =
  | 'LINE'
  | 'POLYGON'
  | 'MULTIPOLYGON'
  | 'BBOX'
  | 'POINTRADIUS'
  | 'POINT'
export const getLocationTypeFromModel = ({ model }: { model: any }) => {
  const type = model.get('type') as LocationTypeType
  return type
}
export const getDrawModeFromModel = ({
  model,
}: {
  model: any
}): DrawModeType => {
  const mode = model.get('mode')
  if (BasicDrawModeTypes.includes(mode)) {
    return mode
  }
  const fallbackType = getLocationTypeFromModel({ model })
  switch (fallbackType) {
    case 'BBOX':
      return 'bbox'
    case 'LINE':
      return 'line'
    case 'MULTIPOLYGON':
      return 'poly'
    case 'POINTRADIUS':
      return 'circle'
    case 'POINT':
      return 'circle'
    case 'POLYGON':
      return 'poly'
    default:
      return 'poly'
  }
}
const extractModelsFromFilter = ({
  filter,
  extractedModels,
}: {
  filter: any
  extractedModels: any[]
}) => {
  if (filter.filters) {
    filter.filters.forEach((subfilter: any) => {
      extractModelsFromFilter({ filter: subfilter, extractedModels })
    })
  } else {
    if (filter.type === 'GEOMETRY') {
      if (filter.value?.areaDetails?.locations) {
        filter.value.areaDetails.locations.map((location: any) => {
          const newLocationModel = new LocationModel(location)
          extractedModels.push(newLocationModel)
        })
      } else {
        const newLocationModel = new LocationModel(filter.value)
        extractedModels.push(newLocationModel)
      }
    }
  }
}
function useOnceIsNearFirstRender({
  howNear = 1000,
  callback,
}: {
  howNear?: number
  callback: () => void
}) {
  const [firstRender, setFirstRender] = React.useState(true)
  const [hasFired, setHasFired] = React.useState(false)
  React.useEffect(() => {
    setFirstRender(false)
  }, [])
  React.useEffect(() => {
    if (!firstRender && !hasFired) {
      const timeoutId = window.setTimeout(() => {
        callback()
        setHasFired(true)
      }, howNear)
      return () => {
        window.clearTimeout(timeoutId)
      }
    }
    return () => {}
  }, [firstRender, howNear, hasFired, callback])
}
export const useDrawingAndDisplayModels = ({
  selectionInterface,
  map,
}: {
  selectionInterface: any
  map: any
}) => {
  const [models, setModels] = React.useState<Array<any>>([])
  const [filterModels, setFilterModels] = React.useState<Array<any>>([])
  const [drawingModels, setDrawingModels] = React.useState<Array<any>>([])
  const isDrawing = useIsDrawing()
  useListenTo(
    (wreqr as any).vent,
    'search:linedisplay search:polydisplay search:bboxdisplay search:circledisplay search:keyworddisplay',
    (model: any) => {
      if (Array.isArray(model)) {
        setModels(
          [...models].concat(
            model.filter((newModel) => !models.includes(newModel))
          )
        )
      } else if (!models.includes(model)) {
        setModels([...models, model])
      }
    }
  )
  const updateFilterModels = React.useMemo(() => {
    return () => {
      const currentQuery = selectionInterface.get('currentQuery')
      const resultFilter = TypedUserInstance.getEphemeralFilter()
      const extractedModels = [] as any[]
      if (currentQuery) {
        extractModelsFromFilter({
          filter: currentQuery.get('filterTree'),
          extractedModels,
        })
      }
      if (resultFilter) {
        extractModelsFromFilter({
          filter: resultFilter,
          extractedModels,
        })
      }
      setFilterModels(extractedModels)
    }
  }, [selectionInterface])
  useListenTo(selectionInterface, 'change:currentQuery', updateFilterModels)
  useListenTo(
    TypedUserInstance.getPreferences(),
    'change:resultFilter',
    updateFilterModels
  )
  useListenTo(
    (wreqr as any).vent,
    'search:drawline search:drawpoly search:drawbbox search:drawcircle',
    (model: any) => {
      if (!drawingModels.includes(model)) {
        setDrawingModels([...drawingModels, model])
      }
    }
  )
  useListenTo(
    (wreqr as any).vent,
    'search:drawline-end search:drawpoly-end search:drawbbox-end search:drawcircle-end search:drawcancel',
    (model: any) => {
      if (drawingModels.includes(model)) {
        setDrawingModels(
          drawingModels.filter((drawingModel) => drawingModel !== model)
        )
      }
    }
  )
  useListenTo((wreqr as any).vent, 'search:drawend', (drawendModels: any[]) => {
    setDrawingModels(
      drawingModels.filter((drawingModel) => {
        return !drawendModels.includes(drawingModel)
      })
    )
    setModels(
      models.filter((drawingModel) => {
        return !drawendModels.includes(drawingModel)
      })
    )
  })
  React.useEffect(() => {
    if (!isDrawing) {
      setDrawingModels([])
    }
  }, [isDrawing])
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      updateFilterModels()
    }, 1000)
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])
  const callback = React.useMemo(() => {
    return () => {
      if (map) {
        const shapesExist = map.panToShapesExtent()
        if (!shapesExist) {
          zoomToHome({ map })
        }
      }
    }
  }, [filterModels, models, map])
  useOnceIsNearFirstRender({ callback })
  return {
    models,
    drawingModels,
    filterModels,
  }
}
