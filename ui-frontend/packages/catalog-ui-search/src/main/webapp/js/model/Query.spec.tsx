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
import { expect } from 'chai'

import {
  calculateNextIndexForSourceGroupNextPage,
  getMaxIndexForSourceGroup,
} from './Query.methods'

describe('calculation of next index', () => {
  const Examples: Array<
    Parameters<typeof calculateNextIndexForSourceGroupNextPage>[0] & {
      return: ReturnType<typeof calculateNextIndexForSourceGroupNextPage>
    }
  > = [
    {
      sources: ['Geoserver', 'DDF'],
      queryStatus: {},
      isLocal: (id: string) => {
        return ['DDF'].includes(id)
      },
      return: { local: 1, Geoserver: 1 },
      currentIndexForSourceGroup: {},
    },
    {
      sources: ['Geoserver', 'DDF'],
      queryStatus: {
        Geoserver: {
          id: 'Geoserver',
          count: 1,
          hasReturned: true,
          hits: 9535,
          elapsed: 1486,
          successful: true,
          warnings: [],
        },
        DDF: {
          id: 'DDF',
          count: 1,
          hasReturned: true,
          hits: 31,
          elapsed: 496,
          successful: true,
          warnings: [],
        },
      },
      isLocal: (id: string) => {
        return ['DDF'].includes(id)
      },
      return: {
        local: 2,
        Geoserver: 2,
      },
      currentIndexForSourceGroup: { local: 1, Geoserver: 1 },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {},
      return: {
        local: 1,
        WINDOWS: 1,
        LINUX: 1,
        REACT: 1,
      },
      currentIndexForSourceGroup: {},
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {},
      return: {
        local: 1,
        WINDOWS: 1,
        LINUX: 1,
        REACT: 1,
      },
      currentIndexForSourceGroup: {},
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 103,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 3,
          hasReturned: true,
          hits: 12,
          elapsed: 170,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 65,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 534,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 554,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 524,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 13,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 4,
        WINDOWS: 4,
        LINUX: 4,
        REACT: 4,
      },
      currentIndexForSourceGroup: {
        local: 1,
        WINDOWS: 1,
        LINUX: 1,
        REACT: 1,
      },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 20,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 3,
          hasReturned: true,
          hits: 12,
          elapsed: 125,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 60,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 313,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 354,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 308,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 27,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 7,
        WINDOWS: 7,
        LINUX: 7,
        REACT: 7,
      },
      currentIndexForSourceGroup: {
        local: 4,
        WINDOWS: 4,
        LINUX: 4,
        REACT: 4,
      },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 28,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 2,
          hasReturned: true,
          hits: 12,
          elapsed: 152,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 1,
          hasReturned: true,
          hits: 1,
          elapsed: 50,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 366,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 450,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 418,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 18,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 10,
        WINDOWS: 10,
        LINUX: 10,
        REACT: 10,
      },
      currentIndexForSourceGroup: {
        local: 7,
        WINDOWS: 7,
        LINUX: 7,
        REACT: 7,
      },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 19,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 0,
          hasReturned: true,
          hits: 12,
          elapsed: 160,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 50,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 380,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 450,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 366,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 14,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 14,
        WINDOWS: 19,
        LINUX: 19,
        REACT: 19,
      },
      currentIndexForSourceGroup: {
        local: 14,
        WINDOWS: 16,
        LINUX: 16,
        REACT: 16,
      },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 45,
          hasReturned: true,
          hits: 145,
          elapsed: 2754,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 204,
          hasReturned: true,
          hits: 1850,
          elapsed: 5276,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 1,
          hasReturned: true,
          hits: 1,
          elapsed: 106,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 250,
          hasReturned: true,
          hits: 10440,
          elapsed: 6997,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 250,
          hasReturned: true,
          hits: 251,
          elapsed: 10776,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 250,
          hasReturned: true,
          hits: 102176,
          elapsed: 6934,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 4,
          elapsed: 112,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 251,
        WINDOWS: 251,
        LINUX: 251,
        REACT: 251,
      },
      currentIndexForSourceGroup: {
        local: 1,
        WINDOWS: 1,
        LINUX: 1,
        REACT: 1,
      },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 145,
          elapsed: 2480,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 250,
          hasReturned: true,
          hits: 1850,
          elapsed: 13515,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 61,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 250,
          hasReturned: true,
          hits: 10440,
          elapsed: 3959,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 1,
          hasReturned: true,
          hits: 251,
          elapsed: 627,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 250,
          hasReturned: true,
          hits: 102176,
          elapsed: 3880,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 4,
          elapsed: 80,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 501,
        WINDOWS: 501,
        LINUX: 252,
        REACT: 501,
      },
      currentIndexForSourceGroup: {
        local: 251,
        WINDOWS: 251,
        LINUX: 251,
        REACT: 251,
      },
    },
    {
      sources: [
        'READREADREAD',
        'LISTENLISTENLISTEN',
        'TALKTALKTALK',
        'WINDOWS',
        'LINUX',
        'REACT',
        'MACBOOK',
      ],
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 145,
          elapsed: 2371,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 250,
          hasReturned: true,
          hits: 1850,
          elapsed: 26071,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 115,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 250,
          hasReturned: true,
          hits: 10440,
          elapsed: 3635,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 0,
          hasReturned: true,
          hits: 251,
          elapsed: 937,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 250,
          hasReturned: true,
          hits: 102176,
          elapsed: 3580,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 4,
          elapsed: 84,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 751,
        WINDOWS: 751,
        LINUX: 252,
        REACT: 751,
      },
      currentIndexForSourceGroup: {
        local: 501,
        WINDOWS: 501,
        LINUX: 252,
        REACT: 501,
      },
    },
  ]
  it('passes snapshot test cases', (done) => {
    Examples.forEach((example) => {
      console.log(example)
      expect(
        JSON.stringify(
          calculateNextIndexForSourceGroupNextPage({
            queryStatus: example.queryStatus,
            currentIndexForSourceGroup: example.currentIndexForSourceGroup,
            sources: example.sources,
            isLocal: example.isLocal,
          })
        ),
        `Next index for sources not calculated correctly`
      ).to.equal(JSON.stringify(example.return))
    })
    done()
  })
})

describe('calculation of max index', () => {
  const Examples: Array<
    Parameters<typeof getMaxIndexForSourceGroup>[0] & {
      return: ReturnType<typeof getMaxIndexForSourceGroup>
    }
  > = [
    {
      queryStatus: {
        Geoserver: {
          id: 'Geoserver',
          count: 1,
          hasReturned: true,
          hits: 9535,
          elapsed: 1486,
          successful: true,
          warnings: [],
        },
        DDF: {
          id: 'DDF',
          count: 1,
          hasReturned: true,
          hits: 31,
          elapsed: 496,
          successful: true,
          warnings: [],
        },
      },
      isLocal: (id: string) => {
        return ['DDF'].includes(id)
      },
      return: {
        local: 31,
        Geoserver: 9535,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 103,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 3,
          hasReturned: true,
          hits: 12,
          elapsed: 170,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 65,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 534,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 554,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 524,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 13,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 13,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 20,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 3,
          hasReturned: true,
          hits: 12,
          elapsed: 125,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 60,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 313,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 354,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 308,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 27,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 13,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 28,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 2,
          hasReturned: true,
          hits: 12,
          elapsed: 152,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 1,
          hasReturned: true,
          hits: 1,
          elapsed: 50,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 366,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 450,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 418,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 18,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 13,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 19,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 0,
          hasReturned: true,
          hits: 12,
          elapsed: 160,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 50,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 3,
          hasReturned: true,
          hits: 10440,
          elapsed: 380,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 3,
          hasReturned: true,
          hits: 251,
          elapsed: 450,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 3,
          hasReturned: true,
          hits: 102176,
          elapsed: 366,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 0,
          elapsed: 14,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 13,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 45,
          hasReturned: true,
          hits: 145,
          elapsed: 2754,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 204,
          hasReturned: true,
          hits: 1850,
          elapsed: 5276,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 1,
          hasReturned: true,
          hits: 1,
          elapsed: 106,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 250,
          hasReturned: true,
          hits: 10440,
          elapsed: 6997,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 250,
          hasReturned: true,
          hits: 251,
          elapsed: 10776,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 250,
          hasReturned: true,
          hits: 102176,
          elapsed: 6934,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 4,
          elapsed: 112,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 2000,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 145,
          elapsed: 2480,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 250,
          hasReturned: true,
          hits: 1850,
          elapsed: 13515,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 61,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 250,
          hasReturned: true,
          hits: 10440,
          elapsed: 3959,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 1,
          hasReturned: true,
          hits: 251,
          elapsed: 627,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 250,
          hasReturned: true,
          hits: 102176,
          elapsed: 3880,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 4,
          elapsed: 80,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 2000,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
    {
      isLocal: (id: string) => {
        return [
          'TALKTALKTALK',
          'READREADREAD',
          'LISTENLISTENLISTEN',
          'MACBOOK',
        ].includes(id)
      },
      queryStatus: {
        READREADREAD: {
          id: 'READREADREAD',
          count: 0,
          hasReturned: true,
          hits: 145,
          elapsed: 2371,
          successful: true,
          warnings: [],
        },
        LISTENLISTENLISTEN: {
          id: 'LISTENLISTENLISTEN',
          count: 250,
          hasReturned: true,
          hits: 1850,
          elapsed: 26071,
          successful: true,
          warnings: [],
        },
        TALKTALKTALK: {
          id: 'TALKTALKTALK',
          count: 0,
          hasReturned: true,
          hits: 1,
          elapsed: 115,
          successful: true,
          warnings: [],
        },
        WINDOWS: {
          id: 'WINDOWS',
          count: 250,
          hasReturned: true,
          hits: 10440,
          elapsed: 3635,
          successful: true,
          warnings: [],
        },
        LINUX: {
          id: 'LINUX',
          count: 0,
          hasReturned: true,
          hits: 251,
          elapsed: 937,
          successful: true,
          warnings: [],
        },
        REACT: {
          id: 'REACT',
          count: 250,
          hasReturned: true,
          hits: 102176,
          elapsed: 3580,
          successful: true,
          warnings: [],
        },
        MACBOOK: {
          id: 'MACBOOK',
          count: 0,
          hasReturned: true,
          hits: 4,
          elapsed: 84,
          successful: true,
          warnings: [],
        },
      },
      return: {
        local: 2000,
        WINDOWS: 10440,
        LINUX: 251,
        REACT: 102176,
      },
    },
  ]

  it('passes snapshot test cases', (done) => {
    Examples.forEach((example) => {
      console.log(example)
      expect(
        JSON.stringify(
          getMaxIndexForSourceGroup({
            queryStatus: example.queryStatus,
            isLocal: example.isLocal,
          })
        ),
        `Max index for sources not calculated correctly`
      ).to.equal(JSON.stringify(example.return))
    })
    done()
  })
})
